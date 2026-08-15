import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(docsRoot, '..')
const registryDataRoot = path.join(repoRoot, 'sandbase-registry', 'data')
const llmRegistryRoot = path.join(registryDataRoot, 'llm')
const multimodalRegistryRoot = path.join(registryDataRoot, 'multimodal')
const apiRegistryRoot = path.join(registryDataRoot, 'api')
const modelApiRoot = path.join(docsRoot, 'model-api-reference')
const llmPagesRoot = path.join(modelApiRoot, 'llm-models')
const imagePagesRoot = path.join(modelApiRoot, 'image-generation')
const platformPagesRoot = path.join(modelApiRoot, 'platform-apis')
const platformOverviewPath = path.join(platformPagesRoot, 'index.md')
const legacyPlatformOverviewPath = path.join(modelApiRoot, 'platform-apis.md')
const themeRoot = path.join(docsRoot, '.vitepress', 'theme')
const sidebarFile = path.join(docsRoot, '.vitepress', 'modelApiReferenceSidebar.generated.ts')
const specsFile = path.join(themeRoot, 'modelApiReferenceSpecs.ts')
const platformSidebarDataRoot = path.join(themeRoot, 'platform-api-sidebars')

const llmVendorPriority = [
  'openai',
  'anthropic',
  'google',
  'deepseek',
  'alibaba',
  'meta',
  'bytedance',
  'bytedance-seed',
  'x-ai',
  'mistral',
  'perplexity',
  'cohere',
]

const imageVendorPriority = [
  'openai',
  'google',
  'ideogram',
  'black-forest-labs',
  'bytedance',
  'kling',
  'recraft',
  'runway',
  'luma',
  'z-image',
]

const videoVendorPriority = [
  'openai',
  'bytedance',
  'kling',
  'google',
  'luma',
  'runway',
  'veo',
  'wan',
  'minimax',
  'pika',
  'veed',
]

const audioVendorPriority = [
  'openai',
  'elevenlabs',
  'google',
  'minimax',
  'mirelo',
  'stability-ai',
  'alibaba',
]

const platformVendorPriority = [
  'youtube',
  'tiktok',
  'instagram',
  'dataforseo',
  'nango',
]

const platformGeneratedMarker = 'generatedBy: "sandbase-platform-api-reference"'

const sharedPlatformDomains = [
  { key: 'search', label: 'Search & Discovery', order: 10, matchOrder: 10, tokens: ['search', 'discover', 'discovery', 'trending', 'trend', 'recommend', 'recommendation', 'suggest', 'suggestion', 'suggestions', 'similar', 'explore', 'feed', 'hashtag', 'tag', 'keyword'] },
  { key: 'comments', label: 'Comments & Engagement', order: 20, matchOrder: 20, tokens: ['comment', 'comments', 'reply', 'replies', 'review', 'reviews', 'community', 'engagement'] },
  { key: 'live', label: 'Live', order: 30, matchOrder: 30, tokens: ['live', 'webcast', 'livestream'] },
  { key: 'commerce', label: 'Commerce', order: 40, matchOrder: 40, tokens: ['shop', 'commerce', 'product', 'products', 'merchant', 'seller', 'sellers', 'order', 'cart'] },
  { key: 'messaging', label: 'Messaging', order: 50, matchOrder: 50, tokens: ['message', 'messages', 'messaging', 'inbox', 'chat'] },
  { key: 'content', label: 'Content & Video', order: 60, matchOrder: 60, tokens: ['video', 'videos', 'post', 'posts', 'item', 'items', 'media', 'photo', 'photos', 'music', 'shorts', 'caption', 'captions', 'subtitle', 'subtitles', 'stream', 'streams'] },
  { key: 'users', label: 'Users & Accounts', order: 70, matchOrder: 70, tokens: ['user', 'users', 'account', 'accounts', 'channel', 'channels', 'creator', 'author', 'profile', 'follower', 'followers', 'following', 'fans'] },
  { key: 'utilities', label: 'Utilities', order: 80, matchOrder: 80, tokens: ['url', 'id', 'ids', 'status', 'token', 'cookie', 'device', 'encrypt', 'decrypt', 'generate', 'convert', 'download', 'qr', 'webhook'] },
]

const platformProfiles = {
  tiktok: {
    key: 'tiktok',
    useFallback: true,
    domains: [
      { key: 'ads', label: 'Ads', order: 5, matchOrder: 5, prefixes: ['ads'] },
      { key: 'creator', label: 'Creator Analytics', order: 6, matchOrder: 6, prefixes: ['creator'] },
    ],
  },
  youtube: {
    key: 'youtube',
    useFallback: false,
    domains: [
      { key: 'search', label: 'Search & Discovery', order: 10, matchOrder: 10, tokens: ['search', 'trending', 'suggestion', 'suggestions', 'related', 'relate'] },
      { key: 'comments', label: 'Comments & Community', order: 20, matchOrder: 20, tokens: ['comment', 'comments', 'reply', 'replies', 'community'] },
      { key: 'videos', label: 'Videos & Media', order: 30, matchOrder: 30, tokens: ['video', 'videos', 'shorts', 'post', 'media', 'caption', 'captions', 'subtitle', 'subtitles', 'stream', 'streams'] },
      { key: 'channels', label: 'Channels & Users', order: 40, matchOrder: 40, tokens: ['channel', 'channels', 'user', 'users', 'profile'] },
      { key: 'utilities', label: 'Utilities', order: 50, matchOrder: 50, tokens: ['url', 'id', 'ids', 'signed', 'download'] },
    ],
  },
  dataforseo: {
    key: 'dataforseo',
    useFallback: false,
    domains: [
      { key: 'serp', label: 'SERP', order: 10, matchOrder: 10, prefixes: ['v3/serp'] },
      { key: 'keywords', label: 'Keywords', order: 20, matchOrder: 20, prefixes: ['v3/keywords_data'] },
      { key: 'backlinks', label: 'Backlinks', order: 30, matchOrder: 30, prefixes: ['v3/backlinks'] },
      { key: 'business-data', label: 'Business Data', order: 40, matchOrder: 40, prefixes: ['v3/business_data'] },
      { key: 'app-data', label: 'App Data', order: 50, matchOrder: 50, prefixes: ['v3/app_data'] },
      { key: 'merchant', label: 'Merchant', order: 60, matchOrder: 60, prefixes: ['v3/merchant'] },
      { key: 'on-page', label: 'On-Page', order: 70, matchOrder: 70, prefixes: ['v3/on_page'] },
      { key: 'domain-analytics', label: 'Domain Analytics', order: 80, matchOrder: 80, prefixes: ['v3/domain_analytics'] },
      { key: 'content-analysis', label: 'Content Analysis', order: 90, matchOrder: 90, prefixes: ['v3/content_analysis'] },
      { key: 'labs', label: 'Labs', order: 100, matchOrder: 100, prefixes: ['v3/dataforseo_labs'] },
    ],
  },
  firecrawl: {
    key: 'firecrawl',
    useFallback: false,
    domains: [
      { key: 'crawl', label: 'Crawl', order: 10, matchOrder: 10, prefixes: ['crawl'] },
      { key: 'scrape', label: 'Scrape', order: 20, matchOrder: 20, prefixes: ['batch/scrape', 'scrape'] },
      { key: 'search', label: 'Search', order: 30, matchOrder: 30, prefixes: ['search'] },
      { key: 'map', label: 'Map', order: 40, matchOrder: 40, prefixes: ['map'] },
    ],
  },
}

function normalizePlatformClassifierText(value) {
  const normalized = String(value ?? '')
    .normalize('NFKC')
    .replace(/([\p{Ll}\d])(\p{Lu})/gu, '$1 $2')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}/]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*\/\s*/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .trim()
  return {
    path: normalized,
    tokens: normalized.split(/[\s/]+/).filter(Boolean),
  }
}

function containsPhrase(tokens, phrase) {
  const phraseTokens = normalizePlatformClassifierText(phrase).tokens
  if (!phraseTokens.length || phraseTokens.length > tokens.length) return false
  return tokens.some((_, index) => phraseTokens.every((token, offset) => tokens[index + offset] === token))
}

