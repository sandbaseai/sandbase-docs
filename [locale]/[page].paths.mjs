// Renders every English page once per target locale at /docs/<locale>/<page>.
// The page body is the translation from i18n/<locale>/ when it exists, and the
// English source otherwise (see .vitepress/i18n/pages.mjs).
import { TARGET_LOCALE_CODES } from '../.vitepress/i18n/locales.mjs'
import { listSourcePages, localizedPageSource } from '../.vitepress/i18n/pages.mjs'

export default {
  paths() {
    const pages = listSourcePages()
    return TARGET_LOCALE_CODES.flatMap((locale) => pages.map((file) => {
      const { content } = localizedPageSource(locale, file)
      return { params: { locale, page: file.replace(/\.md$/, '') }, content }
    }))
  },
}
