// Node-side helpers shared by the VitePress config, the localized dynamic
// route, and the translation scripts. Browser code must not import this file.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SINGLE_LANGUAGE_PAGES, TARGET_LOCALE_CODES } from './locales.mjs'

export const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Translations live here, mirroring the English paths: i18n/<locale>/<page>.md */
export const TRANSLATIONS_DIR = 'i18n'

/** Directory holding the dynamic route that renders every localized page. */
export const LOCALE_ROUTE_DIR = '[locale]'

// Keep internal/withdrawn material in the repository without publishing it.
export const SRC_EXCLUDE = [
  'README.md',
  'CONTRIBUTING.md',
  'DEPLOYMENT.md',
  // Retired Embed, Environment, Endpoint, Deployment, and Site Agent pages live here.
  '_archived/**',
  'agents/endpoint-quickstart.md',
  'admin/api-keys.md',
  'setup/cli.md',
  'setup/groups.md',
  // Console Workspace Services was folded into AI tools (/console/setup).
  'setup/installed.md',
  // Tooling notes, not documentation.
  'scripts/**',
  // Translation sources are rendered through the [locale] dynamic route.
  `${TRANSLATIONS_DIR}/**`,
]

function matches(file, patterns) {
  return patterns.some((pattern) => pattern.endsWith('/**')
    ? file.startsWith(pattern.slice(0, -2))
    : file === pattern)
}

function walk(directory, prefix = '') {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      if (relative === TRANSLATIONS_DIR || relative === LOCALE_ROUTE_DIR) continue
      files.push(...walk(path.join(directory, entry.name), relative))
    } else if (entry.name.endsWith('.md')) {
      files.push(relative)
    }
  }
  return files
}

/** English pages that are published in every locale, e.g. `guides/streaming.md`. */
export function listSourcePages(root = DOCS_ROOT) {
  return walk(root)
    .filter((file) => !matches(file, SRC_EXCLUDE) && !matches(file, SINGLE_LANGUAGE_PAGES))
    .sort()
}

export function translationFile(locale, page, root = DOCS_ROOT) {
  return path.join(root, TRANSLATIONS_DIR, locale, page)
}

export function hasTranslation(locale, page, root = DOCS_ROOT) {
  const file = translationFile(locale, page, root)
  return existsSync(file) && statSync(file).isFile()
}

/** Map of English page -> locales that have a translation of it. */
export function translationIndex(root = DOCS_ROOT) {
  const pages = listSourcePages(root)
  return new Map(pages.map((page) => [
    page,
    TARGET_LOCALE_CODES.filter((locale) => hasTranslation(locale, page, root)),
  ]))
}


/** Interface translations for one locale, keyed by English text. */
export function loadUiDictionary(locale, root = DOCS_ROOT) {
  const file = path.join(root, TRANSLATIONS_DIR, locale, 'ui.json')
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
}

/** Insert frontmatter keys right after the opening fence (or add a block). */
function withFrontmatterLines(source, lines) {
  const block = lines.join('\n')
  if (source.startsWith('---\n')) return `---\n${block}\n${source.slice(4)}`
  return `---\n${block}\n---\n\n${source}`
}

/**
 * Markdown for a localized page. Uses the translation when it exists and
 * falls back to the English source otherwise, marked with `i18nFallback` so
 * the theme can show a notice and SEO tags can point at the English page.
 */
export function localizedPageSource(locale, page, root = DOCS_ROOT) {
  if (hasTranslation(locale, page, root)) {
    return { translated: true, content: readFileSync(translationFile(locale, page, root), 'utf8') }
  }
  const english = readFileSync(path.join(root, page), 'utf8')
  return { translated: false, content: withFrontmatterLines(english, ['i18nFallback: true']) }
}
