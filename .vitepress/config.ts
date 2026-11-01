import { defineConfig } from 'vitepress'
import sandboxDev from './sandbox-dev.mjs'
import {
  apiReferenceSidebar,
  docsSidebar,
} from './sidebar'

const siteOrigin = 'https://www.sandbase.ai'
const docsBase = '/docs/'


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

function genericPageHead(pageData: any) {
  if (!pageData.relativePath || pageData.isNotFound) return []
  const configuredCanonical = pageData.frontmatter?.canonical
  const canonicalUrl = configuredCanonical
    ? new URL(String(configuredCanonical), siteOrigin).toString()
    : absoluteDocsUrl(pageData.relativePath)
  const robots = pageData.frontmatter?.robots
    || 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
  const title = seoTitle(pageData.title ? `${pageData.title} | SandBase Docs` : 'SandBase Docs')
  const description = pageData.description || 'SandBase documentation for Models, APIs, Agents, Setup, and Sessions.'
  const techArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: title,
    headline: title,
    url: canonicalUrl,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'SandBase',
      url: siteOrigin,
    },
  }

  return [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['link', { rel: 'alternate', hreflang: 'en', href: canonicalUrl }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }],
    ['meta', { name: 'robots', content: robots }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:type', content: 'article' }],
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
  srcExclude: [
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
  ],
  lang: 'en',
  title: 'SandBase Docs',
  description: 'SandBase docs for connecting Agents to models, APIs, tools, Setup, and Sessions.',
  ignoreDeadLinks: true,
  appearance: true,
  cleanUrls: true,

  // The SandBase design presents code on a dark "panel" surface in both light
  // and dark appearance. Pin the syntax theme to a dark palette so code blocks
  // read as the signature dark panels on every background.
  markdown: {
    theme: { light: 'github-dark', dark: 'github-dark' },
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
    },
  },
  // Frontmatter titles are already curated for SEO; avoid appending a second
  // brand suffix that can push rendered titles beyond search-result limits.
  titleTemplate: false,

  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items
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
    ['meta', { property: 'og:image', content: 'https://www.sandbase.ai/og-default.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'SandBase Docs' }],
    ['meta', { name: 'twitter:description', content: 'Docs for Setup, Models, APIs, Agents, and Sessions.' }],
    ['meta', { name: 'keywords', content: 'SandBase docs, AI agent docs, Setup docs, AI tool setup, model API docs, API catalog, agent sessions' }],
  ],

  transformHead({ pageData }) {
    return genericPageHead(pageData)
  },

  themeConfig: {
    logo: {
      light: '/logo-mark-light.svg',
      dark: '/logo-mark-dark.svg',
      alt: 'SandBase',
    },
    siteTitle: 'SandBase',
    logoLink: { link: 'https://www.sandbase.ai', target: '_blank', rel: 'noopener noreferrer' },

    nav: [
      { text: 'Docs', link: '/', activeMatch: '^/(?!api-reference/)' },
      { text: 'API Reference', link: '/api-reference/', activeMatch: '^/api-reference/' },
      { text: 'Pricing', link: 'https://www.sandbase.ai/pricing', target: '_blank', rel: 'noopener noreferrer' },
      // Rendered as the primary "Start building" CTA button (see custom.css).
      { text: 'Start building', link: 'https://www.sandbase.ai/console', target: '_blank', rel: 'noopener noreferrer' },
    ],

    sidebar: {
      '/api-reference/': apiReferenceSidebar,
      '/': docsSidebar,
    },

    search: {
      provider: 'local',
    },
    // Pager labels match the design's mono PREVIOUS / NEXT captions.
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    outline: {
      // The design's outline lists section (h2) titles only.
      level: 2,
      label: 'On this page',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SandBase' },
    ],
  },
})
