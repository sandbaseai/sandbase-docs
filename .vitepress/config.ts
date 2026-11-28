import { defineConfig, type DefaultTheme } from 'vitepress'
import sandboxDev from './sandbox-dev.mjs'
import { sandbaseSyntaxTheme } from './syntaxTheme'
import {
  apiReferenceSidebar,
  docsSidebar,
} from './sidebar'
import {
  LOCALES,
  SOURCE_LOCALE,
  TARGET_LOCALE_CODES,
  isSingleLanguagePath,
  withLocale,
} from './i18n/locales.mjs'
import { SRC_EXCLUDE, loadUiDictionary, translationIndex } from './i18n/pages.mjs'
const siteOrigin = 'https://www.sandbase.ai'
const docsBase = '/docs/'
// English page -> locales with a translation. Other locales render the
// English text at their URL (see [locale]/[page].paths.mjs).
const translations = translationIndex()
const dictionaries: Record<string, Record<string, string>> = Object.fromEntries(
  TARGET_LOCALE_CODES.map((locale) => [locale, loadUiDictionary(locale)]),
)
/** Translate an English interface string (sidebar, labels, search UI). */
function t(locale: string, text: string) {
  return locale === SOURCE_LOCALE ? text : dictionaries[locale]?.[text] || text
}
/** `zh-CN/guides/x.md` -> { locale: 'zh-CN', page: 'guides/x.md' } */
function splitPage(relativePath: string) {
  const [first, ...rest] = relativePath.split('/')
  if (TARGET_LOCALE_CODES.includes(first) && rest.length) return { locale: first, page: rest.join('/') }
  return { locale: SOURCE_LOCALE, page: relativePath }
}
// Keep rendered document titles within a search-friendly length even when a
// generated page title is long. Frontmatter titles remain descriptive; the
// head title is shortened only at render time so navigation labels and body
// headings are unaffected.
function seoTitle(title: string, maxLength = 60) {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 1).trimEnd()}…`
}
function cleanPagePath(relativePath: string) {
  const withoutIndex = relativePath.replace(/(^|\/)index\.md$/, '$1')
  const withoutExtension = withoutIndex.replace(/\.md$/, '')
  return `${docsBase}${withoutExtension}`.replace(/\/+/g, '/')
}
function absoluteDocsUrl(relativePath: string) {
  return `${siteOrigin}${cleanPagePath(relativePath)}`
}
function localizedFile(page: string, locale: string) {
  return locale === SOURCE_LOCALE ? page : `${locale}/${page}`
}
// Localized URLs that show the English text because no translation exists.
// They are kept out of the sitemap and canonicalize to the English page.
const fallbackSitemapUrls = new Set(
  [...translations].flatMap(([page, translated]) => TARGET_LOCALE_CODES
    .filter((locale) => !translated.includes(locale))
    .map((locale) => cleanPagePath(localizedFile(page, locale)).slice(docsBase.length))),
)
/** Point a site-relative docs link at the same page in `locale`. */
function localizeLink(link: string, locale: string) {
  if (locale === SOURCE_LOCALE || !link.startsWith('/') || link.startsWith('//') || link.startsWith(docsBase)) return link
  const pathname = link.replace(/[?#].*$/, '')
  // Static files and single-language pages exist only at their English path.
  if (/\.(?!md$|html$)[a-z0-9]+$/i.test(pathname) || isSingleLanguagePath(pathname)) return link
  return withLocale(link, locale)
}
function localizeSidebar(items: DefaultTheme.SidebarItem[], locale: string): DefaultTheme.SidebarItem[] {
  return items.map((item) => ({
    ...item,
    ...(item.text ? { text: t(locale, item.text) } : {}),
    ...(item.link ? { link: localizeLink(item.link, locale) } : {}),
    ...(item.items ? { items: localizeSidebar(item.items, locale) } : {}),
  }))
}
const navItems: DefaultTheme.NavItemWithLink[] = [
  { text: 'Docs', link: '/', activeMatch: '^/(?!api-reference/)' },
  { text: 'API Reference', link: '/api-reference/', activeMatch: '^/api-reference/' },
  { text: 'Pricing', link: 'https://www.sandbase.ai/pricing', target: '_blank', rel: 'noopener noreferrer' },
  // Rendered as the primary "Start building" CTA button (see custom.css).
  { text: 'Start building', link: 'https://www.sandbase.ai/console', target: '_blank', rel: 'noopener noreferrer' },
]
/** Theme labels, navigation and sidebars for one locale. */
function localeThemeConfig(locale: string): DefaultTheme.Config {
  const prefix = locale === SOURCE_LOCALE ? '' : `/${locale}`
  return {
    nav: navItems.map((item) => ({
      ...item,
      text: t(locale, item.text),
      link: localizeLink(item.link, locale),
      ...(item.activeMatch ? { activeMatch: item.activeMatch.replace('^/', `^${prefix}/`) } : {}),
    })),
    sidebar: {
      [`${prefix}/api-reference/`]: localizeSidebar(apiReferenceSidebar, locale),
      [`${prefix}/`]: localizeSidebar(docsSidebar, locale),
    },
    // The site header already has a "Menu" button on mobile; name the docs
    // sidebar toggle differently so the two are not confused.
    sidebarMenuLabel: t(locale, 'Contents'),
    // Pager labels match the design's mono PREVIOUS / NEXT captions.
    docFooter: {
      prev: t(locale, 'Previous'),
      next: t(locale, 'Next'),
    },
    outline: {
      // The design's outline lists section (h2) titles only.
      level: 2,
      label: t(locale, 'On this page'),
    },
    returnToTopLabel: t(locale, 'Return to top'),
    langMenuLabel: t(locale, 'Change language'),
    darkModeSwitchLabel: t(locale, 'Appearance'),
    lightModeSwitchTitle: t(locale, 'Switch to light theme'),
    darkModeSwitchTitle: t(locale, 'Switch to dark theme'),
    skipToContentLabel: t(locale, 'Skip to content'),
    notFound: {
      title: t(locale, 'PAGE NOT FOUND'),
      quote: t(locale, 'The page you are looking for does not exist or has moved.'),
      linkLabel: t(locale, 'Go to the docs home page'),
      linkText: t(locale, 'Back to docs'),
    },
  }
}
function searchTranslations(locale: string) {
  return {
    button: {
      buttonText: t(locale, 'Search'),
      buttonAriaLabel: t(locale, 'Search docs'),
    },
    modal: {
      displayDetails: t(locale, 'Display detailed list'),
      resetButtonTitle: t(locale, 'Reset search'),
      backButtonTitle: t(locale, 'Close search'),
      noResultsText: t(locale, 'No results for'),
      footer: {
        selectText: t(locale, 'to select'),
        selectKeyAriaLabel: t(locale, 'enter'),
        navigateText: t(locale, 'to navigate'),
        navigateUpKeyAriaLabel: t(locale, 'up arrow'),
        navigateDownKeyAriaLabel: t(locale, 'down arrow'),
        closeText: t(locale, 'to close'),
        closeKeyAriaLabel: t(locale, 'escape'),
      },
    },
  }
}
const siteDescription = 'SandBase docs for connecting Agents to models, APIs, tools, Setup, and Sessions.'
function genericPageHead(pageData: any) {
  if (!pageData.relativePath || pageData.isNotFound) return []
  const { locale, page } = splitPage(String(pageData.relativePath))
  const fallback = Boolean(pageData.frontmatter?.i18nFallback)
  const englishUrl = absoluteDocsUrl(page)
  const configuredCanonical = pageData.frontmatter?.canonical
  // An untranslated locale URL duplicates the English page; send search
  // engines there. Translated pages are their own canonical.
  const canonicalUrl = fallback
    ? englishUrl
    : configuredCanonical
      ? new URL(localizeLink(String(configuredCanonical), locale), siteOrigin).toString()
      : absoluteDocsUrl(pageData.relativePath)
  const robots = fallback
    ? 'noindex,follow'
    : pageData.frontmatter?.robots
      || 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
  const title = seoTitle(pageData.title ? `${pageData.title} | SandBase Docs` : 'SandBase Docs')
  const description = pageData.description || t(locale, siteDescription)
  // Every language version of this page that has its own text.
  const alternates = fallback ? [] : [
    ['link', { rel: 'alternate', hreflang: 'en', href: englishUrl }],
    ...(translations.get(page) ?? []).map((code) => (
      ['link', { rel: 'alternate', hreflang: code, href: absoluteDocsUrl(localizedFile(page, code)) }]
    )),
    ['link', { rel: 'alternate', hreflang: 'x-default', href: englishUrl }],
  ]
  const techArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: title,
    headline: title,
    url: canonicalUrl,
    description,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'SandBase',
      url: siteOrigin,
    },
  }
  return [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ...alternates,
    ['meta', { name: 'robots', content: robots }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:locale', content: locale.replace('-', '_') }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(techArticleJsonLd)],
  ]
}
export default defineConfig({
  vite: { plugins: [sandboxDev()], server: { watch: { ignored: ['**/.vitepress/dist/**'] } } },
  base: docsBase,
  // Keep internal/withdrawn API material in the repository without publishing it.
  srcExclude: SRC_EXCLUDE,
  lang: 'en',
  title: 'SandBase Docs',
  description: siteDescription,
  // English is served at /docs/; each other locale at /docs/<code>/.
  locales: Object.fromEntries(LOCALES.map((locale) => [
    locale.code === SOURCE_LOCALE ? 'root' : locale.code,
    {
      label: locale.label,
      lang: locale.code,
      ...(locale.code === SOURCE_LOCALE ? {} : { link: `/${locale.code}/` }),
      description: t(locale.code, siteDescription),
      themeConfig: localeThemeConfig(locale.code),
    },
  ])),
  ignoreDeadLinks: true,
  // Site data (17 locales' sidebars) and the page hash map are shared by
  // every page. Ship them once as a cached chunk instead of inlining them
  // into each of the ~1,900 HTML files.
  metaChunk: true,
  appearance: true,
  cleanUrls: true,

  // The SandBase design presents code on a dark "panel" surface in both light
  // and dark appearance. Pin the syntax theme to a dark palette so code blocks
  // read as the signature dark panels on every background.
  markdown: {
    theme: { light: sandbaseSyntaxTheme, dark: sandbaseSyntaxTheme },
    // Callouts render a mono tone badge (TIP / WARNING ...) via CSS. Mark
    // titles that are just the default label so the badge isn't repeated as
    // a title; custom titles (`::: tip Current source of truth`) still show.
    config(md) {
      for (const type of ['tip', 'info', 'note', 'important', 'warning', 'danger', 'caution']) {
        const rule = `container_${type}_open`
        const render = md.renderer.rules[rule]
        if (!render) continue
        md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
          const html = render(tokens, idx, options, env, self)
          const hasCustomTitle = tokens[idx].info.trim().slice(type.length).trim() !== ''
          return hasCustomTitle
            ? html
            : html.replace('class="custom-block-title"', 'class="custom-block-title custom-block-title-default"')
        }
      }
      // Localized pages keep the English link targets in their Markdown; point
      // site-relative links at the same locale when rendering.
      const renderLinkOpen = md.renderer.rules.link_open!
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const { locale } = splitPage(String(env.relativePath ?? ''))
        const href = tokens[idx].attrGet('href')
        if (href && locale !== SOURCE_LOCALE) tokens[idx].attrSet('href', localizeLink(href, locale))
        return renderLinkOpen(tokens, idx, options, env, self)
      }
    },
  },
  // Frontmatter titles are already curated for SEO; avoid appending a second
  // brand suffix that can push rendered titles beyond search-result limits.
  titleTemplate: false,

  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items
      .filter((item) => !fallbackSitemapUrls.has(item.url.replace(/^\//, '')))
      .map((item) => ({
        ...item,
        url: `${docsBase}${item.url.replace(/^\//, '')}`,
      })),
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/favicon.png' }],
    ['link', { rel: 'shortcut icon', href: '/docs/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/docs/apple-touch-icon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap' }],
    ['meta', { property: 'og:title', content: 'SandBase Docs - Connect Your Agent to the Real World' }],
    ['meta', { property: 'og:description', content: 'Learn how to use Setup, call Models and APIs, build Agents, and run and review Sessions in SandBase.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SandBase' }],
    ['meta', { property: 'og:image', content: 'https://www.sandbase.ai/images/og/sandbase-og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'SandBase Docs' }],
    ['meta', { name: 'twitter:description', content: 'Docs for Setup, Models, APIs, Agents, and Sessions.' }],
    ['meta', { name: 'keywords', content: 'SandBase docs, AI agent docs, Setup docs, AI tool setup, model API docs, API catalog, agent sessions' }],
  ],

  transformHead({ pageData }) {
    return genericPageHead(pageData)
  },

  themeConfig: {
    ...localeThemeConfig(SOURCE_LOCALE),
    logo: {
      light: '/logo-mark-light.svg',
      dark: '/logo-mark-dark.svg',
      alt: 'SandBase',
    },
    siteTitle: 'SandBase',
    logoLink: { link: 'https://www.sandbase.ai', target: '_blank', rel: 'noopener noreferrer' },
    search: {
      provider: 'local',
      options: {
        locales: Object.fromEntries(TARGET_LOCALE_CODES.map((locale) => [
          locale,
          { translations: searchTranslations(locale) },
        ])),
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SandBase' },
    ],
  },
})
