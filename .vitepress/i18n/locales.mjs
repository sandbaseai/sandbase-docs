// Locales published by the docs site. English is the source language and is
// served without a prefix (/docs/...); every other locale is served under
// /docs/<code>/... . The list mirrors the languages offered on wavespeed.ai.
//
// `label` is the language's own name, shown in the language switcher.
// `name` is the English name, given to the translation model as context.
// `chatwoot` is the Chatwoot widget locale for the support chat.
export const SOURCE_LOCALE = 'en'

export const LOCALES = [
  { code: 'en', label: 'English', name: 'English', chatwoot: 'en' },
  { code: 'zh-CN', label: '简体中文', name: 'Simplified Chinese', chatwoot: 'zh_CN' },
  { code: 'zh-TW', label: '繁體中文', name: 'Traditional Chinese (Taiwan)', chatwoot: 'zh_TW' },
  { code: 'ja', label: '日本語', name: 'Japanese', chatwoot: 'ja' },
  { code: 'ko', label: '한국어', name: 'Korean', chatwoot: 'ko' },
  { code: 'es', label: 'Español', name: 'Spanish', chatwoot: 'es' },
  { code: 'fr', label: 'Français', name: 'French', chatwoot: 'fr' },
  { code: 'de', label: 'Deutsch', name: 'German', chatwoot: 'de' },
  { code: 'pt', label: 'Português', name: 'Portuguese', chatwoot: 'pt' },
  { code: 'ru', label: 'Русский', name: 'Russian', chatwoot: 'ru' },
  { code: 'it', label: 'Italiano', name: 'Italian', chatwoot: 'it' },
  { code: 'id', label: 'Bahasa Indonesia', name: 'Indonesian', chatwoot: 'id' },
  { code: 'vi', label: 'Tiếng Việt', name: 'Vietnamese', chatwoot: 'vi' },
  { code: 'th', label: 'ไทย', name: 'Thai', chatwoot: 'th' },
  { code: 'tr', label: 'Türkçe', name: 'Turkish', chatwoot: 'tr' },
  { code: 'pl', label: 'Polski', name: 'Polish', chatwoot: 'pl' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi', chatwoot: 'hi' },
]

/** Locales that are produced by translation (everything except the source). */
export const TARGET_LOCALES = LOCALES.filter((locale) => locale.code !== SOURCE_LOCALE)

export const TARGET_LOCALE_CODES = TARGET_LOCALES.map((locale) => locale.code)

/**
 * Pages written for a single language audience. They are published at their
 * current URLs only and are not copied into the locale trees.
 */
export const SINGLE_LANGUAGE_PAGES = [
  'getting-started/quickstart-cn.md',
  'guides/skills/zh/**',
]

/** Whether a source file (`guides/skills/zh/index.md`) is single-language. */
export function isSingleLanguageFile(file) {
  return SINGLE_LANGUAGE_PAGES.some((pattern) => pattern.endsWith('/**')
    ? file.startsWith(pattern.slice(0, -2))
    : file === pattern)
}

/** Whether a site path (`/guides/skills/zh/local-use`) is a single-language page. */
export function isSingleLanguagePath(path) {
  const clean = path.replace(/[?#].*$/, '').replace(/^\//, '').replace(/\.(?:md|html)$/, '')
  return SINGLE_LANGUAGE_PAGES.some((pattern) => pattern.endsWith('/**')
    ? `${clean}/`.startsWith(pattern.slice(0, -2))
    : clean === pattern.replace(/\.md$/, ''))
}

/** Split `/zh-CN/guides/x` into the locale code and the path without it. */
export function splitLocalePath(path) {
  const match = path.match(/^\/([A-Za-z]{2}(?:-[A-Za-z]{2})?)(\/.*|$)/)
  if (match && TARGET_LOCALE_CODES.includes(match[1])) {
    return { locale: match[1], path: match[2] || '/' }
  }
  return { locale: SOURCE_LOCALE, path: path || '/' }
}

/** Prefix a site-relative path (`/guides/x`) with a locale. */
export function withLocale(path, locale) {
  const clean = splitLocalePath(path).path
  if (locale === SOURCE_LOCALE) return clean
  return `/${locale}${clean === '/' ? '/' : clean}`
}