function validatePlatformProfiles(profiles = platformProfiles, fallbackDomains = sharedPlatformDomains) {
  const validateDomains = (domains, owner) => {
    const keys = new Set()
    const labels = new Set()
    const orders = new Set()
    const matchOrders = new Set()
    const prefixes = new Set()
    for (const domain of domains) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(domain.key ?? '')) throw new Error(`${owner}: invalid domain key ${domain.key}`)
      if (typeof domain.label !== 'string' || !domain.label.trim()) throw new Error(`${owner}: missing label for ${domain.key}`)
      if (!Number.isFinite(domain.order) || !Number.isFinite(domain.matchOrder)) throw new Error(`${owner}: invalid order for ${domain.key}`)
      if (keys.has(domain.key) || labels.has(domain.label) || orders.has(domain.order) || matchOrders.has(domain.matchOrder)) throw new Error(`${owner}: duplicate domain key, label or order`)
      keys.add(domain.key)
      labels.add(domain.label)
      orders.add(domain.order)
      matchOrders.add(domain.matchOrder)
      for (const prefix of domain.prefixes ?? []) {
        const rawPrefix = String(prefix)
        const normalized = normalizePlatformClassifierText(prefix).path
        if (!normalized || rawPrefix.startsWith('/') || rawPrefix.endsWith('/') || rawPrefix.includes('//') || prefixes.has(normalized)) throw new Error(`${owner}: invalid or duplicate path prefix ${prefix}`)
        prefixes.add(normalized)
      }
    }
  }
  validateDomains(fallbackDomains, 'shared fallback')
  for (const [slug, profile] of Object.entries(profiles)) {
    if (profile.key !== slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid platform profile key: ${slug}`)
    validateDomains(profile.domains ?? [], `platform profile ${slug}`)
    if (profile.useFallback !== false) {
      const profileDomains = profile.domains ?? []
      for (const fallbackDomain of fallbackDomains) {
        if (profileDomains.some((domain) => domain.key === fallbackDomain.key || domain.label === fallbackDomain.label || domain.order === fallbackDomain.order)) {
          throw new Error(`platform profile ${slug}: domain key, label or order conflicts with shared fallback`)
        }
      }
    }
  }
}

function matchDomainRules(text, domains) {
  return [...domains]
    .sort((left, right) => left.matchOrder - right.matchOrder)
    .find((domain) => (domain.phrases ?? []).some((phrase) => containsPhrase(text.tokens, phrase))
      || (domain.tokens ?? []).some((token) => text.tokens.includes(normalizePlatformClassifierText(token).tokens[0])))
}

function classifyPlatformModel(model, profiles = platformProfiles, fallbackDomains = sharedPlatformDomains) {
  const profile = profiles[model.vendor_slug]
  const profileDomains = profile?.domains ?? []
  const slugText = normalizePlatformClassifierText(model.model_slug)
  const prefixMatch = profileDomains
    .flatMap((domain) => (domain.prefixes ?? []).map((prefix) => ({ domain, prefix: normalizePlatformClassifierText(prefix).path })))
    .filter(({ prefix }) => slugText.path === prefix || slugText.path.startsWith(`${prefix}/`))
    .sort((left, right) => right.prefix.length - left.prefix.length || left.domain.matchOrder - right.domain.matchOrder)[0]?.domain
  const fallback = profile?.useFallback === false ? [] : fallbackDomains
  const domain = prefixMatch
    ?? matchDomainRules(slugText, profileDomains)
    ?? matchDomainRules(slugText, fallback)
    ?? matchDomainRules(normalizePlatformClassifierText(model.display_name), profileDomains)
    ?? matchDomainRules(normalizePlatformClassifierText(model.display_name), fallback)
  return domain ? { key: domain.key, label: domain.label, order: domain.order } : { key: 'other', label: 'Other', order: Number.POSITIVE_INFINITY }
}

function platformSidebarGroups(group, profiles = platformProfiles, fallbackDomains = sharedPlatformDomains) {
  const grouped = new Map()
  const links = new Set()
  for (const model of group.models) {
    const domain = classifyPlatformModel(model, profiles, fallbackDomains)
    if (!grouped.has(domain.key)) grouped.set(domain.key, { ...domain, operations: [] })
    const link = `/model-api-reference/platform-apis/${model.vendor_slug}/${model.model_slug}`
    if (links.has(link)) throw new Error(`${group.slug}: duplicate sidebar operation ${link}`)
    links.add(link)
    grouped.get(domain.key).operations.push({ text: cleanTitle(model), link })
  }
  const groups = [...grouped.values()].sort((left, right) => left.order - right.order || left.label.localeCompare(right.label))
  if (groups.some((domain) => !domain.operations.length)) throw new Error(`${group.slug}: empty platform sidebar group`)
  if (groups.reduce((count, domain) => count + domain.operations.length, 0) !== group.models.length || links.size !== group.models.length) {
    throw new Error(`${group.slug}: platform sidebar operation count mismatch`)
  }
  return groups.map(({ key, label, operations }) => ({ key, label, operations }))
}

validatePlatformProfiles()

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return entry.name === 'model.json' ? [fullPath] : []
  })
}

function isEnabled(model) {
  return model.enabled !== false
}

function slugPath(model) {
  return path.posix.join(model.vendor_slug, model.model_slug)
}

function docsLink(model, category) {
  return `/model-api-reference/${category.slug}/${slugPath(model)}`
}

function cleanTitle(model) {
  const prefix = `${model.vendor}:`
  return model.display_name?.startsWith(prefix)
    ? model.display_name.slice(prefix.length).trim()
    : model.display_name
}

function cleanDescription(model) {
  return String(model.description ?? '')
    .split(/\n\s*\n/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function markdownText(value) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function openApiPaths(model) {
  return model.unified_schema?.paths && typeof model.unified_schema.paths === 'object'
    ? model.unified_schema.paths
    : {}
}

function submitPathFor(model) {
  const paths = openApiPaths(model)
  return Object.keys(paths).find((apiPath) => paths[apiPath]?.post) ?? '/v1/run'
}

function pollPathFor(model) {
  const paths = openApiPaths(model)
  return Object.keys(paths).find((apiPath) => paths[apiPath]?.get && apiPath.includes('{id}')) ?? `${submitPathFor(model)}/{id}`
}

function endpointFor(model, category) {
  if (['image', 'video', 'audio', 'api'].includes(category.key)) return '/v1/run'
  return model.vendor_slug === 'anthropic' ? '/v1/messages' : '/v1/chat/completions'
}

function seoDescription(model, protocol, category) {
  const endpoint = endpointFor(model, category)
  const base = `${cleanTitle(model)} API reference for SandBase. Use model ${model.name} with ${endpoint}; view request fields, examples, capabilities, and response format.`
  return base.length > 170 ? `${base.slice(0, 167).trimEnd()}...` : base
}

function yamlString(value) {
  return JSON.stringify(String(value))
}

function modelSort(a, b) {
  const timeA = Date.parse(a.published_at ?? '')
  const timeB = Date.parse(b.published_at ?? '')
  const hasTimeA = Number.isFinite(timeA)
  const hasTimeB = Number.isFinite(timeB)
  if (hasTimeA || hasTimeB) {
    if (!hasTimeA) return 1
    if (!hasTimeB) return -1
    if (timeA !== timeB) return timeB - timeA
  }

  const orderA = Number.isFinite(a.sort_order) ? a.sort_order : Number.MAX_SAFE_INTEGER
  const orderB = Number.isFinite(b.sort_order) ? b.sort_order : Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) return orderA - orderB
  return cleanTitle(a).localeCompare(cleanTitle(b), 'en')
}

function vendorSortWithPriority(priority) {
  return (a, b) => {
    const indexA = priority.indexOf(a.slug)
    const indexB = priority.indexOf(b.slug)
    if (indexA !== -1 || indexB !== -1) {
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    }
    return a.vendor.localeCompare(b.vendor, 'en')
  }
}

function vendorSort(a, b) {
  const indexA = llmVendorPriority.indexOf(a.slug)
  const indexB = llmVendorPriority.indexOf(b.slug)
  if (indexA !== -1 || indexB !== -1) {
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  }
  return a.vendor.localeCompare(b.vendor, 'en')
}

function tsString(value) {
  return JSON.stringify(value)
}

function sidebarItem(model, category) {
  return `{ text: ${tsString(cleanTitle(model))}, link: ${tsString(docsLink(model, category))} }`
}

function loadModels(root, filter, category) {
  return walk(root)
    .map((file) => {
      const model = JSON.parse(fs.readFileSync(file, 'utf8'))
      return {
        ...model,
        __file: file,
        __category: category.key,
      }
    })
    .filter((model) => isEnabled(model) && filter(model))
}

const fieldDescriptions = {
  seed: 'Seed used to make sampling more reproducible when the provider supports it.',
  stop: 'Sequences that stop generation when the model produces one of them.',
  tools: 'Tool definitions that the model may call during the response.',
  top_p: 'Nucleus sampling threshold. Use this or temperature, but usually not both.',
  stream: 'When true, returns incremental Server-Sent Events instead of one completed response.',
  messages: 'Conversation messages in system, user, or assistant order.',
  system: 'System instruction applied before the conversation messages.',
  max_tokens: 'Maximum number of tokens the model may generate in the response.',
  temperature: 'Sampling temperature. Lower values are more deterministic; higher values are more creative.',
  tool_choice: 'Controls whether the model may call a tool and, when supported, which tool it must call.',
  response_format: 'Controls the response format, including JSON mode or structured JSON output when supported.',
  presence_penalty: 'Penalizes tokens that already appeared, encouraging the model to introduce new topics.',
  frequency_penalty: 'Penalizes repeated tokens, reducing repetition in the generated response.',
  id: 'Unique identifier for the submitted request or completed response.',
  status: 'Current generation status. Non-terminal responses should be polled until completed, failed, or timeout.',
  model: 'Model identifier used for this request.',
  outputs: 'Generated output items returned when the task completes.',
  error: 'Structured error returned when the task fails.',
  url: 'Download URL for a generated output asset.',
  content_type: 'MIME type of the generated output asset.',
  prompt: 'Text prompt that describes the image or asset to generate.',
  image: 'Input image URL or image data used by this model.',
  image_url: 'Input image URL used as a source image.',
  images_data_url: 'URL of an archive or image collection used by this model.',
  aspect_ratio: 'Aspect ratio of the generated image.',
  output_format: 'File format for generated image outputs.',
  negative_prompt: 'Text describing content the model should avoid generating.',
  num_inference_steps: 'Number of denoising or inference steps to run when supported.',
}

const fieldOrder = [
  'messages',
  'system',
  'prompt',
  'negative_prompt',
  'image',
  'image_url',
  'images_data_url',
  'aspect_ratio',
  'output_format',
  'num_images',
  'num_inference_steps',
  'max_tokens',
  'temperature',
  'top_p',
  'stream',
  'tools',
  'tool_choice',
  'response_format',
  'stop',
  'presence_penalty',
  'frequency_penalty',
  'seed',
]

function formatType(schema = {}) {
  if (schema.$ref) return schema.$ref.split('/').pop() ?? 'object'
  if (schema.type === 'array') return `array${schema.items?.type ? `<${schema.items.type}>` : ''}`
  return schema.type ?? 'object'
}

function formatConstraints(schema = {}) {
  const limits = []
  if (schema.minimum !== undefined || schema.maximum !== undefined) {
    limits.push(`Range: ${schema.minimum ?? '−∞'} to ${schema.maximum ?? '∞'}`)
  }
  if (schema.enum?.length) limits.push(`Allowed values: ${schema.enum.join(', ')}`)
  return limits.join('. ')
}

function resolveRef(model, schema) {
  if (!schema?.$ref) return schema
  const name = schema.$ref.split('/').pop()
  return name ? model.unified_schema?.components?.schemas?.[name] : schema
}

function pathWithExampleId(apiPath) {
  return apiPath.replace('{id}', 'run_abc123')
}

function isAsyncGenerationModel(model) {
  return ['image', 'video', 'audio'].includes(model.__category)
}

function requestSchema(model) {
  if (isAsyncGenerationModel(model)) {
    const paths = openApiPaths(model)
    const rawSchema = paths[submitPathFor(model)]?.post?.requestBody?.content?.['application/json']?.schema
      ?? model.unified_schema?.components?.schemas?.GenerationRequest
    return resolveRef(model, rawSchema) ?? {}
  }
  return model.unified_schema ?? {}
}

function fieldsFromSchema(schema = {}, fallbackDescription) {
  const properties = schema.properties ?? {}
  const required = new Set(schema.required ?? [])
  const orderedNames = Array.isArray(schema['x-order-properties']) ? schema['x-order-properties'] : []
  return Object.entries(properties)
    .sort(([nameA], [nameB]) => {
      const orderedA = orderedNames.indexOf(nameA)
      const orderedB = orderedNames.indexOf(nameB)
      if (orderedA !== -1 || orderedB !== -1) return (orderedA === -1 ? 999 : orderedA) - (orderedB === -1 ? 999 : orderedB)
      const indexA = fieldOrder.indexOf(nameA)
      const indexB = fieldOrder.indexOf(nameB)
      if (indexA !== -1 || indexB !== -1) return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      return nameA.localeCompare(nameB)
    })
    .map(([name, fieldSchema]) => ({
      name,
      type: formatType(fieldSchema),
      required: required.has(name),
      description: String(fieldSchema.description ?? fieldDescriptions[name] ?? fallbackDescription).replace(/\s+/g, ' ').trim(),
      default: fieldSchema.default === undefined ? undefined : String(fieldSchema.default),
      constraints: formatConstraints(fieldSchema) || undefined,
    }))
}

function schemaFields(model) {
  return fieldsFromSchema(requestSchema(model), 'Request parameter supported by this model.')
}

function responseSchema(model) {
  if (isAsyncGenerationModel(model)) {
    const paths = openApiPaths(model)
    const rawSchema = paths[submitPathFor(model)]?.post?.responses?.['202']?.content?.['application/json']?.schema
      ?? paths[submitPathFor(model)]?.post?.responses?.['200']?.content?.['application/json']?.schema
      ?? paths[pollPathFor(model)]?.get?.responses?.['200']?.content?.['application/json']?.schema
      ?? model.unified_schema?.components?.schemas?.GenerationResponse
    return resolveRef(model, rawSchema) ?? {}
  }
  if (model.vendor_slug === 'anthropic') {
    return {
      type: 'object',
      required: ['id', 'type', 'role', 'model', 'content'],
      properties: {
        id: { type: 'string', description: 'Unique message identifier.' },
        type: { type: 'string', description: 'Response object type.' },
        role: { type: 'string', description: 'Message role returned by the assistant.' },
        model: { type: 'string', description: 'Model that generated the message.' },
        content: { type: 'array', items: { type: 'object' }, description: 'Assistant content blocks.' },
        stop_reason: { type: 'string', description: 'Reason generation stopped.' },
      },
    }
  }
  return {
    type: 'object',
    required: ['id', 'model', 'choices'],
    properties: {
      id: { type: 'string', description: 'Unique chat completion identifier.' },
      model: { type: 'string', description: 'Model that generated the response.' },
      choices: { type: 'array', items: { type: 'object' }, description: 'Generated completion choices.' },
      usage: { type: 'object', description: 'Token usage when available.' },
    },
  }
}

function responseFields(model) {
  return fieldsFromSchema(responseSchema(model), 'Response field returned by the API.')
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2)
}

function protocolForModel(model) {
  if (isAsyncGenerationModel(model)) return 'generation'
  return model.vendor_slug === 'anthropic' ? 'messages' : 'chat'
}

function exampleValueForField(name, schema = {}) {
  if (schema.default !== undefined) return schema.default
  if (schema.examples?.length) return schema.examples[0]
  if (name === 'prompt') return 'A cinematic product photo of a matte black smart speaker on a marble table, soft studio lighting'
  if (name.includes('audio')) return 'https://static.sandbase.ai/examples/input.mp3'
  if (name.includes('video')) return 'https://static.sandbase.ai/examples/input.mp4'
  if (name.includes('image')) return 'https://static.sandbase.ai/examples/input.png'
  if (['text', 'input'].includes(name)) return 'Hello from SandBase.'
  if (name === 'voice') return 'alloy'
  if (schema.enum?.length) return schema.enum[0]
  if (schema.type === 'integer') return schema.minimum ?? 1
  if (schema.type === 'number') return schema.minimum ?? 1
  if (schema.type === 'boolean') return false
  if (schema.type === 'array') return []
  if (schema.type === 'object') return {}
  return '<string>'
}

function requestBodyForSchema(model) {
  const schema = requestSchema(model)
  const required = new Set(schema.required ?? [])
  const orderedNames = Array.isArray(schema['x-order-properties']) ? schema['x-order-properties'] : Object.keys(schema.properties ?? {})
  const body = { model: model.name }
  for (const name of orderedNames) {
    const fieldSchema = schema.properties?.[name]
    if (!fieldSchema || name === 'model') continue
    if (required.has(name) || ['prompt', 'image', 'image_url', 'video', 'video_url', 'audio', 'audio_url', 'text', 'input', 'voice', 'aspect_ratio', 'duration', 'output_format'].includes(name)) {
      body[name] = exampleValueForField(name, fieldSchema)
    }
    if (Object.keys(body).length >= 6) break
  }
  return body
}

function resolveLocalRef(model, schema, seen = new Set()) {
  if (!schema?.$ref) return schema
  if (!schema.$ref.startsWith('#/components/schemas/')) {
    throw new Error(`${model.name}: unsupported request schema reference ${schema.$ref}`)
  }
  if (seen.has(schema.$ref)) throw new Error(`${model.name}: circular request schema reference ${schema.$ref}`)
  const name = schema.$ref.slice('#/components/schemas/'.length)
  const resolved = model.unified_schema?.components?.schemas?.[name]
  if (!resolved) throw new Error(`${model.name}: unresolved request schema reference ${schema.$ref}`)
  return resolveLocalRef(model, resolved, new Set([...seen, schema.$ref]))
}

function platformRequestSchema(model) {
  const pathSchema = model.unified_schema?.paths?.['/v1/run']?.post?.requestBody?.content?.['application/json']?.schema
  const fallbackSchema = model.unified_schema?.components?.schemas?.GenerationRequest
  const schema = mergeAllOfSchema(model, pathSchema ?? fallbackSchema)
  if (!schema || schema.type !== 'object' || !Array.isArray(schema.required ?? [])) {
    throw new Error(`${model.name}: /v1/run request body or GenerationRequest must be an object schema`)
  }
  return schema
}

function mergeAllOfSchema(model, schema) {
  const resolved = resolveLocalRef(model, schema)
  if (!resolved?.allOf?.length) return resolved
  const merged = { ...resolved, properties: { ...(resolved.properties ?? {}) }, required: [...(resolved.required ?? [])] }
  delete merged.allOf
  for (const part of resolved.allOf) {
    const normalized = mergeAllOfSchema(model, part)
    Object.assign(merged.properties, normalized?.properties ?? {})
    merged.required.push(...(normalized?.required ?? []))
    if (!merged.type && normalized?.type) merged.type = normalized.type
  }
  merged.required = [...new Set(merged.required)]
  return merged
}

function selectSchemaVariant(model, schema) {
  const resolved = resolveLocalRef(model, schema)
  const variants = resolved?.oneOf ?? resolved?.anyOf
  const variant = variants?.find((candidate) => candidate.type !== 'null') ?? variants?.[0]
  return variant ? resolveLocalRef(model, variant) : resolved
}

function placeholderForSchema(model, name, schema, seen = new Set()) {
  const resolved = selectSchemaVariant(model, schema)
  if (!resolved) throw new Error(`${model.name}: missing schema for required field ${name}`)
  if (resolved.default !== undefined) return resolved.default
  if (resolved.example !== undefined) return resolved.example
  if (Array.isArray(resolved.examples) && resolved.examples.length) return resolved.examples[0]
  if (Array.isArray(resolved.enum) && resolved.enum.length) return resolved.enum[0]

  if (resolved.type === 'object' || resolved.properties) {
    if (seen.has(resolved)) throw new Error(`${model.name}: circular required object schema at ${name}`)
    const nextSeen = new Set([...seen, resolved])
    const value = {}
    for (const childName of resolved.required ?? []) {
      const childSchema = resolved.properties?.[childName]
      if (!childSchema) throw new Error(`${model.name}: required field ${name}.${childName} has no schema`)
      value[childName] = placeholderForSchema(model, `${name}.${childName}`, childSchema, nextSeen)
    }
    return value
  }
  if (resolved.type === 'array') {
    if (!resolved.items) throw new Error(`${model.name}: required array ${name} has no item schema`)
    const itemCount = Math.max(1, resolved.minItems ?? 0)
    if (resolved.maxItems !== undefined && itemCount > resolved.maxItems) throw new Error(`${model.name}: invalid array length constraints for ${name}`)
    return Array.from({ length: itemCount }, (_, index) => placeholderForSchema(model, `${name}[${index}]`, resolved.items, seen))
  }
  if (resolved.type === 'integer') return Math.ceil(resolved.minimum ?? 1)
  if (resolved.type === 'number') return resolved.minimum ?? 1
  if (resolved.type === 'boolean') return false
  if (resolved.type === 'null') return null
  if (resolved.type === 'string' || !resolved.type) {
    const pattern = resolved.pattern ? new RegExp(resolved.pattern) : undefined
    const candidates = resolved.format === 'uri' || /(^|_)(url|uri)$/.test(name)
      ? ['https://example.com/resource']
      : [name.replace(/[^A-Za-z0-9_-]/g, '_'), 'example', 'abc123', 'A1_b']
    let value = candidates.find((candidate) => !pattern || pattern.test(candidate))
    if (value === undefined) throw new Error(`${model.name}: cannot construct string matching pattern for ${name}`)
    const minLength = Number.isInteger(resolved.minLength) ? resolved.minLength : 0
    const maxLength = Number.isInteger(resolved.maxLength) ? resolved.maxLength : Number.POSITIVE_INFINITY
    if (minLength > maxLength) throw new Error(`${model.name}: invalid string length constraints for ${name}`)
    if (value.length < minLength) value += 'x'.repeat(minLength - value.length)
    if (value.length > maxLength) value = value.slice(0, maxLength)
    return value
  }
  throw new Error(`${model.name}: cannot construct example for required field ${name}`)
}

function assertExampleMatchesSchema(model, value, schema, location = 'request') {
  const resolved = selectSchemaVariant(model, schema)
  if (!resolved) throw new Error(`${model.name}: missing schema at ${location}`)
  if (resolved.enum && !resolved.enum.some((candidate) => JSON.stringify(candidate) === JSON.stringify(value))) {
    throw new Error(`${model.name}: generated example at ${location} is outside enum`)
  }
  if (resolved.type === 'object' || resolved.properties) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${model.name}: ${location} must be an object`)
    for (const name of resolved.required ?? []) {
      if (!(name in value)) throw new Error(`${model.name}: generated example misses ${location}.${name}`)
    }
    for (const [name, child] of Object.entries(value)) {
      if (resolved.properties?.[name]) assertExampleMatchesSchema(model, child, resolved.properties[name], `${location}.${name}`)
    }
    return
  }
  if (resolved.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`${model.name}: ${location} must be an array`)
    if (resolved.minItems !== undefined && value.length < resolved.minItems) throw new Error(`${model.name}: ${location} has too few items`)
    if (resolved.maxItems !== undefined && value.length > resolved.maxItems) throw new Error(`${model.name}: ${location} has too many items`)
    for (const [index, item] of value.entries()) assertExampleMatchesSchema(model, item, resolved.items, `${location}[${index}]`)
    return
  }
  const typeMatches = resolved.type === 'integer'
    ? Number.isInteger(value)
    : resolved.type === 'number'
      ? typeof value === 'number'
      : resolved.type === 'null'
        ? value === null
        : !resolved.type || typeof value === resolved.type
  if (!typeMatches) throw new Error(`${model.name}: generated example has wrong type at ${location}`)
  if (typeof value === 'string' && resolved.minLength !== undefined && value.length < resolved.minLength) throw new Error(`${model.name}: ${location} is shorter than minLength`)
  if (typeof value === 'string' && resolved.maxLength !== undefined && value.length > resolved.maxLength) throw new Error(`${model.name}: ${location} is longer than maxLength`)
  if (typeof value === 'string' && resolved.pattern !== undefined && !new RegExp(resolved.pattern).test(value)) throw new Error(`${model.name}: ${location} does not match pattern`)
  if (typeof value === 'number' && resolved.minimum !== undefined && value < resolved.minimum) throw new Error(`${model.name}: ${location} is below minimum`)
  if (typeof value === 'number' && resolved.maximum !== undefined && value > resolved.maximum) throw new Error(`${model.name}: ${location} is above maximum`)
}

