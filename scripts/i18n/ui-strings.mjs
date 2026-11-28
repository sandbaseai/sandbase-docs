// Collect every English interface string that the theme, sidebar and config
// translate. Components call tx('English text'); data arrays (menus, footer
// links, cards) keep plain English labels that are translated at render time.
// Translations are stored per locale in i18n/<locale>/ui.json.
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { DOCS_ROOT } from '../../.vitepress/i18n/pages.mjs'

const theme = path.join(DOCS_ROOT, '.vitepress', 'theme')
const read = (file) => readFileSync(file, 'utf8')
const all = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1])

// Literal arguments of tx('…') / t(locale, '…') calls.
const TX_CALL = /\btx\(\s*'((?:[^'\\]|\\.)+)'/g
const CONFIG_CALL = /\bt\([^,()]+,\s*'((?:[^'\\]|\\.)+)'/g
// Labels inside data arrays.
const DATA_FIELD = /\b(?:label|description|eyebrow|cta|title|tag|body|text|tagline)\s*[:=]\s*'((?:[^'\\]|\\.)+)'/g
const DIRECTORY_LINK = /\b[ma]\('[^']+',\s*'((?:[^'\\]|\\.)+)'\)/g

// Components whose data arrays hold user-visible labels.
const DATA_FILES = ['SiteHeader.vue', 'SiteFooter.vue', 'QuickstartPaths.vue', 'DocsSectionTabs.vue']

function unescape(text) {
  return text.replace(/\\(.)/g, '$1')
}

export function collectUiStrings() {
  const strings = new Set()
  const add = (values) => values.map(unescape).forEach((value) => strings.add(value))

  for (const file of readdirSync(theme).filter((name) => name.endsWith('.vue') || name.endsWith('.ts'))) {
    add(all(read(path.join(theme, file)), TX_CALL))
  }
  for (const file of DATA_FILES) {
    const source = read(path.join(theme, file)).split('<style')[0]
    add(all(source, DATA_FIELD))
    add(all(source, DIRECTORY_LINK))
  }

  // Only the English copy of the Quick Start resource cards.
  const resources = read(path.join(theme, 'QuickstartResources.vue'))
  add(all(resources.slice(resources.indexOf('en: {'), resources.indexOf('zh: {')), DATA_FIELD))

  // Playground action names shown in status messages, and tab labels.
  const playground = read(path.join(theme, 'SandboxPlayground.vue'))
  add(all(playground, /\bact\('((?:[^'\\]|\\.)+)'/g))
  add(all(playground, /\bact\(write \? '([^']+)'/g))
  add(all(playground, /\bact\(write \? '[^']+' : '([^']+)'/g))
  add(all(playground.slice(playground.indexOf('const lifecycleLabels'), playground.indexOf('async function lifecycle')), /:\s*'([^']+)'/g))
  add(all(playground.match(/\[\['command'[^\n]*?\]\]/)?.[0] ?? '', /'[a-z]+','([^']+)'/g))

  // Sidebar groups and items, and labels used by the VitePress config.
  add(all(read(path.join(DOCS_ROOT, '.vitepress', 'sidebar.ts')), /\btext:\s*'((?:[^'\\]|\\.)+)'/g))
  const config = read(path.join(DOCS_ROOT, '.vitepress', 'config.ts'))
  add(all(config, CONFIG_CALL))
  add(all(config.slice(config.indexOf('const navItems'), config.indexOf('/** Theme labels')), /\btext:\s*'([^']+)'/g))
  add(all(config, /const siteDescription = '([^']+)'/g))

  // Brand and product names are not translated.
  for (const keep of ['SandBase', 'GitHub', 'Discord', 'X.com', 'LinkedIn']) strings.delete(keep)
  return [...strings].sort()
}
