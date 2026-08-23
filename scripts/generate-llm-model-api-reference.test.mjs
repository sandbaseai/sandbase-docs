import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { describe, test } from 'node:test'

import {
  assertExampleMatchesSchema,
  assertUniquePlatformModels,
  classifyPlatformModel,
  cleanLegacyPlatformOverview,
  cleanManagedPlatformPages,
  normalizePlatformClassifierText,
  platformGeneratedMarker,
  platformFields,
  platformReference,
  platformProfiles,
  platformRequestBody,
  platformRequestSchema,
  publicPlatformResponseBody,
  pythonLiteral,
  sharedPlatformDomains,
  validatePlatformProfiles,
} from './generate-llm-model-api-reference.mjs'

const docsRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const repoRoot = path.resolve(docsRoot, '..')
const apiRegistryRoot = path.join(repoRoot, 'sandbase-registry', 'data', 'api')
const platformRoot = path.join(docsRoot, 'model-api-reference', 'platform-apis')
const platformOverview = path.join(platformRoot, 'index.md')
const legacyPlatformOverview = path.join(docsRoot, 'model-api-reference', 'platform-apis.md')
const sidebarFile = path.join(docsRoot, '.vitepress', 'modelApiReferenceSidebar.generated.ts')
const configFile = path.join(docsRoot, '.vitepress', 'config.ts')
const platformSidebarDataRoot = path.join(docsRoot, '.vitepress', 'theme', 'platform-api-sidebars')
const platformSidebarComponent = path.join(docsRoot, '.vitepress', 'theme', 'PlatformApiSidebar.vue')
const platformLandingComponent = path.join(docsRoot, '.vitepress', 'theme', 'PlatformApiLanding.vue')
const themeIndexFile = path.join(docsRoot, '.vitepress', 'theme', 'index.ts')
const themeCssFile = path.join(docsRoot, '.vitepress', 'theme', 'custom.css')

function walk(root, name) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name)
    return entry.isDirectory() ? walk(fullPath, name) : (name.startsWith('.') ? entry.name.endsWith(name) : entry.name === name) ? [fullPath] : []
  })
}

function fixture(overrides = {}) {
  return {
    name: 'fixture/nested/operation',
    vendor: 'Fixture',
    vendor_slug: 'fixture',
    model_slug: 'nested/operation',
    display_name: 'Fixture operation',
    capability_tags: ['api'],
    execution_mode: 'sync',
    __category: 'api',
    __file: 'fixture/model.json',
    unified_schema: {
      paths: {
        '/v1/run': {
          post: {
            requestBody: {
              content: { 'application/json': { schema: { $ref: '#/components/schemas/GenerationRequest' } } },
            },
          },
        },
      },
      components: {
        schemas: {
          GenerationRequest: { type: 'object', properties: {}, required: [] },
          GenerationResponse: { type: 'object', properties: {} },
        },
      },
    },
    ...overrides,
  }
}

function treeHash() {
  const files = [...walk(platformRoot, '.md'), ...walk(platformSidebarDataRoot, '.ts'), sidebarFile].sort()
  return crypto.createHash('sha256').update(files.map((file) => `${path.relative(docsRoot, file)}\0${fs.readFileSync(file)}\0`).join('')).digest('hex')
}

function generatedPlatformData(platform) {
  const source = fs.readFileSync(path.join(platformSidebarDataRoot, `${platform}.ts`), 'utf8')
  return JSON.parse(source.match(/export default (\{[\s\S]+\}) as const/)?.[1] ?? '')
}

function generatedPlatformList() {
  const source = fs.readFileSync(sidebarFile, 'utf8')
  return JSON.parse(source.match(/export const platformApiReferencePlatforms = (\[[\s\S]+?\]) as const/)?.[1] ?? '')
}