function platformRequestBody(model) {
  const schema = platformRequestSchema(model)
  const body = { model: model.name }
  for (const name of schema.required ?? []) {
    if (name === 'model') continue
    const fieldSchema = schema.properties[name]
    if (!fieldSchema) throw new Error(`${model.name}: required field ${name} has no schema`)
    body[name] = placeholderForSchema(model, name, fieldSchema)
  }
  if (Object.keys(body).length === 1) {
    const preferredOptionalNames = ['keyword', 'query', 'search', 'prompt', 'url', 'username', 'input']
    const optionalName = preferredOptionalNames.find((name) => schema.properties?.[name])
    if (optionalName) body[optionalName] = placeholderForSchema(model, optionalName, schema.properties[optionalName])
  }
  const validationSchema = {
    ...schema,
    properties: { model: { type: 'string', enum: [model.name] }, ...(schema.properties ?? {}) },
    required: [...new Set(['model', ...(schema.required ?? [])])],
  }
  assertExampleMatchesSchema(model, body, validationSchema)
  return body
}

function platformFields(model) {
  const schema = platformRequestSchema(model)
  return platformFieldsFromSchema(model, schema, 'Request parameter supported by this operation.')
}

function platformFormatType(model, schema = {}) {
  const resolved = resolveLocalRef(model, schema) ?? {}
  const variants = resolved.oneOf ?? resolved.anyOf
  if (variants?.length) return [...new Set(variants.map((variant) => platformFormatType(model, variant)))].join(' | ')
  if (resolved.allOf?.length) return [...new Set(resolved.allOf.map((variant) => platformFormatType(model, variant)))].join(' & ')
  if (resolved.type === 'array') return `array${resolved.items ? `<${platformFormatType(model, resolved.items)}>` : ''}`
  return resolved.type ?? 'object'
}

