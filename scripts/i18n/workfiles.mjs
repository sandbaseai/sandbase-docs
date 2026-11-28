#!/usr/bin/env node
// Translate without an API: export the translatable text of each page to work
// files, translate those files (by a person or an assistant), then import
// them back into i18n/<locale>/.
//
//   node scripts/i18n/workfiles.mjs export
//     Writes .i18n-work/source/<page>.md (body, with code replaced by
//     <!--sb-keep-N--> placeholders), <page>.json (frontmatter strings), and
//     .i18n-work/source/ui.json (interface strings).
//
//   node scripts/i18n/workfiles.mjs import [--locales zh-CN,ja]
//     Reads .i18n-work/<locale>/<page>.md and .json (same shape as source),
//     restores code, pins English heading anchors, and writes
//     i18n/<locale>/<page>.md. Also merges .i18n-work/<locale>/ui.json.
//     Files that fail validation are reported and not written.
//     `check` takes the same options and only reports problems.
//     --batch <file> limits the import to the pages listed in that file
//     (one per line; a `ui.json` line includes the interface strings).
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import YAML from 'yaml'
import { createMarkdownRenderer } from 'vitepress'
import { TARGET_LOCALE_CODES } from '../../.vitepress/i18n/locales.mjs'
import { DOCS_ROOT, TRANSLATIONS_DIR, listSourcePages, translationFile } from '../../.vitepress/i18n/pages.mjs'
import { frontmatterStrings, pinAnchors, protect, restore, setPath, splitFrontmatter } from './markdown.mjs'
import { collectUiStrings } from './ui-strings.mjs'

const WORK = path.join(DOCS_ROOT, '.i18n-work')
const { positionals, values: args } = parseArgs({
  allowPositionals: true,
  options: { locales: { type: 'string' }, batch: { type: 'string' } },
})
const command = positionals[0]
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)
const write = (file, text) => {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, text)
}

const specSource = readFileSync(path.join(DOCS_ROOT, '.vitepress', 'theme', 'generatedApiReferenceSpecs.ts'), 'utf8')
const generatedSpecs = new Function(`return ${specSource.slice(specSource.indexOf('= {') + 2)}`)()

function sourceData(page) {
  const source = readFileSync(path.join(DOCS_ROOT, page), 'utf8')
  const { data, body } = splitFrontmatter(source)
  if (data.apiReferenceKey && generatedSpecs[data.apiReferenceKey]) {
    data.apiReference = structuredClone(generatedSpecs[data.apiReferenceKey])
    delete data.apiReferenceKey
  }
  return { source, data, body }
}

if (command === 'export') {
  let characters = 0
  for (const page of listSourcePages()) {
    const { data, body } = sourceData(page)
    const { text } = protect(body)
    const strings = Object.fromEntries(frontmatterStrings(data).map(([, value], index) => [String(index), value]))
    write(path.join(WORK, 'source', page), text)
    write(path.join(WORK, 'source', page.replace(/\.md$/, '.json')), `${JSON.stringify(strings, null, 2)}\n`)
    characters += text.length + JSON.stringify(strings).length
  }
  const ui = Object.fromEntries(collectUiStrings().map((text) => [text, text]))
  write(path.join(WORK, 'source', 'ui.json'), `${JSON.stringify(ui, null, 2)}\n`)
  console.log(`Exported ${listSourcePages().length} pages (${characters.toLocaleString()} characters) and ${Object.keys(ui).length} interface strings to .i18n-work/source/`)
} else if (command === 'import' || command === 'check') {
  const checkOnly = command === 'check'
  const md = await createMarkdownRenderer(DOCS_ROOT, {}, '/docs/')
  const locales = args.locales ? args.locales.split(',') : TARGET_LOCALE_CODES
  const failures = []
  let imported = 0
  const batch = args.batch ? new Set(readFileSync(args.batch, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)) : null
  for (const locale of locales) {
    const uiFile = path.join(WORK, locale, 'ui.json')
    if (existsSync(uiFile) && (!batch || batch.has('ui.json'))) {
      try {
        const strings = collectUiStrings()
        const translated = JSON.parse(readFileSync(uiFile, 'utf8'))
        const target = path.join(DOCS_ROOT, TRANSLATIONS_DIR, locale, 'ui.json')
        const existing = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : {}
        const placeholders = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join()
        const merged = {}
        for (const text of strings) {
          const value = translated[text] ?? existing[text]
          if (typeof value !== 'string' || !value.trim()) continue
          if (placeholders(value) !== placeholders(text)) {
            failures.push(`${locale}/ui.json: placeholders differ for "${text}"`)
            continue
          }
          merged[text] = value
        }
        const missing = strings.filter((text) => !(text in merged))
        if (checkOnly && missing.length) failures.push(`${locale}/ui.json: ${missing.length} strings missing, e.g. "${missing[0]}"`)
        if (!checkOnly) write(target, `${JSON.stringify(merged, null, 2)}\n`)
      } catch (error) {
        failures.push(`${locale}/ui.json: ${error.message}`)
      }
    }
    for (const page of listSourcePages().filter((file) => !batch || batch.has(file))) {
      const bodyFile = path.join(WORK, locale, page)
      if (!existsSync(bodyFile)) {
        if (checkOnly) failures.push(`${locale}/${page}: missing`)
        continue
      }
      try {
        const { source, data, body } = sourceData(page)
        const { blocks } = protect(body)
        let translatedBody = readFileSync(bodyFile, 'utf8')
        translatedBody = translatedBody.replace(/^```(?:markdown|md)?\n([\s\S]*)\n```\s*$/, '$1')
        // Blank lines separate Markdown blocks; the translation must keep the
        // same number of blocks as the English text.
        const blocksOf = (text) => text.trim().split(/\n[ \t]*\n/).length
        const { text: protectedSource } = protect(body)
        if (blocksOf(translatedBody) !== blocksOf(protectedSource)) {
          throw new Error(`blank-line separated blocks changed (${blocksOf(protectedSource)} -> ${blocksOf(translatedBody)}); keep every blank line of the source`)
        }
        const pinned = pinAnchors(md, body, restore(translatedBody, blocks))
        const strings = frontmatterStrings(data)
        const stringsFile = bodyFile.replace(/\.md$/, '.json')
        const translatedStrings = existsSync(stringsFile) ? JSON.parse(readFileSync(stringsFile, 'utf8')) : {}
        strings.forEach(([keys], index) => {
          const value = translatedStrings[String(index)]
          if (typeof value === 'string' && value.trim()) setPath(data, keys, value)
          else if (checkOnly) failures.push(`${locale}/${page}: string ${index} missing in .json`)
        })
        if (locale === 'zh-CN' && typeof data.agentDoc === 'string') data.agentDoc = data.agentDoc.replace(/-en$/, '-zh')
        const frontmatter = YAML.stringify({ i18nSource: hash(source), ...data }, { lineWidth: 0 })
        if (!checkOnly) write(translationFile(locale, page), `---\n${frontmatter}---\n${pinned.startsWith('\n') ? '' : '\n'}${pinned}`)
        imported += 1
      } catch (error) {
        failures.push(`${locale}/${page}: ${error.message}`)
      }
    }
  }
  console.log(`${checkOnly ? 'Checked' : 'Imported'} ${imported} pages`)
  if (failures.length) {
    console.error(`${failures.length} failed:\n${failures.join('\n')}`)
    process.exitCode = 1
  }
} else {
  console.error('Usage: node scripts/i18n/workfiles.mjs export | import | check [--locales zh-CN,ja] [--batch file]')
  process.exitCode = 1
}
