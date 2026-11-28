#!/usr/bin/env node
// Translate the docs into every target locale with an OpenAI-compatible
// Chat Completions API (SandBase by default).
//
//   npm run i18n:translate -- [options]
//
// Options:
//   --locales zh-CN,ja   Only these locales (default: all target locales).
//   --pages guides/      Only English pages whose path starts with a prefix
//                        (comma-separated, default: all pages).
//   --ui-only            Only interface strings (i18n/<locale>/ui.json).
//   --pages-only         Only pages.
//   --force              Retranslate even when the English source is unchanged.
//   --dry-run            Report the work and its size without calling the API.
//   --concurrency 6      Parallel API requests (default 6).
//
// Environment:
//   I18N_API_KEY    API key (falls back to SANDBASE_API_KEY).
//   I18N_BASE_URL   Base URL of the Chat Completions API
//                   (default https://api.sandbase.ai/v1).
//   I18N_MODEL      Model ID, e.g. deepseek/deepseek-v4-flash. Required.
//
// Each translated page records the hash of its English source in
// `i18nSource`; unchanged pages are skipped, so the command is safe to rerun
// after editing English docs. Fenced code, <script> blocks and component tags
// are replaced by placeholders before translation and restored verbatim, and
// headings keep the English anchor IDs so links and the language switcher
// land on the same section in every language.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import YAML from 'yaml'
import { createMarkdownRenderer } from 'vitepress'
import { chunk, frontmatterStrings, pinAnchors, protect, restore, setPath, splitFrontmatter } from './markdown.mjs'
import { LOCALES, TARGET_LOCALE_CODES } from '../../.vitepress/i18n/locales.mjs'
import { DOCS_ROOT, TRANSLATIONS_DIR, listSourcePages, translationFile } from '../../.vitepress/i18n/pages.mjs'
import { collectUiStrings } from './ui-strings.mjs'

const { values: args } = parseArgs({
  options: {
    locales: { type: 'string' },
    pages: { type: 'string' },
    'ui-only': { type: 'boolean', default: false },
    'pages-only': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '6' },
  },
})

const locales = args.locales ? args.locales.split(',').map((code) => code.trim()) : TARGET_LOCALE_CODES
for (const code of locales) {
  if (!TARGET_LOCALE_CODES.includes(code)) throw new Error(`Unknown locale ${code}. Use one of: ${TARGET_LOCALE_CODES.join(', ')}`)
}
const pagePrefixes = args.pages ? args.pages.split(',').map((prefix) => prefix.trim()) : null
const concurrency = Math.max(1, Number(args.concurrency) || 6)
const dryRun = args['dry-run']

const apiKey = process.env.I18N_API_KEY || process.env.SANDBASE_API_KEY
const baseUrl = (process.env.I18N_BASE_URL || 'https://api.sandbase.ai/v1').replace(/\/+$/, '')
const model = process.env.I18N_MODEL
if (!dryRun && (!apiKey || !model)) {
  console.error('Set I18N_API_KEY (or SANDBASE_API_KEY) and I18N_MODEL, or use --dry-run.')
  process.exit(1)
}

const localeName = (code) => LOCALES.find((locale) => locale.code === code).name
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)

// ─── Chat Completions ───────────────────────────────────────────────

const GLOSSARY = [
  'Keep these names in English: SandBase, Agent, Agents, Skill, Skills, MCP, Sandbox, E2B, Lab, Console, Playground, OpenAI, Anthropic, Gemini, Claude, GPT, DeepSeek, Qwen, Kling, Seedance, Wan, Veo, Nano Banana.',
  'Do not translate inline code, URLs, file paths, HTTP methods and status codes, header names, JSON keys, API field and parameter names, environment variables, model IDs, or CLI commands.',
].join(' ')

let usage = { prompt: 0, completion: 0, requests: 0 }

async function chat(system, user, attempt = 1) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  }).catch((error) => ({ ok: false, status: 0, text: async () => String(error) }))
  if (!response.ok) {
    const body = (await response.text()).slice(0, 300)
    const retryable = response.status === 0 || response.status === 408 || response.status === 429 || response.status >= 500
    if (retryable && attempt < 6) {
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000))
      return chat(system, user, attempt + 1)
    }
    throw new Error(`HTTP ${response.status}: ${body}`)
  }
  const data = await response.json()
  usage.requests += 1
  usage.prompt += data.usage?.prompt_tokens ?? 0
  usage.completion += data.usage?.completion_tokens ?? 0
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) throw new Error('Empty completion')
  if (data.choices[0].finish_reason === 'length') throw new Error('Completion was truncated')
  return content
}