function platformFormatConstraints(model, schema = {}) {
  const resolved = resolveLocalRef(model, schema) ?? {}
  const limits = []
  if (resolved.minimum !== undefined || resolved.maximum !== undefined) {
    limits.push(`Range: ${resolved.minimum ?? '−∞'} to ${resolved.maximum ?? '∞'}`)
  }
  const variantEnums = (resolved.oneOf ?? resolved.anyOf ?? []).flatMap((variant) => resolveLocalRef(model, variant)?.enum ?? [])
  const allowedValues = resolved.enum?.length ? resolved.enum : variantEnums
  if (allowedValues.length) limits.push(`Allowed values: ${allowedValues.join(', ')}`)
  if (resolved.minLength !== undefined || resolved.maxLength !== undefined) {
    limits.push(`Length: ${resolved.minLength ?? 0} to ${resolved.maxLength ?? 'unlimited'}`)
  }
  if (resolved.minItems !== undefined || resolved.maxItems !== undefined) {
    limits.push(`Items: ${resolved.minItems ?? 0} to ${resolved.maxItems ?? 'unlimited'}`)
  }
  if (resolved.minProperties !== undefined || resolved.maxProperties !== undefined) {
    limits.push(`Properties: ${resolved.minProperties ?? 0} to ${resolved.maxProperties ?? 'unlimited'}`)
  }
  if (resolved.pattern) limits.push(`Pattern: ${resolved.pattern}`)
  if (resolved.format) limits.push(`Format: ${resolved.format}`)
  if (resolved.uniqueItems) limits.push('Items must be unique')
  return limits.join('. ')
}

