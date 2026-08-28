import { defineConfig } from 'vitepress'
import {
  apiReferenceSidebar,
  docsSidebar,
  fullModelApiReferenceSidebar,
  platformApiReferenceFallbackSidebar,
} from './sidebar'

const siteOrigin = 'https://www.sandbase.ai'
const docsBase = '/docs/'

function cleanPagePath(relativePath: string) {
  if (relativePath === 'model-api-reference/platform-apis/index.md') {
    return `${docsBase}model-api-reference/platform-apis`
  }
  const withoutIndex = relativePath.replace(/(^|\/)index\.md$/, '$1')
  const withoutExtension = withoutIndex.replace(/\.md$/, '')
  return `${docsBase}${withoutExtension}`.replace(/\/+/g, '/')
}

function absoluteDocsUrl(relativePath: string) {
  return `${siteOrigin}${cleanPagePath(relativePath)}`
}

function modelPageHead(pageData: any) {
  const seo = pageData.frontmatter?.seo
  const relativePath = String(pageData.relativePath ?? '')
  const isLlmModel = relativePath.startsWith('model-api-reference/llm-models/')
  const isPlatformOperation = relativePath.startsWith('model-api-reference/platform-apis/')
    && relativePath !== 'model-api-reference/platform-apis/index.md'
  if (!seo?.modelId || (!isLlmModel && !isPlatformOperation)) return []

  const canonicalUrl = absoluteDocsUrl(relativePath)
  const modelDetailUrl = `${siteOrigin}/model/${seo.vendorSlug}/${seo.modelSlug}`
  const title = `${seo.modelName} API Reference | SandBase`
  const description = pageData.description
  const categoryName = isPlatformOperation ? 'APIs' : 'LLM Models'
  const categoryPath = isPlatformOperation ? 'platform-apis' : 'llm-models'
  const categoryUrl = `${siteOrigin}${docsBase}model-api-reference/${categoryPath}`
  const keywords = [
    `${seo.modelName} API`,
    `${seo.modelId} API`,
    `${seo.vendor} API`,
    `${categoryName} reference`,
    'SandBase model API',
    seo.endpoint,
    ...(seo.capabilities ?? []).map((capability: string) => `${capability} model`),
  ].join(', ')
  const publishedAt = seo.publishedAt || undefined

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Docs',
        item: `${siteOrigin}${docsBase}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Model API Reference',
        item: `${siteOrigin}${docsBase}model-api-reference/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: String(seo.vendor),
        item: isLlmModel ? `${categoryUrl}/${seo.vendorSlug}` : canonicalUrl,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: String(seo.modelName),
        item: canonicalUrl,
      },
    ],
  }

  const techArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    name: title,
    description,
    url: canonicalUrl,
    sameAs: modelDetailUrl,
    datePublished: publishedAt,
    dateModified: publishedAt,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SandBase',
      url: siteOrigin,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: String(seo.modelName),
        applicationCategory: isPlatformOperation ? 'API operation' : 'AI model',
        operatingSystem: 'API',
        provider: {
          '@type': 'Organization',
          name: String(seo.vendor),
        },
      },
      {
        '@type': 'WebAPI',
        name: `${seo.modelName} ${seo.protocol}`,
        url: `${siteOrigin}${docsBase}api-reference/`,
        documentation: canonicalUrl,
        endpointUrl: `https://api.sandbase.ai${seo.endpoint}`,
      },
    ],
    mainEntity: {
      '@type': 'WebAPI',
      name: `${seo.modelName} API`,
      url: canonicalUrl,
      endpointUrl: `https://api.sandbase.ai${seo.endpoint}`,
      documentation: canonicalUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SandBase',
      url: siteOrigin,
      logo: {
        '@type': 'ImageObject',
        url: `${siteOrigin}${docsBase}logo-horizontal-light.png`,
      },
    },
  }

  return [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['link', { rel: 'alternate', hreflang: 'en', href: canonicalUrl }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }],
    ['meta', { name: 'robots', content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1' }],
    ['meta', { name: 'keywords', content: keywords }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:site_name', content: 'SandBase' }],
    ...(publishedAt ? [
      ['meta', { property: 'article:published_time', content: publishedAt }],
      ['meta', { property: 'article:modified_time', content: publishedAt }],
    ] : []),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumbJsonLd)],
    ['script', { type: 'application/ld+json' }, JSON.stringify(techArticleJsonLd)],
  ]
}