/** Translate a map of id -> English text; returns id -> translation. */
async function translateStrings(entries, locale, context) {
  const result = {}
  for (let start = 0; start < entries.length; start += 60) {
    const batch = Object.fromEntries(entries.slice(start, start + 60))
    const system = [
      `You translate ${context} from English to ${localeName(locale)} (${locale}).`,
      'You receive a JSON object. Return a JSON object with exactly the same keys whose values are the translations.',
      'Keep placeholders in curly braces such as {id} unchanged. Keep symbols such as →, ↗, ✓, … and ·.',
      'Use concise, natural interface wording. Return only the JSON object.',
      GLOSSARY,
    ].join(' ')
    let parsed
    for (let attempt = 1; attempt <= 3 && !parsed; attempt += 1) {
      const output = await chat(system, JSON.stringify(batch, null, 2))
      try {
        const candidate = JSON.parse(output.slice(output.indexOf('{'), output.lastIndexOf('}') + 1))
        const problems = Object.entries(batch).filter(([key, text]) => {
          const value = candidate[key]
          if (typeof value !== 'string' || !value.trim()) return true
          const placeholders = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join()
          return placeholders(value) !== placeholders(text)
        })
        if (!problems.length) parsed = candidate
      } catch { /* retry */ }
    }
    if (!parsed) throw new Error(`Could not translate ${context} strings for ${locale}`)
    for (const key of Object.keys(batch)) result[key] = parsed[key]
  }
  return result
}

// ─── Pages ─────────────────────────────────────────────────────────

const md = await createMarkdownRenderer(DOCS_ROOT, {}, '/docs/')

const specSource = readFileSync(path.join(DOCS_ROOT, '.vitepress', 'theme', 'generatedApiReferenceSpecs.ts'), 'utf8')
const generatedSpecs = new Function(`return ${specSource.slice(specSource.indexOf('= {') + 2)}`)()

function pageSystemPrompt(locale) {
  return [
    `You are a professional technical translator. Translate this Markdown section of the SandBase developer documentation from English to ${localeName(locale)} (${locale}).`,
    'Keep the Markdown structure exactly: the same headings and heading levels, lists, tables, emphasis, blockquotes, HTML tags and attributes, and link targets. Translate link text, table cells and image alt text.',
    'Custom containers start with ::: and a type (tip, info, warning, danger, details, code-group); keep the ::: lines and the type keyword, and translate only the optional title after it.',
    'Lines such as <!--sb-keep-12--> are placeholders for code. Copy every placeholder exactly once, unchanged, on its own line, in the same position.',
    'Keep {#anchor} suffixes on headings unchanged.',
    GLOSSARY,
    'Output only the translated Markdown, with no commentary and no surrounding code fence.',
  ].join(' ')
}

async function translateBody(body, locale) {
  const { text, blocks } = protect(body)
  const parts = []
  for (const part of chunk(text)) {
    if (!part.replace(/<!--sb-keep-\d+-->/g, '').trim()) {
      parts.push(part)
      continue
    }
    let translated
    for (let attempt = 1; attempt <= 3 && translated === undefined; attempt += 1) {
      let output = await chat(pageSystemPrompt(locale), part)
      output = output.replace(/^```(?:markdown|md)?\n([\s\S]*)\n```\s*$/, '$1')
      const expected = part.match(/<!--sb-keep-\d+-->/g) ?? []
      const actual = output.match(/<!--sb-keep-\d+-->/g) ?? []
      if (expected.join() === actual.join()) translated = output
    }
    if (translated === undefined) throw new Error('placeholders were not preserved')
    parts.push(translated)
  }
  const translated = restore(parts.join('\n'), blocks)
  return pinAnchors(md, body, translated)
}