function formatDefaultValue(value) {
  return typeof value === 'string' && value.length > 0 ? value : JSON.stringify(value)
}

function platformFieldsFromSchema(model, schema = {}, fallbackDescription, prefix = '', seen = new Set()) {
  const properties = schema.properties ?? {}
  const required = new Set(schema.required ?? [])
  const orderedNames = Array.isArray(schema['x-order-properties']) ? schema['x-order-properties'] : []
  return Object.entries(properties)
    .sort(([nameA], [nameB]) => {
      const orderedA = orderedNames.indexOf(nameA)
      const orderedB = orderedNames.indexOf(nameB)
      if (orderedA !== -1 || orderedB !== -1) return (orderedA === -1 ? 999 : orderedA) - (orderedB === -1 ? 999 : orderedB)
      return nameA.localeCompare(nameB)
    })
    .flatMap(([name, fieldSchema]) => {
      const resolved = selectSchemaVariant(model, fieldSchema) ?? {}
      const fieldName = prefix ? `${prefix}.${name}` : name
      const field = {
        name: fieldName,
        type: platformFormatType(model, fieldSchema),
        required: required.has(name),
        description: String(fieldSchema.description ?? fieldDescriptions[name] ?? fallbackDescription).replace(/\s+/g, ' ').trim(),
        default: fieldSchema.default === undefined ? undefined : formatDefaultValue(fieldSchema.default),
        constraints: platformFormatConstraints(model, fieldSchema) || undefined,
      }
      const nestedSchema = resolved.type === 'array' ? selectSchemaVariant(model, resolved.items) : resolved
      if (!nestedSchema?.properties || seen.has(nestedSchema)) return [field]
      const childPrefix = resolved.type === 'array' ? `${fieldName}[]` : fieldName
      return [field, ...platformFieldsFromSchema(model, nestedSchema, fallbackDescription, childPrefix, new Set([...seen, nestedSchema]))]
    })
}

function platformResponseData(model) {
  const schema = model.unified_schema?.components?.schemas?.GenerationResponse
  if (!schema) return {}
  return placeholderForSchema(model, 'completed.data', schema)
}

function publicPlatformResponseBody(model, status) {
  const response = { id: 'run_abc123', status, model: model.name }
  if (status === 'completed') return { ...response, outputs: [{ data: platformResponseData(model) }] }
  if (status === 'failed' || status === 'timeout') {
    return { ...response, error: { type: 'upstream_error', message: 'upstream request failed' } }
  }
  if (status === 'pending' || status === 'running') return response
  throw new Error(`${model.name}: unsupported public response status ${status}`)
}

function publicPlatformResponseFields() {
  return [
    { name: 'id', type: 'string', required: true, description: 'SandBase run identifier. Provider task identifiers are never exposed.' },
    { name: 'status', type: 'string', required: true, description: 'Current public run status.', constraints: 'Allowed values: pending, running, completed, failed, timeout' },
    { name: 'model', type: 'string', required: true, description: 'Public SandBase model name used for this run.' },
    { name: 'outputs', type: 'array<object>', required: false, description: 'Present only for completed runs. Contains exactly one item whose only field is data.' },
    { name: 'outputs[0].data', type: 'object | array', required: false, description: 'Operation-specific business payload. This reference uses an empty object when no safe example can be confirmed.' },
    { name: 'error', type: 'object', required: false, description: 'Present only for failed or timeout runs. Contains a public error type and sanitized message.' },
  ]
}

function validatePlatformModel(model) {
  for (const field of ['name', 'vendor', 'vendor_slug', 'model_slug', 'display_name']) {
    if (typeof model[field] !== 'string' || !model[field].trim()) throw new Error(`${model.__file}: missing ${field}`)
  }
  if (model.name !== `${model.vendor_slug}/${model.model_slug}`) {
    throw new Error(`${model.__file}: name must equal vendor_slug/model_slug (${model.name})`)
  }
  if (model.model_slug.startsWith('/') || model.model_slug.endsWith('/') || model.model_slug.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`${model.name}: invalid model_slug path`)
  }
  if (!Array.isArray(model.capability_tags)) throw new Error(`${model.name}: capability_tags must be an array`)
  if (!['sync', 'async'].includes(model.execution_mode)) throw new Error(`${model.name}: execution_mode must be sync or async`)
  platformRequestBody(model)
}

function assertUniquePlatformModels(models, category) {
  const links = new Set()
  const names = new Set()
  for (const model of models) {
    validatePlatformModel(model)
    const link = docsLink(model, category)
    if (names.has(model.name)) throw new Error(`Duplicate Platform API model name: ${model.name}`)
    if (links.has(link)) throw new Error(`Duplicate Platform API URL/sidebar link: ${link}`)
    names.add(model.name)
    links.add(link)
  }
}

