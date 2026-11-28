import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { LOCALES, SOURCE_LOCALE, splitLocalePath, withLocale } from '../i18n/locales.mjs'

// Interface strings are keyed by their English text. Each locale's
// translations live in i18n/<locale>/ui.json and fall back to English per
// string, so a missing or stale entry never breaks the page.
const files = import.meta.glob<Record<string, string>>('../../i18n/*/ui.json', { eager: true, import: 'default' })
const dictionaries: Record<string, Record<string, string>> = {}
for (const [file, messages] of Object.entries(files)) {
  const code = file.split('/').at(-2)
  if (code) dictionaries[code] = messages
}

function interpolate(text: string, params?: Record<string, string | number>) {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}

/** Translate an English interface string for a given locale. */
export function translate(locale: string, text: string, params?: Record<string, string | number>) {
  const translated = locale === SOURCE_LOCALE ? undefined : dictionaries[locale]?.[text]
  return interpolate(translated || text, params)
}

export function useI18n() {
  const { localeIndex } = useData()
  const locale = computed(() => (localeIndex.value === 'root' ? SOURCE_LOCALE : localeIndex.value))
  const current = computed(() => LOCALES.find((entry) => entry.code === locale.value) ?? LOCALES[0])
  return {
    locale,
    current,
    /** Translate an English interface string into the page's locale. */
    tx: (text: string, params?: Record<string, string | number>) => translate(locale.value, text, params),
    /** Site path (`/guides/x`) in the page's locale, without the /docs base. */
    localePath: (path: string) => withLocale(path, locale.value),
    /** Absolute /docs URL (`/docs/zh-CN/guides/x`) in the page's locale. */
    localeHref: (path: string) => withBase(withLocale(path, locale.value)),
  }
}

export { LOCALES, SOURCE_LOCALE, splitLocalePath, withLocale }