function genericPageHead(pageData: any) {
  if (!pageData.relativePath || pageData.isNotFound) return []
  const configuredCanonical = pageData.frontmatter?.canonical
  const canonicalUrl = configuredCanonical
    ? new URL(String(configuredCanonical), siteOrigin).toString()
    : absoluteDocsUrl(pageData.relativePath)
  const robots = pageData.frontmatter?.robots
    || 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
  const title = pageData.title ? `${pageData.title} | SandBase Docs` : 'SandBase Docs'
  const description = pageData.description || 'SandBase documentation for Models, APIs, Agents, Setup, Services, Schedules, and Sessions.'
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
  base: docsBase,
  // Keep internal/withdrawn API material in the repository without publishing it.
  srcExclude: [
    'README.md',
    'CONTRIBUTING.md',
    'DEPLOYMENT.md',
    '_archived/**',
    // This legacy guide uses dashboard-only /default/v1 routes and an unpublished embed API.
    'guides/site-agent-integration.md',
    'use-cases/**',
    'api-reference/webhooks.md',
    'api-reference/embeds/**',
    'api-reference/environments/**',
    'agents/endpoint-quickstart.md',
    'admin/api-keys.md',
    'setup/cli.md',
    'setup/groups.md',
  ],
  title: 'SandBase Docs',
  description: 'SandBase docs for connecting Agents to models, APIs, tools, Setup, Services, Schedules, and Sessions.',
  ignoreDeadLinks: true,
  appearance: true,
  cleanUrls: true,

  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items
      .filter((item) => !['agents/deployments', 'store/models'].includes(item.url.replace(/^\//, '')))
      .map((item) => ({
        ...item,
        url: `${docsBase}${item.url.replace(/^\//, '')}`,
      })),
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/favicon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' }],
    ['meta', { property: 'og:title', content: 'SandBase Docs - Connect Your Agent to the Real World' }],
    ['meta', { property: 'og:description', content: 'Learn how to use Setup, call Models and APIs, build Agents, publish Services, create Schedules, and review Sessions in SandBase.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SandBase' }],
    ['meta', { property: 'og:image', content: 'https://www.sandbase.ai/og-default.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'SandBase Docs' }],
    ['meta', { name: 'twitter:description', content: 'Docs for Setup, Models, APIs, Agents, Services, Schedules, and Sessions.' }],
    ['meta', { name: 'keywords', content: 'SandBase docs, AI agent docs, Setup docs, AI tool setup, model API docs, API catalog, agent services, agent schedules, agent sessions' }],
  ],

  transformHead({ pageData }) {
    const modelHead = modelPageHead(pageData)
    return modelHead.length ? modelHead : genericPageHead(pageData)
  },

  themeConfig: {
    logo: {
      light: '/logo-horizontal-light.png',
      dark: '/logo-horizontal-dark.png',
      alt: 'SandBase',
    },
    siteTitle: false,
    logoLink: { link: 'https://www.sandbase.ai', target: '_self', rel: '' },

    nav: [
      { text: 'Docs', link: '/', activeMatch: '^/(?!api-reference/|model-api-reference/)' },
      { text: 'Model API Reference', link: '/model-api-reference/', activeMatch: '^/model-api-reference/' },
      { text: 'Platform API', link: '/api-reference/', activeMatch: '^/api-reference/' },
      { text: 'Console', link: 'https://www.sandbase.ai/console' },
    ],

    sidebar: {
      '/model-api-reference/platform-apis/': platformApiReferenceFallbackSidebar,
      '/model-api-reference/': fullModelApiReferenceSidebar,
      '/api-reference/': apiReferenceSidebar,
      '/': docsSidebar,
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SandBase' },
    ],
  },
})