function platformReference(model) {
  const requestBody = platformRequestBody(model)
  const isAsync = model.execution_mode === 'async'
  const responseBody = publicPlatformResponseBody(model, isAsync ? 'pending' : 'completed')
  const responseExamples = ['pending', 'running', 'completed', 'failed', 'timeout']
    .map((status) => ({ title: `${status} response`, description: JSON.stringify(publicPlatformResponseBody(model, status)) }))
  const submitLines = [
    'curl -X POST https://api.sandbase.ai/v1/run \\',
    '  -H "Authorization: Bearer $SANDBASE_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    `  -d '${prettyJson(requestBody)}'`,
  ]
  const pythonLines = [
    'import os',
    ...(isAsync ? ['import time'] : []),
    'import requests',
    '',
    'headers = {"Authorization": f"Bearer {os.environ[\'SANDBASE_API_KEY\']}"}',
    `payload = ${pythonLiteral(requestBody)}`,
    'response = requests.post("https://api.sandbase.ai/v1/run", headers=headers, json=payload)',
    'response.raise_for_status()',
    'result = response.json()',
    ...(isAsync ? [
      'while result["status"] in ("pending", "running"):',
      '    time.sleep(1)',
      '    poll = requests.get(f"https://api.sandbase.ai/v1/run/{result[\'id\']}", headers=headers)',
      '    poll.raise_for_status()',
      '    result = poll.json()',
      'if result["status"] in ("failed", "timeout"):',
      '    raise RuntimeError(result.get("error", {}).get("message", f"run ended with {result[\'status\']}"))',
    ] : []),
    'print(result)',
  ]
  const typeScriptLines = [
    `const payload = ${prettyJson(requestBody)};`,
    'const headers = { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`, "Content-Type": "application/json" };',
    'const response = await fetch("https://api.sandbase.ai/v1/run", { method: "POST", headers, body: JSON.stringify(payload) });',
    'if (!response.ok) throw new Error(await response.text());',
    'let result = await response.json();',
    ...(isAsync ? [
      'while (["pending", "running"].includes(result.status)) {',
      '  await new Promise((resolve) => setTimeout(resolve, 1000));',
      '  const poll = await fetch(`https://api.sandbase.ai/v1/run/${result.id}`, { headers });',
      '  if (!poll.ok) throw new Error(await poll.text());',
      '  result = await poll.json();',
      '}',
      'if (["failed", "timeout"].includes(result.status)) {',
      '  throw new Error(result.error?.message ?? `run ended with ${result.status}`);',
      '}',
    ] : []),
    'console.log(result);',
  ]

  return {
    title: cleanTitle(model),
    operation: `${model.vendor} API Operation`,
    method: 'POST',
    path: '/v1/run',
    description: cleanDescription(model),
    groups: [
      {
        title: 'Request body',
        description: `Call this ${model.execution_mode} operation with its public SandBase model identifier and operation-specific input fields.`,
        fields: [{ name: 'model', type: 'string', required: true, description: `Model identifier. Set to ${model.name}.`, default: model.name }, ...platformFields(model)],
      },
      {
        title: 'Response Schema',
        description: isAsync
          ? 'The 202 submit response is pending or running and contains only id, status, and model. Poll GET /v1/run/{id} for the same public status envelope.'
          : 'A synchronous completed response contains exactly one outputs item with only data. Failed and timeout responses contain error and never outputs.',
        fields: publicPlatformResponseFields(),
      },
      {
        title: 'Model capabilities',
        fields: [
          { name: 'capability_tags', type: 'array<string>', required: true, description: 'Capabilities declared by the model registry.', default: model.capability_tags.join(', ') },
          { name: 'execution_mode', type: 'string', required: true, description: 'Execution mode declared by the model registry.', default: model.execution_mode },
        ],
      },
    ],
    examples: [
      { label: 'cURL', language: 'bash', code: [...submitLines, ...(isAsync ? ['', '# Poll a non-terminal task by its public run id', 'curl https://api.sandbase.ai/v1/run/run_abc123 \\', '  -H "Authorization: Bearer $SANDBASE_API_KEY"'] : [])].join('\n') },
      { label: 'Python', language: 'python', code: pythonLines.join('\n') },
      { label: 'TypeScript', language: 'typescript', code: typeScriptLines.join('\n') },
    ],
    notes: responseExamples,
    response: { status: isAsync ? '202 Accepted' : '200 OK', code: prettyJson(responseBody) },
  }
}

function pythonLiteral(value, indent = 0) {
  if (value === null) return 'None'
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number') return String(value)
  const padding = ' '.repeat(indent)
  const childPadding = ' '.repeat(indent + 4)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value.map((entry) => `${childPadding}${pythonLiteral(entry, indent + 4)}`).join(',\n')}\n${padding}]`
  }
  const entries = Object.entries(value)
  if (!entries.length) return '{}'
  return `{\n${entries.map(([key, entry]) => `${childPadding}${JSON.stringify(key)}: ${pythonLiteral(entry, indent + 4)}`).join(',\n')}\n${padding}}`
}

function modelReference(model) {
  if (model.__category === 'api') return platformReference(model)
  const modelProtocol = protocolForModel(model)
  const isMessages = modelProtocol === 'messages'
  const isGeneration = modelProtocol === 'generation'
  const apiPath = isGeneration ? submitPathFor(model) : isMessages ? '/v1/messages' : '/v1/chat/completions'
  const resultPath = isGeneration ? pollPathFor(model) : ''
  const requestBody = isGeneration
    ? requestBodyForSchema(model)
    : isMessages
      ? {
          model: model.name,
          max_tokens: 1024,
          messages: [{ role: 'user', content: 'Describe this product in one sentence.' }],
        }
      : {
          model: model.name,
          messages: [{ role: 'user', content: 'Describe this product in one sentence.' }],
        }
  const responseBody = isGeneration
    ? { id: 'run_abc123', model: model.name, status: 'running', outputs: [] }
    : isMessages
      ? {
          id: 'msg_abc123',
          type: 'message',
          role: 'assistant',
          model: model.name,
          content: [{ type: 'text', text: 'A concise product description.' }],
          stop_reason: 'end_turn',
        }
      : {
          id: 'chatcmpl_abc123',
          model: model.name,
          choices: [{ message: { role: 'assistant', content: 'A concise product description.' } }],
        }

  return {
    title: cleanTitle(model),
    operation: isGeneration ? `${model.__category === 'video' ? 'Video' : model.__category === 'audio' ? 'Audio' : 'Image'} Generation` : isMessages ? 'Anthropic Messages' : 'Chat Completions',
    method: 'POST',
    path: apiPath,
    description: cleanDescription(model),
    groups: [
      {
        title: 'Request body',
        description: isGeneration
          ? 'Submit an async generation request. The model field selects the model; other fields are model-specific input parameters.'
          : 'Parameters supported by this model. Values, defaults, and limits are read from the model registry.',
        fields: [
          {
            name: 'model',
            type: 'string',
            required: true,
            description: `Model identifier. Set to ${model.name}.`,
            default: model.name,
          },
          ...schemaFields(model),
        ],
      },
      {
        title: 'Response Schema',
        description: isGeneration
          ? 'The submit endpoint returns an accepted generation task. Poll the result endpoint with the returned id for terminal outputs or errors.'
          : 'Fields returned by this model API response.',
        fields: responseFields(model),
      },
      {
        title: 'Model capabilities',
        fields: [
          {
            name: 'capability_tags',
            type: 'array<string>',
            required: true,
            description: 'Capabilities declared by the model registry.',
            default: model.capability_tags.join(', '),
          },
          ...(model.context_length ? [{
            name: 'context_length',
            type: 'integer',
            required: true,
            description: 'Maximum context window accepted by this model.',
            default: `${model.context_length} tokens`,
          }] : []),
          ...(model.execution_mode ? [{
            name: 'execution_mode',
            type: 'string',
            required: true,
            description: 'Execution mode declared by the model registry.',
            default: model.execution_mode,
          }] : []),
        ],
      },
    ],
    examples: [
      {
        label: 'cURL',
        language: 'bash',
        code: isGeneration ? [
          '# 1. Submit a generation request',
          `curl -X POST https://api.sandbase.ai${apiPath} \\`,
          '  -H "Authorization: Bearer $SANDBASE_API_KEY" \\',
          '  -H "Content-Type: application/json" \\',
          `  -d '${prettyJson(requestBody)}'`,
          '',
          '# 2. If the response is still running, poll the returned id',
          `curl https://api.sandbase.ai${pathWithExampleId(resultPath)} \\`,
          '  -H "Authorization: Bearer $SANDBASE_API_KEY"',
        ].join('\n') : [
          `curl -X POST https://api.sandbase.ai${apiPath} \\`,
          '  -H "Authorization: Bearer $SANDBASE_API_KEY" \\',
          '  -H "Content-Type: application/json" \\',
          `  -d '${prettyJson(requestBody)}'`,
        ].join('\n'),
      },
      ...(isGeneration ? [
        {
          label: 'Python',
          language: 'python',
          code: [
            'import os',
            'import time',
            'import requests',
            '',
            'api_url = "https://api.sandbase.ai"',
            'headers = {',
            '    "Authorization": f"Bearer {os.environ[\'SANDBASE_API_KEY\']}",',
            '    "Content-Type": "application/json",',
            '}',
            `payload = ${prettyJson(requestBody)}`.replace(/true|false|null/g, (value) => ({ true: 'True', false: 'False', null: 'None' }[value] ?? value)),
            '',
            `response = requests.post(f"{api_url}${apiPath}", headers=headers, json=payload)`,
            'response.raise_for_status()',
            'result = response.json()',
            '',
            'while result["status"] in ("pending", "running"):',
            '    time.sleep(2)',
            `    result = requests.get(f"{api_url}${resultPath.replace('{id}', '')}" + result["id"], headers=headers).json()`,
            '',
            'print(result)',
          ].join('\n'),
        },
        {
          label: 'TypeScript',
          language: 'typescript',
          code: [
            'const apiUrl = "https://api.sandbase.ai";',
            'const headers = {',
            '  Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,',
            '  "Content-Type": "application/json",',
            '};',
            '',
            `const payload = ${prettyJson(requestBody)};`,
            '',
            `const submit = await fetch(apiUrl + "${apiPath}", {`,
            '  method: "POST",',
            '  headers,',
            '  body: JSON.stringify(payload),',
            '});',
            'if (!submit.ok) throw new Error(await submit.text());',
            'let result = await submit.json();',
            '',
            'while (["pending", "running"].includes(result.status)) {',
            '  await new Promise((resolve) => setTimeout(resolve, 2000));',
            `  const poll = await fetch(apiUrl + "${resultPath.replace('{id}', '')}" + result.id, { headers });`,
            '  if (!poll.ok) throw new Error(await poll.text());',
            '  result = await poll.json();',
            '}',
            '',
            'console.log(result);',
          ].join('\n'),
        },
      ] : []),
    ],
    response: {
      status: isGeneration ? '202 Accepted' : '200 OK',
      code: prettyJson(responseBody),
    },
  }
}

