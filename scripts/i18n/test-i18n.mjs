import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import YAML from 'yaml'
import { createMarkdownRenderer } from 'vitepress'
import { TARGET_LOCALE_CODES, isSingleLanguagePath, splitLocalePath, withLocale } from '../../.vitepress/i18n/locales.mjs'
import { DOCS_ROOT, TRANSLATIONS_DIR, listSourcePages, localizedPageSource, translationFile } from '../../.vitepress/i18n/pages.mjs'
import { pinAnchors, protect, restore, splitFrontmatter } from './markdown.mjs'
import { collectUiStrings } from './ui-strings.mjs'

const md = await createMarkdownRenderer(DOCS_ROOT, {}, '/docs/')
const pages = listSourcePages()
const read = (file) => readFileSync(path.join(DOCS_ROOT, file), 'utf8')
const headingIds = (body) => md.parse(body, {}).filter((token) => token.type === 'heading_open').map((token) => token.attrGet('id'))
const codeBlocks = (body) => protect(body).blocks

test('locale paths', () => {
  assert.equal(withLocale('/guides/streaming', 'zh-CN'), '/zh-CN/guides/streaming')
  assert.equal(withLocale('/', 'ja'), '/ja/')
  assert.equal(withLocale('/zh-CN/guides/', 'en'), '/guides/')
  assert.equal(withLocale('/zh-CN/guides/', 'ko'), '/ko/guides/')
  assert.deepEqual(splitLocalePath('/pt/api-reference/'), { locale: 'pt', path: '/api-reference/' })
  // Two-letter English sections are not mistaken for locales.
  assert.deepEqual(splitLocalePath('/id-card'), { locale: 'en', path: '/id-card' })
  assert.ok(isSingleLanguagePath('/guides/skills/zh/local-use'))
  assert.ok(isSingleLanguagePath('/getting-started/quickstart-cn'))
  assert.ok(!isSingleLanguagePath('/guides/skills/local-use'))
})

test('every published English page is rendered in every locale', () => {
  assert.ok(pages.length > 50, 'expected the English docs to be discovered')
  assert.ok(pages.includes('index.md') && pages.includes('api-reference/index.md'))
  for (const excluded of ['README.md', 'getting-started/quickstart-cn.md', 'guides/skills/zh/index.md', 'setup/cli.md']) {
    assert.ok(!pages.includes(excluded), `${excluded} must not be localized`)
  }
  const root = mkdtempSync(path.join(tmpdir(), 'docs-i18n-'))
  writeFileSync(path.join(root, 'index.md'), '---\ntitle: Home\n---\n# Home\n')
  const fallback = localizedPageSource('zh-CN', 'index.md', root)
  assert.equal(fallback.translated, false)
  assert.equal(fallback.content, '---\ni18nFallback: true\ntitle: Home\n---\n# Home\n')
  mkdirSync(path.join(root, 'i18n', 'zh-CN'), { recursive: true })
  writeFileSync(path.join(root, 'i18n', 'zh-CN', 'index.md'), '---\ntitle: 首页\n---\n# 首页\n')
  assert.deepEqual(localizedPageSource('zh-CN', 'index.md', root), { translated: true, content: '---\ntitle: 首页\n---\n# 首页\n' })
  rmSync(root, { recursive: true })
})

test('protecting code is lossless and keeps English anchors on every page', () => {
  for (const page of pages) {
    const { body } = splitFrontmatter(read(page))
    const { text, blocks } = protect(body)
    assert.equal(restore(text, blocks), body, `${page}: protect/restore must round-trip`)
    // A stand-in translation that changes every heading's words.
    const translated = restore(text.replace(/^(\s*#{1,6}\s+)(.+?)(\s*\{#[^}]*\})?$/gm, '$1Übersetzt $2 Titel'), blocks)
    const pinned = pinAnchors(md, body, translated)
    const englishIds = headingIds(body)
    const pinnedIds = headingIds(pinned)
    englishIds.forEach((id, index) => {
      if (id) assert.equal(pinnedIds[index], id, `${page}: translated headings must keep English anchors`)
    })
  }
})

test('interface translations match the current English strings', () => {
  const strings = new Set(collectUiStrings())
  for (const required of ['Docs', 'Search docs', 'On this page', 'Get started', 'Change language']) {
    assert.ok(strings.has(required), `missing interface string ${required}`)
  }
  for (const locale of TARGET_LOCALE_CODES) {
    const file = path.join(DOCS_ROOT, TRANSLATIONS_DIR, locale, 'ui.json')
    if (!existsSync(file)) continue
    const messages = JSON.parse(readFileSync(file, 'utf8'))
    for (const [english, translated] of Object.entries(messages)) {
      assert.equal(typeof translated, 'string', `${locale}: ${english}`)
      const placeholders = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join()
      assert.equal(placeholders(translated), placeholders(english), `${locale}: placeholders differ for "${english}"`)
    }
  }
})

test('translated pages match their English source', () => {
  const sources = new Set(pages)
  for (const locale of TARGET_LOCALE_CODES) {
    const directory = path.join(DOCS_ROOT, TRANSLATIONS_DIR, locale)
    if (!existsSync(directory)) continue
    const files = readdirSync(directory, { recursive: true }).map(String).filter((file) => file.endsWith('.md'))
    for (const file of files) {
      const page = file.split(path.sep).join('/')
      assert.ok(sources.has(page), `${locale}/${page} has no English source page`)
      const translation = readFileSync(translationFile(locale, page), 'utf8')
      const { data, body } = splitFrontmatter(translation)
      assert.ok(String(data.title ?? '').trim(), `${locale}/${page} must keep a title`)
      assert.ok(!data.i18nFallback, `${locale}/${page} must not be marked as a fallback`)
      const english = read(page)
      // Stale translations are refreshed by `npm run i18n:translate`; only
      // compare structure when the translation matches the current source.
      if (data.i18nSource !== createHash('sha256').update(english).digest('hex').slice(0, 16)) continue
      const source = splitFrontmatter(english)
      assert.deepEqual(codeBlocks(body), codeBlocks(source.body), `${locale}/${page}: code must match English`)
      const ids = headingIds(body)
      headingIds(source.body).forEach((id, index) => {
        if (id) assert.equal(ids[index], id, `${locale}/${page}: anchors must match English`)
      })
      if (source.data.apiReference || source.data.apiReferenceKey) {
        assert.ok(data.apiReference, `${locale}/${page}: API reference data is missing`)
      }
      YAML.parse(translation.match(/^---\n([\s\S]*?)\n---/)[1])
    }
  }
})