async function translatePage(page, locale) {
  const source = readFileSync(path.join(DOCS_ROOT, page), 'utf8')
  const sourceHash = hash(source)
  const { data, body } = splitFrontmatter(source)
  // Inline generated API specs so their descriptions can be translated.
  if (data.apiReferenceKey && generatedSpecs[data.apiReferenceKey]) {
    data.apiReference = structuredClone(generatedSpecs[data.apiReferenceKey])
    delete data.apiReferenceKey
  }
  // Chinese readers get the Chinese prompt of a tutorial's "Copy for Agent" action.
  if (locale === 'zh-CN' && typeof data.agentDoc === 'string') data.agentDoc = data.agentDoc.replace(/-en$/, '-zh')

  const strings = frontmatterStrings(data)
  const translatedStrings = await translateStrings(strings.map(([, text], index) => [String(index), text]), locale, 'documentation page metadata and API reference descriptions')
  strings.forEach(([keys], index) => setPath(data, keys, translatedStrings[String(index)]))

  const translatedBody = await translateBody(body, locale)
  const frontmatter = YAML.stringify({ i18nSource: sourceHash, ...data }, { lineWidth: 0 })
  const file = translationFile(locale, page)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `---\n${frontmatter}---\n${translatedBody.startsWith('\n') ? '' : '\n'}${translatedBody}`)
}

function isCurrent(page, locale) {
  const file = translationFile(locale, page)
  if (!existsSync(file)) return false
  const recorded = readFileSync(file, 'utf8').match(/^---\n[\s\S]*?^i18nSource:\s*"?([0-9a-f]+)"?\s*$/m)?.[1]
  return recorded === hash(readFileSync(path.join(DOCS_ROOT, page), 'utf8'))
}

// ─── Interface strings ─────────────────────────────────────────────

async function translateUi(locale, strings) {
  const file = path.join(DOCS_ROOT, TRANSLATIONS_DIR, locale, 'ui.json')
  const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  const missing = strings.filter((text) => args.force || !existing[text])
  if (dryRun || !missing.length) return missing.length
  const translated = await translateStrings(missing.map((text) => [text, text]), locale, 'website interface labels for developer documentation')
  const merged = Object.fromEntries(strings.map((text) => [text, translated[text] ?? existing[text]]).filter(([, value]) => value))
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`)
  return missing.length
}

// ─── Run ───────────────────────────────────────────────────────────

async function pool(tasks, size) {
  const failures = []
  let next = 0
  let done = 0
  async function worker() {
    while (next < tasks.length) {
      const task = tasks[next++]
      try {
        await task.run()
      } catch (error) {
        failures.push(`${task.label}: ${error.message}`)
      }
      done += 1
      process.stdout.write(`\r${done}/${tasks.length} done, ${failures.length} failed`)
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, tasks.length) }, worker))
  if (tasks.length) process.stdout.write('\n')
  return failures
}

const failures = []

if (!args['pages-only']) {
  const strings = collectUiStrings()
  const tasks = locales.map((locale) => ({ label: `${locale} ui.json`, run: async () => {
    const count = await translateUi(locale, strings)
    if (dryRun) console.log(`${locale}: ${count} interface strings to translate`)
  } }))
  console.log(`Interface strings: ${strings.length} per locale`)
  failures.push(...await pool(tasks, concurrency))
}

if (!args['ui-only']) {
  const pages = listSourcePages().filter((page) => !pagePrefixes || pagePrefixes.some((prefix) => page.startsWith(prefix)))
  const work = locales.flatMap((locale) => pages
    .filter((page) => args.force || !isCurrent(page, locale))
    .map((page) => ({ page, locale })))
  const characters = work.reduce((sum, { page }) => sum + readFileSync(path.join(DOCS_ROOT, page), 'utf8').length, 0)
  console.log(`Pages: ${work.length} to translate (${pages.length} pages x ${locales.length} locales, ${characters.toLocaleString()} source characters)`)
  if (dryRun) {
    for (const locale of locales) console.log(`  ${locale}: ${work.filter((item) => item.locale === locale).length}`)
  } else {
    failures.push(...await pool(work.map(({ page, locale }) => ({
      label: `${locale}/${page}`,
      run: () => translatePage(page, locale),
    })), concurrency))
  }
}

if (!dryRun) console.log(`API usage: ${usage.requests} requests, ${usage.prompt.toLocaleString()} prompt tokens, ${usage.completion.toLocaleString()} completion tokens`)
if (failures.length) {
  console.error(`\n${failures.length} failed (rerun to retry only these):\n${failures.join('\n')}`)
  process.exitCode = 1
}