const categories = [
  {
    key: 'llm',
    title: 'LLM Models',
    slug: 'llm-models',
    description: 'Use language and reasoning models for chat, tool calling, structured output, vision, and long-context tasks.',
    registryRoot: llmRegistryRoot,
    filter: (model) => model.type === 'llm',
    vendorPriority: llmVendorPriority,
  },
  {
    key: 'image',
    title: 'Image Generation',
    slug: 'image-generation',
    description: 'Generate, edit, transform, upscale, or train image models through SandBase with the exact request schema for each provider.',
    registryRoot: multimodalRegistryRoot,
    filter: (model) => model.type === 'image',
    vendorPriority: imageVendorPriority,
  },
  {
    key: 'video',
    title: 'Video Generation',
    slug: 'video-generation',
    description: 'Generate, edit, animate, upscale, and transform videos through SandBase with async model APIs.',
    registryRoot: multimodalRegistryRoot,
    filter: (model) => model.type === 'video',
    vendorPriority: videoVendorPriority,
  },
  {
    key: 'audio',
    title: 'Audio Generation',
    slug: 'audio-generation',
    description: 'Generate, transform, clone, transcribe, and synthesize audio through SandBase with exact request schemas.',
    registryRoot: multimodalRegistryRoot,
    filter: (model) => model.type === 'audio',
    vendorPriority: audioVendorPriority,
  },
  {
    key: 'api',
    title: 'APIs',
    slug: 'platform-apis',
    description: 'Call data, automation, search, and platform operations through SandBase with each operation\'s exact public request schema.',
    registryRoot: apiRegistryRoot,
    filter: (model) => model.type === 'api',
    vendorPriority: platformVendorPriority,
  },
]

const categoryData = categories.map((category) => {
  const models = loadModels(category.registryRoot, category.filter, category)
  .sort((a, b) => {
    const categoryVendorSort = vendorSortWithPriority(category.vendorPriority)
    return categoryVendorSort(
      { slug: a.vendor_slug, vendor: a.vendor },
      { slug: b.vendor_slug, vendor: b.vendor },
    ) || modelSort(a, b)
  })

  if (category.key === 'api') {
    assertUniquePlatformModels(models, category)
  }

  const groups = new Map()
  for (const model of models) {
    if (!groups.has(model.vendor_slug)) {
      groups.set(model.vendor_slug, {
        slug: model.vendor_slug,
        vendor: model.vendor,
        models: [],
      })
    }
    groups.get(model.vendor_slug).models.push(model)
  }

  const sortedGroups = [...groups.values()].sort(vendorSortWithPriority(category.vendorPriority))
  for (const group of sortedGroups) group.models.sort(modelSort)

  return {
    ...category,
    models,
    sortedGroups,
  }
})

const llmData = categoryData.find((category) => category.key === 'llm')
const imageData = categoryData.find((category) => category.key === 'image')
const videoData = categoryData.find((category) => category.key === 'video')
const audioData = categoryData.find((category) => category.key === 'audio')
const platformData = categoryData.find((category) => category.key === 'api')
const models = categoryData.flatMap((category) => category.models)

fs.mkdirSync(llmPagesRoot, { recursive: true })
fs.mkdirSync(imagePagesRoot, { recursive: true })
fs.mkdirSync(platformPagesRoot, { recursive: true })

function cleanManagedPlatformPages(expectedPaths, pagesRoot = platformPagesRoot) {
  let removed = 0
  if (!fs.existsSync(pagesRoot)) return removed
  const markdownFiles = []
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) visit(fullPath)
      else if (entry.name.endsWith('.md')) markdownFiles.push(fullPath)
    }
  }
  visit(pagesRoot)
  for (const file of markdownFiles) {
    if (expectedPaths.has(path.resolve(file))) continue
    const content = fs.readFileSync(file, 'utf8')
    if (!content.includes(platformGeneratedMarker)) {
      throw new Error(`Refusing to delete unknown Platform APIs file: ${path.relative(docsRoot, file)}`)
    }
    fs.unlinkSync(file)
    removed += 1
  }
  const removeEmptyDirectories = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) removeEmptyDirectories(path.join(dir, entry.name))
    }
    if (dir !== pagesRoot && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
  }
  removeEmptyDirectories(pagesRoot)
  return removed
}

function cleanLegacyPlatformOverview(file = legacyPlatformOverviewPath) {
  if (!fs.existsSync(file)) return 0
  const content = fs.readFileSync(file, 'utf8')
  const isManagedLegacyOverview = content.includes(platformGeneratedMarker) || (
    content.startsWith('---\ntitle: Platform APIs\n')
    && content.includes('\n# Platform APIs\n')
    && content.includes('SandBase currently publishes API reference pages for ')
    && content.includes('Platform operations use `POST /v1/run`')
  )
  if (!isManagedLegacyOverview) {
    throw new Error(`Refusing to delete unknown legacy Platform APIs overview: ${path.relative(docsRoot, file)}`)
  }
  fs.unlinkSync(file)
  return 1
}

const expectedPlatformPages = new Set([
  path.resolve(platformOverviewPath),
  ...platformData.models.map((model) => path.resolve(platformPagesRoot, `${slugPath(model)}.md`)),
])
const removedPlatformPages = cleanLegacyPlatformOverview() + cleanManagedPlatformPages(expectedPlatformPages)

for (const category of categoryData) {
for (const model of category.models) {
  const pagesRoot = path.join(modelApiRoot, category.slug)
  const pageDir = path.join(pagesRoot, model.vendor_slug)
  fs.mkdirSync(pageDir, { recursive: true })
  const pagePath = path.join(pagesRoot, `${slugPath(model)}.md`)
  fs.mkdirSync(path.dirname(pagePath), { recursive: true })
  const protocol = category.key === 'api'
    ? 'API Reference'
    : ['image', 'video', 'audio'].includes(category.key)
      ? `${category.title} Reference`
      : model.vendor_slug === 'anthropic' ? 'Messages API' : 'Chat Completions API'
  const endpoint = endpointFor(model, category)
  fs.writeFileSync(
    pagePath,
    [
      '---',
      `title: ${yamlString(`${cleanTitle(model)} API Reference`)}`,
      `description: ${yamlString(seoDescription(model, protocol, category))}`,
      'aside: false',
      'outline: false',
      ...(category.key === 'api' ? [platformGeneratedMarker] : []),
      `apiReferenceKey: ${yamlString(`${category.key}/${model.name}`)}`,
      `apiReferenceJson: ${yamlString(JSON.stringify(modelReference(model)))}`,
      'seo:',
      `  modelName: ${yamlString(cleanTitle(model))}`,
      `  modelId: ${yamlString(model.name)}`,
      `  vendor: ${yamlString(model.vendor)}`,
      `  vendorSlug: ${yamlString(model.vendor_slug)}`,
      `  modelSlug: ${yamlString(model.model_slug)}`,
      `  protocol: ${yamlString(protocol)}`,
      `  endpoint: ${yamlString(endpoint)}`,
      `  publishedAt: ${yamlString(model.published_at ?? '')}`,
      `  capabilities: ${JSON.stringify(model.capability_tags ?? [])}`,
      `  category: ${yamlString(category.title)}`,
      '---',
      '',
      '<ApiReferencePage />',
      '',
    ].join('\n'),
  )
}
}

