// One-off generator for worker/retired-redirects.json (2026-11 docs pruning).
//
// The per-model API reference moved to the main site (/models/{id}/docs and
// /apis/{id}/docs), and the Store/Models catalog pages, Services, Schedules,
// Deployments, Endpoints, Credentials and Secrets pages were retired. This maps
// every removed /docs URL to its final destination so the Worker answers with a
// single 301. Run it before deleting the pages; it reads their frontmatter.
//
//   node scripts/generate-retired-redirects.mjs            # writes the JSON
import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'

const SITE = 'https://www.sandbase.ai'
const response = await fetch(`${SITE.replace('www', 'api')}/api/models?limit=5000`, { headers: { 'User-Agent': 'sandbase-docs-redirects' } })
const catalog = (await response.json()).data
const section = new Map(catalog.map(m => [`${m.vendor_slug}/${m.model_slug}`, m.type === 'api' ? 'apis' : 'models']))
const byName = new Map(catalog.map(m => [m.name, `${m.vendor_slug}/${m.model_slug}`]))
const vendorSection = new Map(catalog.map(m => [m.vendor_slug, m.type === 'api' ? 'apis' : 'models']))
const CATEGORY_SECTION = { 'platform-apis': 'apis', 'llm-models': 'models', 'image-generation': 'models', 'video-generation': 'models', 'audio-generation': 'models' }

const field = (text, key) => text.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '')
const map = {}
const fallbacks = []

// Category landing pages.
Object.assign(map, {
  '/docs/model-api-reference/platform-apis': `${SITE}/apis`,
  '/docs/model-api-reference/platform-apis/': `${SITE}/apis`,
  '/docs/model-api-reference/llm-models': `${SITE}/models`,
  '/docs/model-api-reference/image-generation': `${SITE}/models/image-video`,
  '/docs/model-api-reference/video-generation': `${SITE}/models/image-video`,
  '/docs/model-api-reference/audio-generation': `${SITE}/models`,
})

for (const file of globSync('model-api-reference/*/**/*.md')) {
  const parts = file.slice(0, -3).split('/')
  if (parts[1] === 'official-native-api' || parts.at(-1) === 'index') continue
  const text = readFileSync(file, 'utf8').slice(0, 6000)
  let id = field(text, 'vendorSlug') && field(text, 'modelSlug') ? `${field(text, 'vendorSlug')}/${field(text, 'modelSlug')}` : parts.slice(2).join('/')
  if (!section.has(id) && byName.has(field(text, 'modelId'))) id = byName.get(field(text, 'modelId'))
  const source = `/docs/${parts.join('/')}`
  if (section.has(id)) {
    map[source] = `${SITE}/${section.get(id)}/${id}/docs`
  } else {
    // No longer in the catalog: send it to the vendor hub, or the section list.
    const vendor = id.split('/')[0]
    const hub = vendorSection.has(vendor) ? `/${vendorSection.get(vendor)}/${vendor}` : `/${CATEGORY_SECTION[parts[1]] ?? 'models'}`
    map[source] = `${SITE}${hub}`
    fallbacks.push(source)
  }
}

// Anything else under the removed per-model reference categories.
Object.assign(map, {
  '/docs/model-api-reference/platform-apis/*': `${SITE}/apis`,
  '/docs/model-api-reference/llm-models/*': `${SITE}/models`,
  '/docs/model-api-reference/image-generation/*': `${SITE}/models/image-video`,
  '/docs/model-api-reference/video-generation/*': `${SITE}/models/image-video`,
  '/docs/model-api-reference/audio-generation/*': `${SITE}/models`,
  '/docs/store/*': `${SITE}/models`,
  '/docs/models/*': `${SITE}/models`,
})

// Catalog pages that duplicated the main site's lists.
Object.assign(map, {
  '/docs/store': `${SITE}/models`, '/docs/store/': `${SITE}/models`,
  '/docs/store/models': `${SITE}/models`, '/docs/store/apis': `${SITE}/apis`,
  '/docs/store/skills': `${SITE}/skills`, '/docs/store/agents': `${SITE}/agents`,
  '/docs/models': `${SITE}/models`, '/docs/models/': `${SITE}/models`,
  '/docs/models/supported': `${SITE}/models`, '/docs/models/capabilities': `${SITE}/models`,
  '/docs/models/vision': `${SITE}/models`,
})

// Retired product areas: Services, Schedules, Deployments, Endpoints, Credentials.
// (Secrets stays: MCP connections reference it through secret_id.)
const retired = {
  'agents/services': '/docs/agents/', 'agents/schedules': '/docs/agents/', 'agents/deployments': '/docs/agents/',
  'api-reference/services': '/docs/api-reference/agents/', 'api-reference/schedules': '/docs/api-reference/agents/',
  'api-reference/deployments': '/docs/api-reference/agents/', 'api-reference/endpoints': '/docs/api-reference/agents/',
  'api-reference/credentials': '/docs/agents/api-credentials',
}
for (const [prefix, target] of Object.entries(retired)) {
  map[`/docs/${prefix}`] = `${SITE}${target}`
  for (const file of globSync(`${prefix}/**/*.md`)) {
    const path = file.slice(0, -3).replace(/\/index$/, '/')
    map[`/docs/${path}`] = `${SITE}${target}`
  }
  if (!prefix.startsWith('agents/')) {
    map[`/docs/${prefix}/`] = `${SITE}${target}`
    // Any other URL under a retired section (old sub-pages, renamed files).
    map[`/docs/${prefix}/*`] = `${SITE}${target}`
  }
}

// Indexed URLs that already return 404 (Search Console, 2026-11).
Object.assign(map, {
  '/docs/agents/sandbox-persistence': `${SITE}/docs/sandbox/`,
  '/docs/agents/sandbox-events': `${SITE}/docs/sandbox/`,
  '/docs/agents/sandbox-env-vars': `${SITE}/docs/sandbox/`,
  '/docs/api-reference/tasks': `${SITE}/docs/api-reference/`,
  '/docs/api-reference/tasks/': `${SITE}/docs/api-reference/`,
})

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync('worker/retired-redirects.json', `${JSON.stringify(sorted, null, 1)}\n`)
console.log(`${Object.keys(sorted).length} redirects (${fallbacks.length} to a hub because the item left the catalog)`)