describe('Platform API reference generator', () => {
  test('publishes exactly enabled type=api models with unique pages and sidebar links', () => {
    const registryModels = walk(apiRegistryRoot, 'model.json').map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
    const published = registryModels.filter((model) => model.type === 'api' && model.enabled !== false)
    const pages = walk(platformRoot, '.md')
    const expectedPages = new Set([
      path.relative(platformRoot, platformOverview),
      ...published.map((model) => path.join(model.vendor_slug, `${model.model_slug}.md`)),
    ])
    assert.equal(pages.length, published.length + 1)
    assert.deepEqual(new Set(pages.map((file) => path.relative(platformRoot, file))), expectedPages)
    assert.equal(new Set(published.map((model) => model.name)).size, published.length)

    const sidebar = fs.readFileSync(sidebarFile, 'utf8')
    for (const model of published) {
      const link = `/model-api-reference/platform-apis/${model.vendor_slug}/${model.model_slug}`
      assert.equal(sidebar.includes(JSON.stringify(link)), false, `global sidebar must stay compact: ${link}`)
    }
    const platforms = generatedPlatformList()
    assert.equal(platforms.length, new Set(published.map((model) => model.vendor_slug)).size)
    assert.deepEqual(new Set(platforms.map((platform) => platform.slug)), new Set(published.map((model) => model.vendor_slug)))
    assert.equal(platforms.reduce((count, platform) => count + platform.operationCount, 0), published.length)
    assert.doesNotMatch(sidebar, /\/model-api-reference\/platform-apis#[a-z]/)
    for (const model of registryModels.filter((entry) => entry.enabled === false)) {
      const dataFile = path.join(platformSidebarDataRoot, `${model.vendor_slug}.ts`)
      if (fs.existsSync(dataFile)) assert.doesNotMatch(fs.readFileSync(dataFile, 'utf8'), new RegExp(JSON.stringify(`/model-api-reference/platform-apis/${model.vendor_slug}/${model.model_slug}`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    }
  })

  test('writes the APIs landing as a compact managed directory index with stable canonical links', () => {
    assert.equal(fs.existsSync(legacyPlatformOverview), false)
    assert.equal(fs.existsSync(platformOverview), true)
    const landing = fs.readFileSync(platformOverview, 'utf8')
    assert.match(landing, new RegExp(platformGeneratedMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(landing, /^title: APIs$/m)
    assert.match(landing, /^description: Browse 1091 SandBase API operations across 31 platforms\.$/m)
    assert.match(landing, /^aside: false$/m)
    assert.match(landing, /^outline: false$/m)
    assert.match(landing, /<PlatformApiLanding \/>/)
    assert.doesNotMatch(landing, /Platform APIs|^### |\/model-api-reference\/platform-apis\/.+\/.+/m)

    const sidebar = fs.readFileSync(sidebarFile, 'utf8')
    const component = fs.readFileSync(platformSidebarComponent, 'utf8')
    assert.doesNotMatch(sidebar, /\/model-api-reference\/platform-apis/)
    assert.match(component, /withBase\('\/model-api-reference\/platform-apis'\)/)
    assert.doesNotMatch(sidebar, /\/model-api-reference\/platform-apis\/index/)
    const fallbackSidebar = sidebar.slice(sidebar.indexOf('export const platformApiReferenceFallbackSidebarItems'))
    assert.deepEqual(
      [...fallbackSidebar.matchAll(/\{ text: ["']([^"']+)["'], link: ["']([^"']+)["'] \}/g)].map((match) => match.slice(1)),
      [
        ['Overview', '/model-api-reference/'],
        ['LLM Models', '/model-api-reference/llm-models'],
        ['Image Generation', '/model-api-reference/image-generation'],
        ['Video Generation', '/model-api-reference/video-generation'],
        ['Audio Generation', '/model-api-reference/audio-generation'],
      ],
    )
    assert.doesNotMatch(fallbackSidebar, /Platform APIs/)

    const config = fs.readFileSync(configFile, 'utf8')
    assert.match(config, /relativePath === 'model-api-reference\/platform-apis\/index\.md'/)
    assert.match(config, /return `\$\{docsBase\}model-api-reference\/platform-apis`/)
  })

  test('gives platform operations model-level SEO without reusing LLM breadcrumbs', () => {
    const config = fs.readFileSync(configFile, 'utf8')
    assert.match(config, /relativePath\.startsWith\('model-api-reference\/platform-apis\/'\)/)
    assert.match(config, /relativePath !== 'model-api-reference\/platform-apis\/index\.md'/)
    assert.match(config, /isPlatformOperation \? 'APIs' : 'LLM Models'/)
    assert.match(config, /isPlatformOperation \? 'platform-apis' : 'llm-models'/)
    assert.match(config, /name: categoryName,[\s\S]+item: categoryUrl/)
    assert.match(config, /name: String\(seo\.vendor\),[\s\S]+item: isLlmModel \? `\$\{categoryUrl\}\/\$\{seo\.vendorSlug\}` : canonicalUrl/)
    assert.match(config, /'@type': 'WebAPI',[\s\S]+endpointUrl: `https:\/\/api\.sandbase\.ai\$\{seo\.endpoint\}`/)
    assert.match(config, /sameAs: modelDetailUrl/)

    const operation = fs.readFileSync(path.join(platformRoot, 'cloudsway', 'search.md'), 'utf8')
    assert.match(operation, /^  endpoint: "\/v1\/run"$/m)
    assert.match(operation, /^  category: "APIs"$/m)
  })

  test('uses the same stable page shell for the APIs landing and operation pages', () => {
    const landingComponent = fs.readFileSync(platformLandingComponent, 'utf8')
    const themeIndex = fs.readFileSync(themeIndexFile, 'utf8')
    const css = fs.readFileSync(themeCssFile, 'utf8')
    const operation = fs.readFileSync(path.join(platformRoot, 'youtube', 'web-v2', 'video-comments.md'), 'utf8')

    assert.match(landingComponent, /class="platform-api-landing"/)
    assert.match(landingComponent, /operationCount/)
    assert.match(landingComponent, /platformApiReferencePlatforms\.length/)
    assert.match(landingComponent, /v-for="platform in platformApiReferencePlatforms"/)
    assert.doesNotMatch(landingComponent, /group\.operations|operation\.link|operation\.text/)
    assert.match(themeIndex, /app\.component\('PlatformApiLanding', PlatformApiLanding\)/)
    assert.match(operation, /^aside: false$/m)
    assert.match(operation, /^outline: false$/m)
    assert.match(operation, /^  category: "APIs"$/m)
    assert.match(css, /\.VPDoc \.content-container:has\(\.api-reference-page\),\s*\.VPDoc \.content-container:has\(\.platform-api-landing\)/)
    assert.match(css, /\.content-container:not\(:has\(\.api-reference-page\)\):not\(:has\(\.platform-api-landing\)\)/)
    assert.match(landingComponent, /@media \(max-width: 920px\)/)
    assert.match(landingComponent, /@media \(max-width: 640px\)/)
  })

  test('writes one grouped lazy sidebar chunk per platform with complete operation conservation', () => {
    const published = walk(apiRegistryRoot, 'model.json')
      .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
      .filter((model) => model.type === 'api' && model.enabled !== false)
    const platforms = [...new Set(published.map((model) => model.vendor_slug))]
    assert.equal(fs.readdirSync(platformSidebarDataRoot).filter((file) => file.endsWith('.ts')).length, platforms.length)

    let totalOperations = 0
    for (const platform of platforms) {
      const data = generatedPlatformData(platform)
      assert.equal(data.slug, platform)
      const operations = published.filter((model) => model.vendor_slug === platform)
      const groupedOperations = data.groups.flatMap((group) => group.operations)
      assert.equal(data.operationCount, operations.length)
      assert.equal(groupedOperations.length, operations.length)
      assert.ok(data.groups.every((group) => group.operations.length > 0), `${platform}: empty group`)
      assert.equal(new Set(groupedOperations.map((operation) => operation.link)).size, operations.length)
      const otherIndex = data.groups.findIndex((group) => group.key === 'other')
      if (otherIndex !== -1) assert.equal(otherIndex, data.groups.length - 1, `${platform}: Other must be last`)
      for (const model of operations) {
        const link = JSON.stringify(`/model-api-reference/platform-apis/${model.vendor_slug}/${model.model_slug}`)
        assert.equal(groupedOperations.filter((operation) => JSON.stringify(operation.link) === link).length, 1, `${platform}: ${link}`)
      }
      totalOperations += groupedOperations.length
    }
    assert.equal(totalOperations, 1091)

    const config = fs.readFileSync(configFile, 'utf8')
    const component = fs.readFileSync(platformSidebarComponent, 'utf8')
    const themeIndex = fs.readFileSync(themeIndexFile, 'utf8')
    assert.doesNotMatch(config, /platformApiReferenceSidebarRoutes|platform-api-sidebars/)
    assert.ok(config.indexOf("'/model-api-reference/platform-apis/': platformApiReferenceFallbackSidebar") < config.indexOf("'/model-api-reference/': fullModelApiReferenceSidebar"))
    assert.match(component, /import\.meta\.glob<PlatformSidebarModule>\('\.\/platform-api-sidebars\/\*\.ts'\)/)
    assert.match(component, /platformApiReferencePlatforms/)
    assert.match(component, /isModelApiReferenceRoute/)
    assert.match(component, /v-if="isModelApiReferenceRoute"/)
    assert.match(component, /if \(!isPlatformApiRoute\(routePath\)\)/)
    assert.match(component, /model-api-reference\\\/platform-apis\(\?:\\\/\|\$\)/)
    assert.match(component, /sequence !== loadSequence \|\| expandedPlatform\.value !== slug/)
    assert.match(component, /class="category-row"[\s\S]+class="category-link"[\s\S]+>APIs<\/a>[\s\S]+class="category-disclosure"/)
    assert.match(component, /class="category-disclosure"[\s\S]+:aria-expanded="isCategoryExpanded"[\s\S]+aria-controls="platform-api-category-panel"/)
    assert.match(component, /id="platform-api-category-panel" class="category-panel"/)
    assert.match(component, /class="category-link"[\s\S]+withBase\('\/model-api-reference\/platform-apis'\)/)
    assert.doesNotMatch(component, />Overview<|Platform APIs/)
    assert.match(component, /<button[\s\S]+class="disclosure platform-button"[\s\S]+:aria-expanded[\s\S]+:aria-controls/)
    assert.match(component, /class="disclosure domain-button"[\s\S]+:aria-expanded[\s\S]+:aria-controls/)
    assert.match(component, /:aria-current="isActive\(operation\.link\) \? 'page' : undefined"/)
    assert.match(component, /void openPlatform\(slug, true\)/)
    assert.match(component, /\.disclosure:focus-visible/)
    assert.doesNotMatch(component, /\.platform-api-sidebar\s*\{[^}]*border-top/)
    assert.doesNotMatch(component, /class="overview-link"|class="category-button"/)
    assert.doesNotMatch(component, /pushState|replaceState|router\.(?:go|push|replace)/)
    assert.match(themeIndex, /'sidebar-nav-after': \(\) => h\(PlatformApiSidebar\)/)
    assert.doesNotMatch(themeIndex, /'sidebar-nav-before': \(\) => h\(PlatformApiSidebar\)/)
  })

  test('classifies platform-adaptive domains deterministically with profile priority and fallback', () => {
    const classify = (vendor_slug, model_slug, display_name = model_slug) => classifyPlatformModel({ vendor_slug, model_slug, display_name }).key
    assert.deepEqual(normalizePlatformClassifierText('LiveRoom_Product/V2').tokens, ['live', 'room', 'product', 'v2'])
    assert.equal(classify('tiktok', 'ads/search-ads'), 'ads')
    assert.equal(classify('tiktok', 'app-v3/user-search-result'), 'search')
    assert.equal(classify('tiktok', 'app-v3/video-comments'), 'comments')
    assert.equal(classify('tiktok', 'app-v3/live-room-product-list'), 'live')
    assert.equal(classify('youtube', 'web/search-channel'), 'search')
    assert.equal(classify('youtube', 'web-v2/video-comments'), 'comments')
    assert.notEqual(classify('youtube', 'web-v2/video-streams'), 'live')
    assert.equal(classify('dataforseo', 'v3/serp/google/organic/live/advanced'), 'serp')
    assert.equal(classify('dataforseo', 'v3/backlinks/summary/live'), 'backlinks')
    assert.equal(classify('dataforseo', 'v3/future_namespace/live'), 'other')
    assert.equal(classify('firecrawl', 'batch/scrape'), 'scrape')
    assert.equal(classify('firecrawl', 'crawl'), 'crawl')
    assert.equal(classify('fixture', 'v1/opaque-action', 'Search records'), 'search')

    const profiles = {
      fixture: {
        key: 'fixture',
        useFallback: false,
        domains: [
          { key: 'short', label: 'Short', order: 10, matchOrder: 10, prefixes: ['v1'] },
          { key: 'long', label: 'Long', order: 20, matchOrder: 20, prefixes: ['v1/special'] },
        ],
      },
    }
    assert.equal(classifyPlatformModel({ vendor_slug: 'fixture', model_slug: 'v1/special/action', display_name: '' }, profiles, []).key, 'long')
    assert.doesNotThrow(() => validatePlatformProfiles(platformProfiles, sharedPlatformDomains))
    assert.throws(() => validatePlatformProfiles({ bad: { key: 'bad', useFallback: false, domains: [
      { key: 'one', label: 'Same', order: 1, matchOrder: 1 },
      { key: 'two', label: 'Same', order: 2, matchOrder: 2 },
    ] } }, []), /duplicate domain/)
  })

  test('freezes TikTok, YouTube, DataForSEO and Firecrawl domain snapshots', () => {
    const snapshot = Object.fromEntries(['tiktok', 'youtube', 'dataforseo', 'firecrawl'].map((platform) => [
      platform,
      generatedPlatformData(platform).groups.map((group) => [group.label, group.operations.length]),
    ]))
    assert.deepEqual(snapshot, {
      tiktok: [['Ads', 12], ['Creator Analytics', 14], ['Search & Discovery', 34], ['Comments & Engagement', 7], ['Live', 16], ['Commerce', 14], ['Messaging', 1], ['Content & Video', 22], ['Users & Accounts', 18], ['Utilities', 21], ['Other', 2]],
      youtube: [['Search & Discovery', 11], ['Comments & Community', 5], ['Videos & Media', 15], ['Channels & Users', 7]],
      dataforseo: [['SERP', 26], ['Keywords', 8], ['Backlinks', 8], ['Business Data', 6], ['App Data', 5], ['Merchant', 4], ['On-Page', 6], ['Domain Analytics', 6], ['Content Analysis', 4], ['Labs', 12]],
      firecrawl: [['Crawl', 1], ['Scrape', 2], ['Search', 1], ['Map', 1]],
    })
  })

  test('expands nullable anyOf fields and keeps conditional YouTube keyword usable without inventing required', () => {
    const page = fs.readFileSync(path.join(platformRoot, 'youtube', 'web-v2', 'general-search-v2.md'), 'utf8')
    const encoded = page.match(/^apiReferenceJson: (.+)$/m)?.[1]
    assert.ok(encoded)
    const reference = JSON.parse(JSON.parse(encoded))
    const fields = reference.groups.find((group) => group.title === 'Request body').fields
    const keyword = fields.find((field) => field.name === 'keyword')
    const duration = fields.find((field) => field.name === 'duration')
    assert.deepEqual(keyword, {
      name: 'keyword',
      type: 'string | null',
      required: false,
      description: '搜索关键词（首次请求必填）/Search keyword (required for first request)',
    })
    assert.equal(duration.type, 'string | null')
    assert.equal(duration.constraints, 'Allowed values: short, medium, long')
    for (const example of reference.examples) assert.match(example.code, /"keyword": "keyword"/)
  })

  test('uses /v1/run path schema before GenerationRequest fallback', () => {
    const model = fixture()
    model.unified_schema.paths['/v1/run'].post.requestBody.content['application/json'].schema = {
      type: 'object',
      required: ['from_path'],
      properties: { from_path: { type: 'string', example: 'path-value' } },
    }
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object',
      required: ['from_fallback'],
      properties: { from_fallback: { type: 'string' } },
    }
    assert.deepEqual(platformRequestSchema(model).required, ['from_path'])
    assert.deepEqual(platformRequestBody(model), { model: model.name, from_path: 'path-value' })
  })

  test('builds valid required examples using default, example, examples, enum, arrays, objects and oneOf', () => {
    const model = fixture()
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object',
      required: ['by_default', 'by_example', 'by_examples', 'by_enum', 'items', 'config', 'variant'],
      properties: {
        by_default: { type: 'integer', default: 7 },
        by_example: { type: 'string', example: 'single' },
        by_examples: { type: 'string', examples: ['plural'] },
        by_enum: { type: 'string', enum: ['first', 'second'] },
        items: { type: 'array', items: { type: 'string', example: 'item' } },
        config: { type: 'object', required: ['enabled'], properties: { enabled: { type: 'boolean' } } },
        variant: { oneOf: [{ type: 'string', example: 'selected' }, { type: 'integer' }] },
      },
    }
    assert.deepEqual(platformRequestBody(model), {
      model: model.name,
      by_default: 7,
      by_example: 'single',
      by_examples: 'plural',
      by_enum: 'first',
      items: ['item'],
      config: { enabled: false },
      variant: 'selected',
    })
  })

  test('honors exact string lengths for placeholders and rejects shorter or longer examples', () => {
    const model = fixture()
    const videoIdSchema = { type: 'string', minLength: 11, maxLength: 11 }
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object',
      required: ['video_id'],
      properties: { video_id: videoIdSchema },
    }

    const requestBody = platformRequestBody(model)
    assert.equal(requestBody.video_id.length, 11)
    assert.doesNotThrow(() => assertExampleMatchesSchema(model, requestBody.video_id, videoIdSchema, 'request.video_id'))
    assert.throws(() => assertExampleMatchesSchema(model, '1234567890', videoIdSchema, 'request.video_id'), /shorter than minLength/)
    assert.throws(() => assertExampleMatchesSchema(model, '123456789012', videoIdSchema, 'request.video_id'), /longer than maxLength/)

    const youtubeModels = walk(apiRegistryRoot, 'model.json')
      .map((file) => ({ ...JSON.parse(fs.readFileSync(file, 'utf8')), __category: 'api', __file: file }))
      .filter((entry) => ['youtube/web-v2/video-comments', 'youtube/web-v2/video-info'].includes(entry.name))
    assert.equal(youtubeModels.length, 2)
    for (const youtubeModel of youtubeModels) {
      assert.equal(platformRequestBody(youtubeModel).video_id.length, 11, youtubeModel.name)
    }
  })

  test('constructs and validates pattern-safe required strings', () => {
    const model = fixture()
    const schema = { type: 'string', pattern: '^[A-Za-z0-9_-]+$' }
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object', required: ['job_id'], properties: { job_id: schema },
    }
    const body = platformRequestBody(model)
    assert.match(body.job_id, /^[A-Za-z0-9_-]+$/)
    assert.doesNotThrow(() => assertExampleMatchesSchema(model, body.job_id, schema, 'request.job_id'))
    assert.throws(() => assertExampleMatchesSchema(model, '<job_id>', schema, 'request.job_id'), /does not match pattern/)
  })

  test('serializes Python literals without rewriting JSON words inside strings', () => {
    const literal = pythonLiteral({ enabled: true, disabled: false, empty: null, url: 'https://example.com/?true=false&value=null' })
    assert.match(literal, /"enabled": True/)
    assert.match(literal, /"disabled": False/)
    assert.match(literal, /"empty": None/)
    assert.match(literal, /"url": "https:\/\/example.com\/\?true=false&value=null"/)
    assert.doesNotMatch(literal, /\?True=False/)
  })

  test('recursively exposes nested request fields and preserves public constraints', () => {
    const model = fixture()
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object',
      properties: {
        contents: { type: 'object', properties: { summary: { type: 'boolean', description: 'Return a summary.' } } },
        ids: { type: 'array', minItems: 1, maxItems: 1000, uniqueItems: true, items: { type: 'string' } },
      },
      required: [],
    }
    const fields = platformFields(model)
    assert.ok(fields.some((field) => field.name === 'contents.summary' && field.type === 'boolean'))
    assert.match(fields.find((field) => field.name === 'ids').constraints, /Items: 1 to 1000/)
    assert.match(fields.find((field) => field.name === 'ids').constraints, /Items must be unique/)
  })

  test('serializes compound and empty defaults without hiding their JSON shape', () => {
    const model = fixture()
    model.unified_schema.components.schemas.GenerationRequest = {
      type: 'object', required: [], properties: {
        formats: { type: 'array', default: ['markdown'], items: { type: 'string' } },
        options: { type: 'object', default: {} },
        query: { type: 'string', default: '' },
        tags: { type: 'array', default: [], items: { type: 'string' } },
      },
    }
    const defaults = Object.fromEntries(platformFields(model).map((field) => [field.name, field.default]))
    assert.deepEqual(defaults, { formats: '["markdown"]', options: '{}', query: '""', tags: '[]' })
    const component = fs.readFileSync(path.join(docsRoot, '.vitepress/theme/ApiReferencePage.vue'), 'utf8')
    assert.match(component, /field\.default !== undefined/g)
  })

  test('polls async Python and TypeScript examples until terminal status and handles errors', () => {
    const reference = platformReference(fixture({ execution_mode: 'async' }))
    const python = reference.examples.find((example) => example.language === 'python').code
    const typescript = reference.examples.find((example) => example.language === 'typescript').code
    assert.match(python, /while result\["status"\] in \("pending", "running"\):/)
    assert.match(python, /poll\.raise_for_status\(\)/)
    assert.match(python, /if result\["status"\] in \("failed", "timeout"\):/)
    assert.match(typescript, /while \(\["pending", "running"\]\.includes\(result\.status\)\)/)
    assert.match(typescript, /if \(!poll\.ok\) throw new Error/)
    assert.match(typescript, /\["failed", "timeout"\]\.includes\(result\.status\)/)
  })

  test('copies all five response states into page Markdown', () => {
    const component = fs.readFileSync(path.join(docsRoot, '.vitepress/theme/ApiReferencePage.vue'), 'utf8')
    assert.match(component, /## Response states/)
    assert.match(component, /reference\.notes\.forEach/)
    assert.match(component, /note\.description/)
  })

  test('constructs schema-valid request examples for all 1091 enabled API models', () => {
    const models = walk(apiRegistryRoot, 'model.json')
      .map((file) => ({ ...JSON.parse(fs.readFileSync(file, 'utf8')), __category: 'api', __file: file }))
      .filter((model) => model.type === 'api' && model.enabled !== false)

    assert.equal(models.length, 1091)
    for (const model of models) {
      assert.doesNotThrow(() => platformRequestBody(model), model.name)
    }
  })

  test('fails closed on identity and URL/name conflicts', () => {
    const model = fixture()
    const duplicate = structuredClone(model)
    duplicate.__file = 'duplicate/model.json'
    assert.throws(() => assertUniquePlatformModels([model, duplicate], { slug: 'platform-apis' }), /Duplicate Platform API model name/)
    assert.throws(() => assertUniquePlatformModels([{ ...model, name: 'wrong/name' }], { slug: 'platform-apis' }), /name must equal vendor_slug\/model_slug/)
  })

  test('removes only managed orphan pages and refuses unknown files', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbase-platform-pages-'))
    const expected = path.join(root, 'vendor', 'kept.md')
    const orphan = path.join(root, 'vendor', 'orphan.md')
    fs.mkdirSync(path.dirname(expected), { recursive: true })
    fs.writeFileSync(expected, `---\n${platformGeneratedMarker}\n---\n`)
    fs.writeFileSync(orphan, `---\n${platformGeneratedMarker}\n---\n`)
    assert.equal(cleanManagedPlatformPages(new Set([path.resolve(expected)]), root), 1)
    assert.equal(fs.existsSync(expected), true)
    assert.equal(fs.existsSync(orphan), false)

    const unknown = path.join(root, 'hand-written.md')
    fs.writeFileSync(unknown, '# Keep me\n')
    assert.throws(() => cleanManagedPlatformPages(new Set([path.resolve(expected)]), root), /Refusing to delete unknown/)
    assert.equal(fs.existsSync(unknown), true)

    const legacyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbase-platform-legacy-'))
    const legacy = path.join(legacyRoot, 'platform-apis.md')
    fs.writeFileSync(legacy, '---\ntitle: Platform APIs\n---\n\n# Platform APIs\n\nSandBase currently publishes API reference pages for 1 enabled operations.\n\nPlatform operations use `POST /v1/run` with a model.\n')
    assert.equal(cleanLegacyPlatformOverview(legacy), 1)
    assert.equal(fs.existsSync(legacy), false)
    fs.writeFileSync(legacy, '# Hand-written page\n')
    assert.throws(() => cleanLegacyPlatformOverview(legacy), /Refusing to delete unknown legacy/)
    assert.equal(fs.existsSync(legacy), true)
  })

  test('generates sync and async public /v1/run examples without provider internals', () => {
    const pages = walk(platformRoot, '.md').map((file) => fs.readFileSync(file, 'utf8'))
    const syncPage = pages.find((content) => content.includes('execution_mode') && content.includes('\\"default\\":\\"sync\\"'))
    const asyncPage = pages.find((content) => content.includes('execution_mode') && content.includes('\\"default\\":\\"async\\"'))
    assert.ok(syncPage)
    assert.ok(asyncPage)
    assert.match(syncPage, /POST|\\"method\\":\\"POST\\"/)
    assert.match(asyncPage, /GET \/v1\/run\/\{id\}|\/v1\/run\/f3d2e8a1-/)
    for (const content of pages) assert.doesNotMatch(content, /provider_name|upstream_model|adapter_config|\/v1\/runs\/\{task_id\}/)
  })

  test('uses the B-098 public response matrix for all 1089 sync and 2 async operations', () => {
    const models = walk(apiRegistryRoot, 'model.json')
      .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
      .filter((model) => model.type === 'api' && model.enabled !== false)
    const counts = { sync: 0, async: 0 }

    for (const model of models) {
      counts[model.execution_mode] += 1
      const page = fs.readFileSync(path.join(platformRoot, model.vendor_slug, `${model.model_slug}.md`), 'utf8')
      const encoded = page.match(/^apiReferenceJson: (.+)$/m)?.[1]
      assert.ok(encoded, model.name)
      const reference = JSON.parse(JSON.parse(encoded))
      const primary = JSON.parse(reference.response.code)
      const expectedStatus = model.execution_mode === 'async' ? 'pending' : 'completed'
      assert.deepEqual(primary, publicPlatformResponseBody(model, expectedStatus), model.name)
      assert.equal(reference.response.status, model.execution_mode === 'async' ? '202 Accepted' : '200 OK')

      const matrix = Object.fromEntries(reference.notes.map((note) => [note.title.replace(' response', ''), JSON.parse(note.description)]))
      for (const status of ['pending', 'running']) {
        assert.deepEqual(Object.keys(matrix[status]), ['id', 'status', 'model'], `${model.name}: ${status}`)
      }
      assert.deepEqual(Object.keys(matrix.completed), ['id', 'status', 'model', 'outputs'], `${model.name}: completed keys`)
      assert.equal(matrix.completed.outputs.length, 1, `${model.name}: completed outputs length`)
      assert.deepEqual(Object.keys(matrix.completed.outputs[0]), ['data'], `${model.name}: completed output keys`)
      const generationResponse = model.unified_schema?.components?.schemas?.GenerationResponse
      if (generationResponse?.required?.length) {
        assert.doesNotThrow(() => assertExampleMatchesSchema(model, matrix.completed.outputs[0].data, generationResponse, `${model.name}.completed.data`))
      }
      for (const status of ['failed', 'timeout']) {
        assert.deepEqual(Object.keys(matrix[status]), ['id', 'status', 'model', 'error'], `${model.name}: ${status}`)
        assert.deepEqual(Object.keys(matrix[status].error), ['type', 'message'], `${model.name}: ${status} error`)
        assert.equal('outputs' in matrix[status], false, `${model.name}: ${status} outputs`)
      }
    }

    assert.deepEqual(counts, { sync: 1089, async: 2 })
    const cloudsway = models.find((model) => model.name === 'cloudsway/search')
    assert.ok(cloudsway)
    assert.ok(Array.isArray(publicPlatformResponseBody(cloudsway, 'completed').outputs[0].data.results))
  })

  test('is byte-stable across consecutive generation runs', () => {
    const generator = path.join(docsRoot, 'scripts', 'generate-llm-model-api-reference.mjs')
    execFileSync(process.execPath, [generator], { cwd: docsRoot, stdio: 'pipe' })
    const first = treeHash()
    execFileSync(process.execPath, [generator], { cwd: docsRoot, stdio: 'pipe' })
    assert.equal(treeHash(), first)
  })
})