function writeCategoryOverview(category) {
  if (category.key === 'api') {
    fs.writeFileSync(
      platformOverviewPath,
      [
        '---',
        'title: APIs',
        `description: Browse ${category.models.length} SandBase API operations across ${category.sortedGroups.length} platforms.`,
        'aside: false',
        'outline: false',
        platformGeneratedMarker,
        '---',
        '',
        '<PlatformApiLanding />',
        '',
      ].join('\n'),
    )
    return
  }
  const totalCapabilities = [...new Set(category.models.flatMap((model) => model.capability_tags ?? []))].sort()
  const categoryApiLabel = category.key === 'api' ? category.title : category.title.endsWith('API') ? category.title : `${category.title} APIs`
  const categoryModelLabel = category.key === 'api' ? 'operations' : category.title.endsWith('API') ? `${category.title} entries` : `${category.title.toLowerCase()} models`
  const protocolNote = category.key === 'api'
    ? 'Platform operations use `POST /v1/run` with the model name shown on each page. Synchronous operations return their result directly; asynchronous operations return a run id that can be queried with `GET /v1/run/{id}`.'
    : ['image', 'video', 'audio'].includes(category.key)
    ? `${category.title} models use the async SandBase generation protocol declared in each model registry file. Submit a request, receive a task id, then poll the result endpoint until the generation is completed, failed, or timed out.`
    : 'Claude / Anthropic models use the SandBase-compatible `/v1/messages` protocol. Other LLM models use `/v1/chat/completions` unless a model-specific protocol is added later.'
  const providerSections = category.sortedGroups.length
    ? category.sortedGroups.flatMap((group) => [
        `### ${group.vendor}${category.key === 'api' ? ` {#${group.slug}}` : ''}`,
        '',
        ...group.models.slice(0, 12).map((model) => `- [${cleanTitle(model)}](${docsLink(model, category)}) — ${markdownText(cleanDescription(model))}`),
        ...(group.models.length > 12 ? [`- …and ${group.models.length - 12} more models in the sidebar.`] : []),
        '',
      ])
    : [
        'No published model APIs in this category yet.',
        '',
        'This page is reserved so the public docs URL is ready once the registry publishes matching model definitions.',
        '',
      ]

  fs.writeFileSync(
    category.key === 'api' ? platformOverviewPath : path.join(modelApiRoot, `${category.slug}.md`),
    [
      '---',
      `title: ${category.title}`,
      `description: Browse SandBase ${categoryApiLabel} by ${category.key === 'api' ? 'platform' : 'provider'} and open a model page for its exact request format.`,
      ...(category.key === 'api' ? [platformGeneratedMarker] : []),
      '---',
      '',
      `# ${category.title}`,
      '',
      `SandBase currently publishes API reference pages for ${category.models.length} enabled ${categoryModelLabel} across ${category.sortedGroups.length} ${category.key === 'api' ? 'platforms' : 'providers'}. Choose a ${category.key === 'api' ? 'platform' : 'provider'} in the left navigation, then open a model page for its exact API identifier, supported capabilities, and a working request.`,
      '',
      protocolNote,
      '',
      `## ${category.key === 'api' ? 'Platforms' : 'Providers'}`,
      '',
      ...providerSections,
      '## Capability coverage',
      '',
      totalCapabilities.length ? totalCapabilities.map((capability) => `\`${capability}\``).join(', ') : 'No capability tags published yet.',
      '',
    ].join('\n'),
  )
}

writeCategoryOverview(llmData)
writeCategoryOverview(imageData)
writeCategoryOverview(videoData)
writeCategoryOverview(audioData)
writeCategoryOverview(platformData)

const sidebarItems = [
  `{ text: 'Overview', link: '/model-api-reference/' }`,
  ...categoryData.filter((category) => category.key !== 'api').map((category) => [
    '{',
    `  text: ${tsString(category.title)},`,
    '  collapsed: true,',
    '  items: [',
    `    { text: 'Overview', link: ${tsString(`/model-api-reference/${category.slug}`)} },`,
    ...category.sortedGroups.map((group) => [
      '    {',
      `      text: ${tsString(group.vendor)},`,
      '      collapsed: true,',
      '      items: [',
      ...group.models.map((model) => `        ${sidebarItem(model, category)},`),
      '      ],',
      '    },',
      ].join('\n')),
    '  ],',
    '}',
  ].join('\n')),
]

const platformFallbackSidebarItems = [
  `{ text: 'Overview', link: '/model-api-reference/' }`,
  ...categoryData.filter((category) => category.key !== 'api')
    .map((category) => `{ text: ${tsString(category.title)}, link: ${tsString(`/model-api-reference/${category.slug}`)} }`),
]

fs.mkdirSync(platformSidebarDataRoot, { recursive: true })
const expectedPlatformSidebarData = new Set()
for (const group of platformData.sortedGroups) {
  const dataFile = path.join(platformSidebarDataRoot, `${group.slug}.ts`)
  expectedPlatformSidebarData.add(path.resolve(dataFile))
  fs.writeFileSync(dataFile, [
    '// Generated by scripts/generate-llm-model-api-reference.mjs. Do not edit by hand.',
    `export default ${JSON.stringify({
      platform: group.vendor,
      slug: group.slug,
      operationCount: group.models.length,
      groups: platformSidebarGroups(group),
    }, null, 2)} as const`,
    '',
  ].join('\n'))
}
for (const entry of fs.readdirSync(platformSidebarDataRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.ts')) continue
  const file = path.join(platformSidebarDataRoot, entry.name)
  if (expectedPlatformSidebarData.has(path.resolve(file))) continue
  const content = fs.readFileSync(file, 'utf8')
  if (!content.startsWith('// Generated by scripts/generate-llm-model-api-reference.mjs.')) {
    throw new Error(`Refusing to delete unknown Platform API sidebar data: ${path.relative(docsRoot, file)}`)
  }
  fs.unlinkSync(file)
}

fs.writeFileSync(
  sidebarFile,
  [
    'import type { DefaultTheme } from \'vitepress\'',
    '',
    '// Generated by scripts/generate-llm-model-api-reference.mjs. Do not edit by hand.',
    `export const platformApiReferencePlatforms = ${JSON.stringify(platformData.sortedGroups.map((group) => ({
      text: group.vendor,
      slug: group.slug,
      operationCount: group.models.length,
    })), null, 2)} as const`,
    '',
    'export const modelApiReferenceSidebarItems: DefaultTheme.SidebarItem[] = [',
    ...sidebarItems.map((item) => item.split('\n').map((line) => `  ${line}`).join('\n') + ','),
    ']',
    '',
    'export const platformApiReferenceFallbackSidebarItems: DefaultTheme.SidebarItem[] = [',
    ...platformFallbackSidebarItems.map((item) => item.split('\n').map((line) => `  ${line}`).join('\n') + ','),
    ']',
    '',
  ].join('\n'),
)

fs.writeFileSync(
  specsFile,
  [
    "// Generated by scripts/generate-llm-model-api-reference.mjs. Do not edit by hand.",
    "// Model API Reference pages carry their own apiReferenceJson frontmatter,",
    "// so this compatibility export intentionally stays empty.",
    "export const modelApiReferenceSpecs: Record<string, unknown> = {}",
    "",
  ].join('\n'),
)

console.log(
  categoryData
    .map((category) => `Generated ${category.models.length} enabled ${category.title} pages across ${category.sortedGroups.length} providers.`)
    .join('\n'),
)
const platformInputModels = walk(apiRegistryRoot).map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
const platformDisabledCount = platformInputModels.filter((model) => model.enabled === false).length
const platformNonApiCount = platformInputModels.filter((model) => model.type !== 'api').length
console.log(`Platform APIs skipped ${platformInputModels.length - platformData.models.length} entries (disabled: ${platformDisabledCount}, non-api: ${platformNonApiCount}); removed ${removedPlatformPages} managed orphan pages.`)

export {
  assertExampleMatchesSchema,
  assertUniquePlatformModels,
  cleanLegacyPlatformOverview,
  cleanManagedPlatformPages,
  classifyPlatformModel,
  loadModels,
  modelSort,
  normalizePlatformClassifierText,
  platformGeneratedMarker,
  platformFields,
  platformReference,
  publicPlatformResponseBody,
  pythonLiteral,
  platformRequestBody,
  platformRequestSchema,
  platformProfiles,
  platformSidebarGroups,
  sharedPlatformDomains,
  validatePlatformModel,
  validatePlatformProfiles,
  vendorSortWithPriority,
}
