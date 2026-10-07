import { maskApprovedSandboxPageHrefs, sandboxAPIPath } from './public-sandbox-page-links.mjs'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const openapi = readFileSync(new URL('../public/openapi.yaml', import.meta.url), 'utf8')
const openapiDocument = parse(openapi)
const config = readFileSync(new URL('../.vitepress/config.ts', import.meta.url), 'utf8')
const sidebar = readFileSync(new URL('../.vitepress/sidebar.ts', import.meta.url), 'utf8')
const modelSidebar = sidebar.slice(0, sidebar.indexOf('export const docsSidebar'))
const generatedModelSidebar = readFileSync(new URL('../.vitepress/modelApiReferenceSidebar.generated.ts', import.meta.url), 'utf8')
const platformSidebar = sidebar.slice(sidebar.indexOf('export const apiReferenceSidebar'))
const generatedReferenceSpecs = readFileSync(new URL('../.vitepress/theme/generatedApiReferenceSpecs.ts', import.meta.url), 'utf8')
const apiKeyGuide = readFileSync(new URL('../getting-started/api-keys.md', import.meta.url), 'utf8')
const authenticationReference = readFileSync(new URL('../api-reference/authentication.md', import.meta.url), 'utf8')
const supportedModelsPage = readFileSync(new URL('../models/supported.md', import.meta.url), 'utf8')
const capabilitiesPage = readFileSync(new URL('../models/capabilities.md', import.meta.url), 'utf8')
const visionPage = readFileSync(new URL('../models/vision.md', import.meta.url), 'utf8')
const modelApiOverview = readFileSync(new URL('../model-api-reference/index.md', import.meta.url), 'utf8')
const homePage = readFileSync(new URL('../.vitepress/theme/HomePage.vue', import.meta.url), 'utf8')
const officialNativeSidebar = readFileSync(new URL('../.vitepress/theme/OfficialNativeApiSidebar.vue', import.meta.url), 'utf8')
const legacySeedanceReference = readFileSync(new URL('../api-reference/volcengine-contents-generations.md', import.meta.url), 'utf8')
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
const catalogOverviews = [
  readFileSync(new URL('../model-api-reference/llm-models.md', import.meta.url), 'utf8'),
  readFileSync(new URL('../model-api-reference/image-generation.md', import.meta.url), 'utf8'),
  readFileSync(new URL('../model-api-reference/video-generation.md', import.meta.url), 'utf8'),
  readFileSync(new URL('../model-api-reference/audio-generation.md', import.meta.url), 'utf8'),
  readFileSync(new URL('../model-api-reference/platform-apis/index.md', import.meta.url), 'utf8'),
]
const root = fileURLToPath(new URL('..', import.meta.url))

const declaredOpenApiTags = new Set((openapiDocument.tags ?? []).map((tag) => tag.name))
const usedOpenApiTags = new Set(
  Object.values(openapiDocument.paths).flatMap((pathItem) =>
    ['get', 'post', 'put', 'patch', 'delete'].flatMap((method) => pathItem[method]?.tags ?? []),
  ),
)
assert.deepEqual(
  [...usedOpenApiTags].filter((tag) => !declaredOpenApiTags.has(tag)),
  [],
  'Every operation tag must be declared at the top level of the public OpenAPI document',
)
assert.deepEqual(
  [...declaredOpenApiTags].filter((tag) => !usedOpenApiTags.has(tag)),
  [],
  'The public OpenAPI document must not declare empty navigation groups',
)

assert.match(supportedModelsPage, /https:\/\/www\.sandbase\.ai\/models/, 'Supported Models must point to the live catalog')
assert.match(supportedModelsPage, /GET \/v1\/models/, 'Supported Models must identify the runtime catalog API')
for (const category of ['llm-models', 'image-generation', 'video-generation', 'audio-generation']) {
  assert.match(supportedModelsPage, new RegExp(`/model-api-reference/${category}`), `Supported Models must link the generated ${category} reference`)
}
assert.doesNotMatch(supportedModelsPage, /^\| `[^`]+` \|/m, 'Supported Models must not maintain a hand-written model snapshot')
assert.doesNotMatch(supportedModelsPage, /Model Comparison Table|Typical Cost per 1K requests/, 'Supported Models must not publish static comparison pricing')
for (const [label, content] of [['Capabilities', capabilitiesPage], ['Vision', visionPage]]) {
  assert.match(content, /GET \/v1\/models/, `${label} must point integrations to live model discovery`)
  assert.doesNotMatch(content, /^\| `[^`]+` \|/m, `${label} must not maintain a hand-written model snapshot`)
  assert.doesNotMatch(content, /gpt-4o|gemini-2\.5|deepseek-v3/i, `${label} must not publish stale model recommendations`)
}
assert.match(legacySeedanceReference, /^canonical:\s*\/docs\/model-api-reference\/official-native-api\/$/m, 'Legacy Seedance reference must canonicalize to Official Native API')
assert.match(legacySeedanceReference, /^robots:\s*noindex,follow$/m, 'Legacy Seedance reference must not compete in search results')
assert.doesNotMatch(readme, /deepseek\/deepseek-v3\b/i, 'README must not recommend the retired DeepSeek V3 model')
assert.doesNotMatch(readme, /API Reference[^\n]*webhooks/i, 'README must not advertise the hidden Webhooks page')
assert.doesNotMatch(readme, /\b\d[\d,]*\+?\s+models and APIs\b/i, 'README must not hard-code time-sensitive catalog counts')
for (const overview of catalogOverviews) {
  assert.doesNotMatch(overview, /currently publishes API reference pages for \d/i, 'Catalog overviews must not hard-code time-sensitive counts')
  assert.doesNotMatch(overview, /Browse \d[\d,]* SandBase API operations across \d+ platforms/i, 'Catalog overviews must not hard-code platform operation counts')
}
assert.doesNotMatch(modelSidebar, /text: 'Models'[\s\S]*?List Models[\s\S]*?Get Model/, 'Model API navigation must not duplicate the Models API module')
assert.doesNotMatch(modelSidebar, /text: 'Inference APIs'/, 'Model API navigation must not duplicate the normalized Inference API module')
for (const modelPath of [
  'video-generation/bytedance/seedance/2.0/mini/text-to-video',
  'video-generation/bytedance/seedance/2.0/mini/image-to-video',
  'video-generation/bytedance/seedance/2.0/mini/reference-to-video',
]) {
  assert.match(generatedModelSidebar, new RegExp(`/model-api-reference/${modelPath.replaceAll('/', '\\/')}`), `Model API navigation must expose current model ${modelPath}`)
}
assert.match(modelApiOverview, /\[Models API\]\(\/api-reference\/models\//, 'Model API overview must link to the Models API contract')
assert.match(modelApiOverview, /\[Chat Completions\]\(\/api-reference\/llm-gateway\)/, 'Model API overview must link to the normalized inference contracts')
assert.match(homePage, /Services API/, 'Home page must use the Services product name')
assert.doesNotMatch(homePage, /Endpoint API|Published Agent API/, 'Home page must not expose retired Endpoint product labels')
assert.doesNotMatch(homePage, />Published Agents</, 'Home page must use the current Services product label')
assert.match(homePage, /href="\/docs\/getting-started\/api-keys"/, 'Home page must link to the published API key guide')
assert.doesNotMatch(homePage, /href="\/docs\/admin\/api-keys"/, 'Home page must not link to the hidden legacy API key page')
assert.match(homePage, /href="\/docs\/guides\/chat-completions"/, 'Home page must link to the published SDK-compatible chat guide')
assert.doesNotMatch(homePage, /href="\/docs\/sdks\/?"/, 'Home page must not link to the retired SDK landing page')

const forbiddenOpenApiPatterns = [
  [/^  \/sandboxes(?:[/{:]|$)/m, 'sandbox path'],
  [/^  \/[^:\n]*sandbox[^:\n]*:$/im, 'any sandbox path'],
  [/^  - name: Sandboxes$/m, 'Sandboxes tag'],
  [/^    [A-Za-z0-9]*Sandbox[A-Za-z0-9]*:$/m, 'any Sandbox component schema'],
  [/^    SandboxId:$/m, 'SandboxId parameter'],
  [/^    CreateSandboxRequest:$/m, 'CreateSandboxRequest schema'],
  [/^    Sandbox:$/m, 'Sandbox schema'],
  [/resourceType[^\n]*enum[^\n]*sandbox/i, 'sandbox webhook resource type'],
  [/^  \/v1\/environments(?:[/{:]|$)/m, 'Environment management path'],
  [/^  - name: Environments$/m, 'Environments tag'],
  [/^    (?:Create|Update)?Environment(?:Config)?:$/m, 'Environment management schema'],
  [/^    EnvironmentId:$/m, 'EnvironmentId parameter'],
  [/^  \/v1\/embeds(?:[/{:]|$)/m, 'unmaintained Embed Config path'],
  [/^  - name: Embed Configs$/m, 'Embed Configs tag'],
  [/^    (?:Create|Update|Delete)?EmbedConfig(?:Request|Response|List|Usage)?:$/m, 'Embed Config schema'],
  [/^    EmbedConfigId:$/m, 'Embed Config parameter'],
  [/(?:openai\/gpt-4o|anthropic\/claude-sonnet-4|google\/gemini-2\.5-flash)(?![-\w])/i, 'stale model example'],
  [/(?:^|[\s"'`])gemini-2\.5-flash(?![-\w])/i, 'stale Gemini model example'],
]

for (const [pattern, label] of forbiddenOpenApiPatterns) {
  assert.doesNotMatch(openapi, pattern, `Public OpenAPI must not expose ${label}`)
}

const requiredPublicPaths = [
  '/v1/run:',
  '/v1/run/{id}:',
  '/v1/api/{vendor}/{upstream_path}:',
  '/v1/upload:',
  '/v1/account/balance:',
  '/v1/account/history:',
  '/v1/responses:',
  '/v1beta/models/{model}:generateContent:',
  '/v1beta/models/{model}:streamGenerateContent:',
  '/v1beta/interactions:',
  '/v1beta/interactions/{id}:',
  '/v1/images/generations:',
  '/v1/images/edits:',
  '/v1/assets:',
  '/v1/assets/{id}:',
  '/v1/agents:',
  '/v1/agents/{agent_id}:',
  '/v1/agents/catalog:',
  '/v1/agents/sessions:',
  '/v1/agents/sessions/{session_id}/events:',
  '/v1/services:',
  '/v1/services/{service_id}/invoke:',
  '/v1/schedules:',
  '/v1/schedules/{schedule_id}/runs:',
  '/v1/schedules/{schedule_id}/timing:',
  '/v1/secrets:',
  '/v1/secrets/{secret_id}/rotate:',
  '/v1/mcp-connections:',
  '/v1/mcp-connections/{connection_id}/enable:',
  '/v1/skills:',
  '/v1/skills/{skill_id}/versions:',
]

for (const requiredPath of requiredPublicPaths) {
  assert.match(openapi, new RegExp(`^  ${requiredPath.replace(/[{}\/]/g, '\\$&')}$`, 'm'), `Missing ${requiredPath}`)
}

const publicMethods = ['get', 'post', 'put', 'patch', 'delete']
for (const [publicPath, pathItem] of Object.entries(openapiDocument.paths)) {
  for (const method of publicMethods) {
    const operation = pathItem[method]
    if (!operation) continue
    for (const [status, response] of Object.entries(operation.responses)) {
      // x-sandbase-empty-body marks implemented 2xx acknowledgements that carry no body.
      if (Number(status) >= 200 && Number(status) < 300 && status !== '204' && response['x-sandbase-empty-body'] !== true) {
        assert.ok(
          Object.values(response.content ?? {}).some((media) => media.schema),
          `${method.toUpperCase()} ${publicPath} ${status} must document its implemented success envelope`,
        )
      }
      if (Number(status) < 400) continue
      assert.ok(
        response.content?.['application/json']?.schema,
        `${method.toUpperCase()} ${publicPath} ${status} must document its implemented JSON error envelope`,
      )
    }
    if (publicPath === '/v1/messages') continue
    assert.ok(
      operation.responses['401']?.content?.['application/json']?.schema,
      `${method.toUpperCase()} ${publicPath} must document its implemented JSON authentication-error envelope`,
    )
    if (publicPath === '/v1/tasks/{task_id}/cost') {
      assert.ok(!operation.responses['402'], 'Task cost lookup must preserve its implemented spending-limit exception')
      assert.ok(operation.responses['403'], 'Task cost lookup must document scoped-key rejection')
      continue
    }
    assert.ok(operation.responses['402'], `${method.toUpperCase()} ${publicPath} must document API-key spending-limit rejection`)
    assert.ok(operation.responses['403'], `${method.toUpperCase()} ${publicPath} must document scoped-key rejection`)
  }
}

const jsonErrorSchema = (method, publicPath, status) =>
  openapiDocument.paths[publicPath]?.[method]?.responses?.[status]?.content?.['application/json']?.schema
const jsonSuccessSchema = (method, publicPath, status = '200') =>
  openapiDocument.paths[publicPath]?.[method]?.responses?.[status]?.content?.['application/json']?.schema

assert.match(config, /'_archived\/\*\*'/, 'Archived API pages must stay excluded from the public build')
for (const archivedSource of ['guides/site-agent-integration.md', 'use-cases', 'api-reference/embeds', 'api-reference/environments', 'api-reference/endpoints/mcp.md', 'api-reference/endpoints/acp.md']) {
  assert.ok(!existsSync(path.join(root, archivedSource)), `${archivedSource} is retired and must live under _archived/`)
}
assert.match(config, /'api-reference\/webhooks\.md'/, 'Sandbox event webhook reference must stay excluded from the public build')
assert.match(config, /'agents\/endpoint-quickstart\.md'/, 'Retired Service quickstart must stay excluded from the public build')
assert.match(config, /'admin\/api-keys\.md'/, 'Duplicate API Keys guide must stay excluded from the public build')
assert.match(config, /'setup\/cli\.md'/, 'Duplicate CLI setup page must stay excluded from the public build')
assert.match(config, /'setup\/groups\.md'/, 'Retired Platform Groups page must stay excluded from the public build')
assert.doesNotMatch(platformSidebar, /Service quickstart/, 'Retired Service quickstart must not appear in the docs sidebar')
assert.doesNotMatch(sidebar, /\/api-reference\/sandboxes?\b/i, 'Sidebar must not link to sandbox API pages')
assert.doesNotMatch(sidebar, /\/api-reference\/webhooks\b/i, 'Sidebar must not link to Sandbox event webhook APIs')
assert.equal((modelSidebar.match(/text: 'Inference APIs'/g) ?? []).length, 0, 'Model API navigation must keep normalized Inference APIs in the concept/API reference docs')
assert.doesNotMatch(sidebar, /text: 'Embed Configs'/, 'Platform API sidebar must not expose the unmaintained Embed Config module')
assert.doesNotMatch(platformSidebar, /text: 'Models'/, 'Platform API sidebar must direct model discovery to the standalone Model API Reference')
assert.doesNotMatch(platformSidebar, /text: 'Agent APIs'/, 'Platform API sidebar must use resource names without redundant API suffixes')
assert.equal((platformSidebar.match(/text: 'Sessions'/g) ?? []).length, 1, 'Sessions must be one top-level Platform API resource group')
assert.match(platformSidebar, /text: 'Services'/, 'Platform API sidebar must use the Services product name')
assert.doesNotMatch(platformSidebar, /text: 'Endpoints'/, 'Platform API sidebar must not expose the legacy Endpoints product name')
assert.match(platformSidebar, /text: 'Schedules'/, 'Platform API sidebar must use the Schedules product name')
assert.doesNotMatch(platformSidebar, /text: 'Deployments'/, 'Platform API sidebar must not expose the compatibility Deployment resource as the product name')
for (const [resource, anchors] of [
  ['mcp-connections', ['create-a-connection', 'list-connections', 'get-a-connection', 'replace-a-connection', 'enable-a-connection', 'disable-a-connection']],
  ['secrets', ['create-a-secret', 'list-secrets', 'get-a-secret', 'rotate-a-secret', 'revoke-a-secret']],
]) {
  const overview = readFileSync(new URL(`../api-reference/${resource}/index.md`, import.meta.url), 'utf8')
  for (const anchor of anchors) {
    assert.match(platformSidebar, new RegExp(`/api-reference/${resource}/#${anchor}`), `${resource} sidebar must expose the ${anchor} operation`)
    assert.match(overview, new RegExp(`^## ${anchor.replace(/-/g, ' ')}$`, 'mi'), `${resource} overview must keep the ${anchor} anchor`)
  }
}
assert.doesNotMatch(platformSidebar, /text: 'Credentials'|\/api-reference\/(?:credentials|endpoints|deployments)\//, 'Platform API sidebar must not link retired resources')
assert.doesNotMatch(openapi, /^  \/v1\/(?:endpoints|deployments|deployment_runs|sessions|credentials|skills\/files)(?:[/{:]|$)/m, 'Retired Agents resources must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/endpoint_runtime_profiles:$/m, 'Endpoint runtime profiles that reveal MCP transport must not be public')
assert.doesNotMatch(openapi, /^\s+mcp_url:$/m, 'Endpoint MCP transport URL must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/generations(?:\/\{[^}]+\})?:$/m, 'Withdrawn generation paths must not be public')
assert.doesNotMatch(openapi, /https:\/\/api\.sandbase\.ai\/v1\/generations(?:\/|\b)/, 'Public OpenAPI examples must not call withdrawn generation paths')
assert.doesNotMatch(openapi, /^  \/v1\/blog\/assets:$/m, 'Blog publishing storage must not be exposed as a general developer API')
assert.doesNotMatch(openapi, /^  \/v1\/mcp:$/m, 'Generic MCP transport must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/mcp\/(?:servers|\{[^}]+\}\/config):$/m, 'MCP discovery and runtime config routes must not be public')
assert.doesNotMatch(openapi, /^  \/mcp\/\{[^}]+\}\/sse:$/m, 'MCP SSE proxy must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/skills\/\{[^}]+\}\/mcp-publications:$/m, 'Skill MCP publication creation must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/skill-mcp-publications(?:\/\{[^}]+\})?:$/m, 'Skill MCP publication management must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/capabilities\/\{[^}]+\}\/mcp:$/m, 'Capability MCP transport must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/skill-mcp\/\{[^}]+\}\/mcp:$/m, 'Published Skill MCP transport must not be public')
assert.doesNotMatch(openapi, /^  \/events\/webhooks(?:\/\{[^}]+\})?:$/m, 'Sandbox event webhook paths must not be public')
const geminiGeneratePath = openapiDocument.paths['/v1beta/models/{model}:generateContent']?.post
const geminiStreamPath = openapiDocument.paths['/v1beta/models/{model}:streamGenerateContent']?.post
assert.ok(geminiGeneratePath, 'Public OpenAPI must expose the implemented Gemini GenerateContent endpoint')
assert.ok(geminiStreamPath, 'Public OpenAPI must expose the implemented Gemini streamGenerateContent endpoint')
for (const operation of [geminiGeneratePath, geminiStreamPath]) {
  assert.deepEqual(
    operation.security,
    [{ GoogleApiKey: [] }, { BearerAuth: [] }, { GoogleQueryApiKey: [] }],
    'Gemini endpoints must document all three implemented API-key locations in precedence order',
  )
  for (const status of ['400', '401', '402', '403', '404', '429', '500', '502', '503', '504']) {
    assert.equal(
      operation.responses[status]?.content?.['application/json']?.schema?.$ref,
      '#/components/schemas/GeminiError',
      `Gemini ${operation.operationId} ${status} must use the Google error envelope`,
    )
  }
}
assert.ok(
  geminiStreamPath.parameters.some((parameter) => parameter.name === 'alt' && parameter.schema?.enum?.includes('sse')),
  'Gemini streaming must document the implemented alt=sse carrier',
)
assert.ok(
  geminiStreamPath.responses['200']?.content?.['text/event-stream']?.schema,
  'Gemini streaming must document SSE output',
)
assert.ok(
  geminiStreamPath.responses['200']?.content?.['application/json']?.schema?.items?.$ref === '#/components/schemas/GeminiGenerateContentResponse',
  'Gemini streaming must document the default JSON-array carrier',
)
assert.match(modelApiOverview, /\/api-reference\/gemini-generate-content/, 'Model API overview must link to the Gemini native protocol reference')
const geminiInteractionsCreate = openapiDocument.paths['/v1beta/interactions']?.post
const geminiInteractionsGet = openapiDocument.paths['/v1beta/interactions/{id}']?.get
assert.ok(geminiInteractionsCreate, 'Public OpenAPI must expose the implemented Gemini Interactions create endpoint')
assert.ok(geminiInteractionsGet, 'Public OpenAPI must expose the implemented Gemini Interactions get endpoint')
assert.ok(!openapiDocument.paths['/v1beta/interactions']?.get, 'Gemini Interactions list is not implemented and must stay hidden')
assert.ok(!openapiDocument.paths['/v1beta/interactions/{id}']?.delete, 'Gemini Interaction deletion is not implemented and must stay hidden')
assert.ok(!openapiDocument.paths['/v1beta/interactions/{id}/cancel'], 'Gemini Interaction cancellation is not implemented and must stay hidden')
for (const operation of [geminiInteractionsCreate, geminiInteractionsGet]) {
  assert.deepEqual(
    operation.security,
    [{ GoogleApiKey: [] }, { BearerAuth: [] }, { GoogleQueryApiKey: [] }],
    'Gemini Interactions must document all three implemented API-key locations',
  )
}
for (const status of ['400', '401', '402', '403', '404', '422', '429', '500', '502', '503', '504']) {
  assert.equal(
    geminiInteractionsCreate.responses[status]?.content?.['application/json']?.schema?.$ref,
    '#/components/schemas/GeminiError',
    `Gemini Interactions create ${status} must use the Google error envelope`,
  )
}
for (const status of ['400', '401', '402', '403', '404', '500', '502', '503']) {
  assert.equal(
    geminiInteractionsGet.responses[status]?.content?.['application/json']?.schema?.$ref,
    '#/components/schemas/GeminiError',
    `Gemini Interactions get ${status} must use the Google error envelope`,
  )
}
assert.ok(
  geminiInteractionsCreate.responses['200']?.content?.['text/event-stream']?.schema,
  'Gemini Interactions create must document implemented SSE output',
)
assert.ok(
  geminiInteractionsCreate.responses['200']?.headers?.Location,
  'Gemini Interactions create must document the pollable Location header',
)
assert.match(modelApiOverview, /\/api-reference\/gemini-interactions/, 'Model API overview must link to the Gemini Interactions reference')
const volcengineCollection = openapiDocument.paths['/api/v3/contents/generations/tasks']
const volcengineTask = openapiDocument.paths['/api/v3/contents/generations/tasks/{task_id}']
assert.ok(volcengineCollection?.post, 'Public OpenAPI must expose Volcengine task creation')
assert.ok(volcengineCollection?.get, 'Public OpenAPI must expose Volcengine task listing')
assert.ok(volcengineTask?.get, 'Public OpenAPI must expose Volcengine task lookup')
assert.ok(volcengineTask?.delete, 'Public OpenAPI must expose Volcengine task deletion')
for (const operation of [volcengineCollection.post, volcengineCollection.get, volcengineTask.get, volcengineTask.delete]) {
  assert.deepEqual(operation.security, [{ BearerAuth: [] }], 'Volcengine tasks must remain Bearer-only')
}
assert.equal(
  volcengineCollection.post.responses['200']?.content?.['application/json']?.schema?.$ref,
  '#/components/schemas/VolcengineTaskCreated',
  'Volcengine task creation must preserve its implemented HTTP 200 response',
)
assert.ok(!volcengineCollection.post.responses['201'] && !volcengineCollection.post.responses['202'], 'Volcengine task creation is not a 201 or 202 operation')
assert.ok(!volcengineTask.delete.responses['204']?.content, 'Volcengine task deletion 204 must not document a body')
for (const operation of [volcengineCollection.post, volcengineCollection.get, volcengineTask.get, volcengineTask.delete]) {
  for (const [status, response] of Object.entries(operation.responses)) {
    if (Number(status) < 400) continue
    assert.equal(
      response.content?.['application/json']?.schema?.$ref,
      '#/components/schemas/VolcengineError',
      `Volcengine task ${status} must use the Volcengine error envelope`,
    )
  }
}
assert.deepEqual(
  volcengineCollection.get.parameters.find((parameter) => parameter.name === 'filter.status')?.schema?.enum,
  ['queued', 'running', 'cancelled', 'succeeded', 'failed', 'expired'],
  'Volcengine task listing must document every implemented native status',
)
assert.match(officialNativeSidebar, /\/model-api-reference\/official-native-api\//, 'Official Native API sidebar must link to its reference')
assert.doesNotMatch(sidebar, /\/api-reference\/volcengine-contents-generations/, 'Inference navigation must not duplicate the Official Native API reference')
assert.doesNotMatch(sidebar, /platform-apis\/(?:douyin|tiktok)\/web\/live-room/, 'Provider sidebars must not link operations that are unavailable online')
assert.doesNotMatch(openapi, /pattern:\s*['"]?\\?\^run_/, 'Run IDs must remain opaque')
const getRunPath = openapi.match(/^  \/v1\/run\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.doesNotMatch(getRunPath, /pattern:/, 'Run result lookup IDs must not inherit another resource prefix')
for (const status of ['200', '401', '402', '403', '404']) {
  assert.match(getRunPath, new RegExp(`'${status}':`), `Run result lookup must document ${status} responses`)
}
const runPath = openapi.match(/^  \/v1\/run:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(runPath, /text\/event-stream:/, 'Run must document supported streaming output')
for (const status of ['400', '401', '402', '403', '404', '500', '502', '503']) {
  assert.match(runPath, new RegExp(`'${status}':`), `Run must document ${status} responses`)
}
const runRequestSchema = openapi.match(/^    RunRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(runRequestSchema, /enum: \[auto, sync, async, stream\]/, 'Run must document every implemented execution mode')
assert.match(runRequestSchema, /^        stream:\n\s+type: boolean/m, 'Run must document the stream shortcut')
assert.match(runRequestSchema, /public HTTPS callback URL for asynchronous image, video, or audio tasks/, 'Run must scope webhook callbacks to implemented async capability types')
assert.doesNotMatch(runRequestSchema, /public HTTPS callback URL for asynchronous image, video, audio, or API tasks/, 'Run must not promise callbacks for API capabilities')
const runResponseSchema = openapi.match(/^    RunResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(runResponseSchema, /required: \[id, status, model\]/, 'Run responses must require the always-emitted model field')
assert.match(runResponseSchema, /completed task can temporarily be reported as running while output transfer is still pending/, 'Run status must document transfer-pending downgrade behavior')
assert.match(runResponseSchema, /completed responses whose output is empty, malformed, unsupported, or not yet transferred/, 'Run outputs must document every implemented omission case')
assert.doesNotMatch(runResponseSchema, /url: \{[^\n]*format: uri/, 'Run output strings are not URI-validated by the response projection')
assert.match(runResponseSchema, /stored error message is non-empty; otherwise omitted/, 'Run errors must document implemented omission behavior')
const apiPassthroughPath = openapi.match(/^  \/v1\/api\/\{vendor\}\/\{upstream_path\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(apiPassthroughPath, /multiple literal slash-separated segments/, 'API passthrough must document Gin wildcard path behavior')
for (const method of ['get', 'post']) {
  const operation = method === 'get'
    ? apiPassthroughPath.match(/^    get:\n[\s\S]*?(?=^    post:)/m)?.[0] ?? ''
    : apiPassthroughPath.match(/^    post:\n[\s\S]*/m)?.[0] ?? ''
  for (const status of ['200', '202', '400', '401', '402', '403', '404', '500', '502', '503']) {
    assert.match(operation, new RegExp(`'${status}':`), `API passthrough ${method.toUpperCase()} must document ${status} responses`)
  }
}
const postAPIPassthrough = apiPassthroughPath.match(/^    post:\n[\s\S]*/m)?.[0] ?? ''
assert.match(postAPIPassthrough, /A supplied model field is preserved and remains authoritative/, 'API passthrough must document implemented model precedence')
assert.match(postAPIPassthrough, /required: false/, 'API passthrough POST must allow its implemented empty body')
assert.doesNotMatch(openapi, /next_page:\s*(?:\{[^\n]*type:\s*\[string, 'null'\]|\n\s+type:\s*\[string, 'null'\])/, 'List cursors must be omitted rather than returned as null')
const responsesPath = openapi.match(/^  \/v1\/responses:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(responsesPath, /ResponsesRequest/, 'Responses must use the governed request schema')
assert.match(responsesPath, /text\/event-stream:/, 'Responses must document streaming output')
for (const status of ['403', '413', '500', '502', '503']) {
  assert.match(responsesPath, new RegExp(`'${status}':`), `Responses must document ${status} responses`)
}
assert.doesNotMatch(responsesPath, /'404':/, 'Responses retries upstream 404 responses and must not promise a final 404')
assert.doesNotMatch(responsesPath, /'429':/, 'Responses retries upstream 429 responses and must not promise a final 429')
const responsesRequestSchema = openapi.match(/^    ResponsesRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(responsesRequestSchema, /additionalProperties: true/, 'Responses requests must preserve provider-compatible fields')
for (const field of ['background', 'max_output_tokens', 'parallel_tool_calls', 'previous_response_id', 'reasoning', 'text', 'tool_choice']) {
  assert.match(responsesRequestSchema, new RegExp(`^        ${field}:`, 'm'), `Responses must document ${field}`)
}
const responsesResponseSchema = openapi.match(/^    ResponsesResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(responsesResponseSchema, /additionalProperties: false/, 'Responses must document top-level response sanitization')
assert.match(responsesResponseSchema, /required: \[input_tokens, output_tokens, total_tokens, input_tokens_details, output_tokens_details\]/, 'Responses must document sanitized token usage')
assert.doesNotMatch(responsesResponseSchema, /^        (?:cost|provider|routing|account_balance):/m, 'Responses must not expose stripped provider or billing fields')
const chatPath = openapi.match(/^  \/v1\/chat\/completions:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(chatPath, /text\/event-stream:/, 'Chat Completions must document streaming output')
for (const status of ['402', '403', '500', '502', '503']) {
  assert.match(chatPath, new RegExp(`'${status}':`), `Chat Completions must document ${status} responses`)
}
const chatRequestSchema = openapi.match(/^    ChatCompletionRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(chatRequestSchema, /additionalProperties: true/, 'Chat Completions must preserve provider-compatible request fields')
for (const field of ['parallel_tool_calls', 'reasoning_effort', 'reasoning', 'thinking', 'extra_body']) {
  assert.match(chatRequestSchema, new RegExp(`^        ${field}:`, 'm'), `Chat Completions must document ${field}`)
}
assert.doesNotMatch(chatRequestSchema, /enum: \[system, user, assistant, tool\]/, 'Chat message roles must not publish an unimplemented enum restriction')
const chatResponseSchema = openapi.match(/^    ChatCompletionResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(chatResponseSchema, /required: \[id, object, created, model, choices, usage\]/, 'Chat Completions must require the emitted response envelope')
assert.match(chatResponseSchema, /required: \[prompt_tokens, completion_tokens, total_tokens, prompt_tokens_details, completion_tokens_details\]/, 'Chat usage must require emitted token detail objects')
assert.match(chatResponseSchema, /reasoning_content:/, 'Chat responses must document reasoning content')
const messagesPath = openapi.match(/^  \/v1\/messages:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(messagesPath, /security:\n\s+- BearerAuth: \[\]\n\s+- AnthropicApiKey: \[\]/, 'Messages must support Bearer or x-api-key authentication')
assert.match(messagesPath, /name: anthropic-version\n\s+in: header\n\s+required: false/, 'Messages anthropic-version header must remain optional')
assert.match(messagesPath, /default: "2023-06-01"/, 'Messages must document the default Anthropic version')
assert.match(messagesPath, /name: anthropic-beta\n\s+in: header\n\s+required: false/, 'Messages must document the forwarded anthropic-beta header')
assert.match(messagesPath, /additionalProperties: true/, 'Messages must preserve additional Anthropic-compatible request fields')
assert.match(messagesPath, /text\/event-stream:/, 'Messages must document Anthropic SSE output')
for (const status of ['402', '403', '413', '500', '502', '503']) {
  assert.match(messagesPath, new RegExp(`'${status}':`), `Messages must document ${status} responses`)
}
assert.match(messagesPath, /'402': \{ description: Organization balance and credit are exhausted/, 'Messages 402 must describe organization admission rather than API-key limits')
assert.match(messagesPath, /'403': \{ description: 'API Key spending limit reached, organization disabled, or upstream permission rejected'/, 'Messages 403 must document every implemented rejection source')
assert.match(messagesPath, /AnthropicError/, 'Messages must document the Anthropic error envelope')
assert.equal((openapi.match(/AnthropicApiKey:/g) ?? []).length, 2, 'Anthropic x-api-key authentication must be scoped only to Messages')
assert.match(openapi, /AnthropicApiKey:\n\s+type: apiKey\n\s+in: header\n\s+name: x-api-key/, 'AnthropicApiKey must describe the x-api-key header')
const embeddingRequestSchema = openapi.match(/^    EmbeddingRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(embeddingRequestSchema, /additionalProperties: true/, 'Embedding requests must preserve provider-compatible fields')
assert.doesNotMatch(embeddingRequestSchema, /enum: \[2048, 1536/, 'Embeddings must not publish an unimplemented universal dimensions list')
assert.match(embeddingRequestSchema, /enum: \[float, base64\]/, 'Embeddings must document supported OpenAI encoding forms')
assert.match(embeddingRequestSchema, /items:\n\s+type: array\n\s+items:\n\s+type: integer/, 'Embeddings must allow batched token-ID input')
const embeddingsPath = openapi.match(/^  \/v1\/embeddings:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500', '503']) {
  assert.match(embeddingsPath, new RegExp(`'${status}':`), `Embeddings must document ${status} responses`)
}
const embeddingResponseSchema = openapi.match(/^    EmbeddingResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(embeddingResponseSchema, /required: \[object, data, model, usage\]/, 'Embedding responses must require the OpenAI response envelope')
assert.match(embeddingResponseSchema, /type: string\n\s+description: Base64-encoded vector/, 'Embedding responses must allow base64 vectors')
const imageGenerationPath = openapi.match(/^  \/v1\/images\/generations:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(imageGenerationPath, /application\/json:/, 'Image generation must document its JSON request')
const imageEditPath = openapi.match(/^  \/v1\/images\/edits:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(imageEditPath, /multipart\/form-data:/, 'Image edits must document multipart uploads')
const imageGenerationRequest = openapi.match(/^    ImageGenerationRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(imageGenerationRequest, /enum: \[gpt-image-2, gpt-image-2\.5-flare, gpt-image-2\.5-sunburst\]/, 'Image generation must publish every implemented public model alias')
assert.match(imageGenerationRequest, /additionalProperties: true/, 'Image generation must preserve compatible JSON fields')
assert.match(imageGenerationRequest, /stream:\n\s+type: boolean\n\s+const: false/, 'Image generation must not advertise unsupported streaming')
const imageEditRequest = openapi.match(/^    ImageEditRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(imageEditRequest, /enum: \[gpt-image-2, gpt-image-2\.5-flare, gpt-image-2\.5-sunburst\]/, 'Image edits must publish every implemented public model alias')
assert.match(imageEditRequest, /required: \[model, prompt, image\]/, 'Image edits must require model, prompt, and source image')
assert.match(imageEditRequest, /type: array\n\s+items:\n\s+type: string\n\s+format: binary/, 'Image edits must allow repeated source image files')
const imagesResponse = openapi.match(/^    ImagesResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(imagesResponse, /required: \[data, usage\]/, 'Images must document the validated success envelope')
assert.match(imagesResponse, /required: \[input_tokens, output_tokens, total_tokens, input_tokens_details\]/, 'Images must document authoritative usage')
const embeddingPath = openapi.match(/^  \/v1\/embeddings:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500', '503']) {
  assert.match(embeddingPath, new RegExp(`'${status}':`), `Embeddings must document ${status} responses`)
}
assert.deepEqual(
  jsonErrorSchema('post', '/v1/embeddings', '403')?.oneOf?.map((schema) => schema.$ref),
  ['#/components/schemas/EmbeddingError', '#/components/schemas/APIKeyScopeError'],
  'Embeddings must document both organization-admission and scoped-key rejections',
)
assert.deepEqual(
  jsonErrorSchema('post', '/v1/chat/completions', '403')?.oneOf?.map((schema) => schema.$ref),
  ['#/components/schemas/ChatCompletionError', '#/components/schemas/APIKeyScopeError'],
  'Chat Completions must document both organization-admission and scoped-key rejections',
)
assert.deepEqual(
  jsonErrorSchema('post', '/v1/responses', '403')?.oneOf?.map((schema) => schema.$ref),
  ['#/components/schemas/TaskCostError', '#/components/schemas/APIKeyScopeError', '#/components/schemas/ChatCompletionError'],
  'Responses must document admission, scoped-key, and upstream permission rejections',
)
for (const publicPath of ['/v1/images/generations', '/v1/images/edits']) {
  assert.deepEqual(
    jsonErrorSchema('post', publicPath, '403')?.oneOf?.map((schema) => schema.$ref),
    ['#/components/schemas/TaskCostError', '#/components/schemas/APIKeyScopeError'],
    `${publicPath} must document both organization-admission and scoped-key rejections`,
  )
}
assert.match(apiKeyGuide, /Only `POST \/v1\/messages` reads `x-api-key`/, 'API key guide must scope x-api-key to Anthropic Messages')
assert.doesNotMatch(apiKeyGuide, /There is no per-model or per-resource restriction/, 'API key guide must not deny implemented credential restrictions')
for (const content of [apiKeyGuide, authenticationReference]) {
  assert.match(content, /64 hexadecimal characters/, 'API key docs must describe the current sk- key format')
  assert.match(content, /(?:Existing|Legacy) `sk-sb-\.\.\.` keys remain/, 'API key docs must preserve legacy-key guidance')
}
// --- Agents platform (sandbase-agents) contract -------------------------------
const resolveSchema = (schema) => schema?.$ref ? schema.$ref.replace(/^#\//, '').split('/').reduce((current, segment) => current?.[segment], openapiDocument) : schema
const agentsPlatformPrefix = /^\/v1\/(?:agents|services|schedules|secrets|mcp-connections|skills)(?:\/|$)/
const agentsSchema = (name) => openapi.match(new RegExp(`^    ${name}:\\n[\\s\\S]*?(?=^    [A-Za-z#])`, 'm'))?.[0] ?? ''
let agentsOperationCount = 0
for (const [publicPath, pathItem] of Object.entries(openapiDocument.paths)) {
  if (!agentsPlatformPrefix.test(publicPath)) continue
  for (const method of publicMethods) {
    const operation = pathItem[method]
    if (!operation) continue
    agentsOperationCount += 1
    assert.deepEqual(operation.security, [{ BearerAuth: [] }, { AgentsApiKey: [] }], `${method.toUpperCase()} ${publicPath} must document Bearer and X-API-Key authentication`)
    for (const [status, response] of Object.entries(operation.responses)) {
      if (Number(status) < 400) continue
      assert.equal(
        response.content?.['application/json']?.schema?.$ref,
        '#/components/schemas/AgentsError',
        `${method.toUpperCase()} ${publicPath} ${status} must document the Agents error envelope`,
      )
    }
  }
}
assert.ok(agentsOperationCount >= 90, `Agents platform OpenAPI must cover every public route (found ${agentsOperationCount})`)
assert.match(openapi, /AgentsApiKey:\n\s+type: apiKey\n\s+in: header\n\s+name: X-API-Key/, 'AgentsApiKey must describe the X-API-Key header')
for (const [method, publicPath] of [
  ['get', '/v1/agents'], ['get', '/v1/agents/sessions'], ['get', '/v1/agents/sessions/{session_id}/items'],
  ['get', '/v1/agents/sessions/{session_id}/turns'], ['get', '/v1/skills'], ['get', '/v1/agents/catalog'],
]) {
  const schema = resolveSchema(jsonSuccessSchema(method, publicPath))
  assert.ok(schema?.allOf?.some((part) => part.$ref === '#/components/schemas/AgentsCursorList') || schema === openapiDocument.components.schemas.AgentsCursorList, `GET ${publicPath} must use the cursor list envelope`)
}
for (const publicPath of ['/v1/services', '/v1/schedules', '/v1/services/{service_id}/runs', '/v1/schedules/{schedule_id}/runs', '/v1/secrets', '/v1/mcp-connections', '/v1/agents/{agent_id}/versions']) {
  const schema = resolveSchema(jsonSuccessSchema('get', publicPath))
  assert.ok(schema?.allOf?.some((part) => part.$ref === '#/components/schemas/AgentsOffsetList'), `GET ${publicPath} must use the offset list envelope`)
}
assert.match(agentsSchema('AgentsCursorList'), /required: \[object, data, has_more, first_id, last_id\]/, 'Cursor lists must require the emitted envelope')
assert.match(agentsSchema('AgentsOffsetList'), /required: \[data, total, limit, offset\]/, 'Offset lists must require the emitted envelope')
assert.match(agentsSchema('AgentsError'), /required: \[type, code, param, message\]/, 'Agents errors must document the emitted envelope')
assert.match(agentsSchema('Agent'), /runtime_profile: \{ type: string, enum: \[codex, claude, mcode\] \}/, 'Agent runtime profiles must match the implementation')
assert.match(agentsSchema('Session'), /status: \{ type: string, enum: \[idle, in_progress, requires_action, failed\]/, 'Session status must match the implementation')
assert.match(agentsSchema('Session'), /lifecycle_status: \{ type: string, enum: \[active, archived\] \}/, 'Session lifecycle must match the implementation')
assert.doesNotMatch(agentsSchema('SessionCreateRequest'), /initial_events|environment_id/, 'Session creation must not expose retired fields')
assert.match(agentsSchema('AgentRun'), /enum: \[pending, succeeded, failed, cancelled, skipped\]/, 'Run status must match the implementation')
assert.doesNotMatch(agentsSchema('ServiceCreateRequest'), /^        (?:schedule|model_provider):/m, 'Service creation rejects schedule and model_provider')
assert.match(agentsSchema('ScheduleCreateRequest'), /required: \[name, agent_id, input, schedule\]/, 'Schedule creation must require input and timing')
assert.match(agentsSchema('SecretCreateRequest'), /kind: \{ type: string, const: mcp_bearer \}/, 'Secrets only support MCP Bearer tokens')
assert.doesNotMatch(agentsSchema('Secret'), /^        token:/m, 'Secret responses must never expose the token')
for (const [method, publicPath] of [['delete', '/v1/secrets/{secret_id}'], ['delete', '/v1/mcp-connections/{connection_id}']]) {
  const response = openapiDocument.paths[publicPath]?.[method]?.responses?.['204']
  assert.ok(response && !response.content, `${method.toUpperCase()} ${publicPath} must document its empty 204 response`)
}
assert.equal(openapiDocument.paths['/v1/agents/sessions/{session_id}/events']?.post?.responses?.['202']?.['x-sandbase-empty-body'], true, 'Session input acceptance has no body')
for (const publicPath of ['/v1/agents/sessions/{session_id}/events', '/v1/agents/sessions/{session_id}/events/stream']) {
  assert.ok(openapiDocument.paths[publicPath]?.get?.responses?.['200']?.content?.['text/event-stream'], `GET ${publicPath} must document SSE output`)
}
for (const [method, publicPath] of [
  ['post', '/v1/services'], ['post', '/v1/schedules'], ['post', '/v1/services/{service_id}/invoke'], ['post', '/v1/schedules/{schedule_id}/runs'],
  ['post', '/v1/secrets'], ['post', '/v1/mcp-connections'], ['post', '/v1/agents/sessions/{session_id}/cancel'], ['post', '/v1/agents/sessions/{session_id}/files'],
]) {
  assert.ok(
    (openapiDocument.paths[publicPath]?.[method]?.parameters ?? []).some((parameter) => parameter.$ref === '#/components/parameters/IdempotencyKeyRequired'),
    `${method.toUpperCase()} ${publicPath} must require Idempotency-Key`,
  )
}
for (const status of ['429']) {
  for (const publicPath of ['/v1/services/{service_id}/invoke', '/v1/schedules/{schedule_id}/runs']) {
    assert.ok(openapiDocument.paths[publicPath].post.responses[status], `POST ${publicPath} must document ${status} concurrency_limit`)
  }
}
assert.doesNotMatch(openapi, /environment_id|environment_binding/, 'Public OpenAPI must not expose internal Environment bindings')
const agentReferenceText = ['create', 'get', 'list', 'update', 'replace', 'get-version', 'versions']
  .map((page) => readFileSync(new URL(`../api-reference/agents/${page}.md`, import.meta.url), 'utf8'))
  .join('\n')
assert.doesNotMatch(agentReferenceText, /"model":\s*(?:"|\{"id":\s*")claude-sonnet-4/, 'Agent examples must use implemented vendor/model identities')
assert.doesNotMatch(agentReferenceText, /\bagent_[0-9a-f]{8}\b|"system":/, 'Agent examples must use the current agt_ IDs and instructions field')
assert.doesNotMatch(modelSidebar, /text: 'Official Native API'/, 'Model API main navigation must not duplicate the custom Official Native API sidebar')
assert.match(officialNativeSidebar, /Official Native API/, 'Custom sidebar must expose Official Native API')
assert.match(officialNativeSidebar, /official-native-api\/bytedance\/seedance-2\.5-official/, 'Official Native API sidebar must expose Seedance 2.5')
assert.match(officialNativeSidebar, /official-native-api\/bytedance\/seedance-2\.0-official/, 'Official Native API sidebar must expose Seedance 2.0')
assert.match(officialNativeSidebar, /Media Assets for Seedance/, 'Official Native API sidebar must expose the Seedance Asset workflow')
assert.match(officialNativeSidebar, /official-native-api\/bytedance\/media-assets/, 'Official Native API sidebar must link the Seedance Asset workflow')
assert.match(officialNativeSidebar, /Gemini Omni Flash Preview/, 'Official Native API sidebar must expose Gemini Omni')
assert.match(officialNativeSidebar, /official-native-api\/google\/gemini-omni-flash-preview/, 'Official Native API sidebar must link Gemini Omni')
assert.match(officialNativeSidebar, /Gemini 3 Pro Image（Nano Banana Pro）/, 'Official Native API sidebar must expose Gemini 3 Pro Image')
assert.match(officialNativeSidebar, /official-native-api\/google\/gemini-3-pro-image/, 'Official Native API sidebar must link the Gemini 3 Pro Image native page')
assert.match(officialNativeSidebar, /Gemini 3\.1 Flash Image（Nano Banana 2）/, 'Official Native API sidebar must expose Gemini 3.1 Flash Image')
assert.match(officialNativeSidebar, /official-native-api\/google\/gemini-3\.1-flash-image/, 'Official Native API sidebar must link the Gemini 3.1 Flash Image native page')
assert.doesNotMatch(officialNativeSidebar, /llm-models\/google\/gemini-3(?:\.1)?-(?:pro|flash)-image/, 'Official Native API sidebar must use dedicated native pages for Gemini image models')
assert.match(officialNativeSidebar, /GPT Image 2/, 'Official Native API sidebar must expose GPT Image 2')
assert.match(officialNativeSidebar, /official-native-api\/openai\/gpt-image-2/, 'Official Native API sidebar must link GPT Image 2')
assert.match(officialNativeSidebar, /GPT Image 2\.5 Flare/, 'Official Native API sidebar must expose GPT Image 2.5 Flare')
assert.match(officialNativeSidebar, /official-native-api\/openai\/gpt-image-2\.5-flare/, 'Official Native API sidebar must link GPT Image 2.5 Flare')
assert.match(officialNativeSidebar, /GPT Image 2\.5 Sunburst/, 'Official Native API sidebar must expose GPT Image 2.5 Sunburst')
assert.match(officialNativeSidebar, /official-native-api\/openai\/gpt-image-2\.5-sunburst/, 'Official Native API sidebar must link GPT Image 2.5 Sunburst')
const modelDetailSchema = openapi.match(/^    ModelDetail:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(modelDetailSchema, /id:\n\s+type: string\n\s+format: uuid/, 'Model detail IDs must document the implemented UUID identity')
assert.match(modelDetailSchema, /required: \[[^\]]*run_count[^\]]*sort_order[^\]]*created_at[^\]]*examples[^\]]*\]/, 'Model details must require fields always emitted by the serializer')
assert.doesNotMatch(modelDetailSchema, /^        (?:context_length|base_price|price_formula):/m, 'Model details must not advertise fields absent from the top-level serializer')
const modelsPath = openapi.match(/^  \/v1\/models:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(modelsPath, /an explicitly empty value removes the type filter/, 'Model lists must document the implemented empty type filter')
assert.match(modelsPath, /Exact, case-sensitive vendor filter/, 'Model lists must document exact vendor filtering')
for (const status of ['200', '401', '402', '403', '500']) {
  assert.match(modelsPath, new RegExp(`'${status}':`), `Model lists must document ${status} responses`)
}
assert.doesNotMatch(modelsPath, /components\/schemas\/APIError/, 'Model list errors use the Open API string error shape')
const modelPath = openapi.match(/^  \/v1\/models\/\{id_or_name\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(modelPath, /containing slashes are supported as path segments/, 'Model detail must document wildcard logical names')
for (const status of ['200', '400', '401', '402', '403', '404']) {
  assert.match(modelPath, new RegExp(`'${status}':`), `Model detail must document ${status} responses`)
}
assert.doesNotMatch(modelPath, /components\/schemas\/APIError/, 'Model detail errors use the Open API string error shape')
assert.doesNotMatch(modelPath, /'500':/, 'Model detail collapses lookup failures to not found')
const modelCardSchema = openapi.match(/^    ModelCard:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(modelCardSchema, /cache_write_1h_multiplier:/, 'Model cards must include the implemented one-hour cache multiplier')
assert.match(modelCardSchema, /required: \[[^\]]*cache_write_1h_multiplier[^\]]*cover_url[^\]]*\]/, 'Present model cards must require every serializer field')
const modelGetReference = generatedReferenceSpecs.match(/"models\/get": \{[\s\S]*?(?=\n  "models\/image")/)?.[0] ?? ''
assert.match(modelGetReference, /"required": true/, 'Get Model must require its path parameter')
assert.doesNotMatch(modelGetReference, /model_01/, 'Get Model examples must not invent a model_ ID prefix')
const accountBalanceSchema = openapi.match(/^    AccountBalance:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(accountBalanceSchema, /required: \[org_id, balance, credit_limit, alert_threshold\]/, 'Account balance must require every emitted field')
assert.match(accountBalanceSchema, /credit_limit:\n\s+oneOf:[\s\S]*?- type: 'null'/, 'Account credit limit must allow null')
const accountBalancePath = openapi.match(/^  \/v1\/account\/balance:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404']) {
  assert.match(accountBalancePath, new RegExp(`'${status}':`), `Account balance must document ${status} responses`)
}
assert.doesNotMatch(accountBalancePath, /components\/schemas\/APIError/, 'Account balance uses the Open API string error shape')
assert.doesNotMatch(accountBalancePath, /'500':/, 'Account balance collapses organization lookup failures to not found')
const accountHistoryPath = openapi.match(/^  \/v1\/account\/history:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(accountHistoryPath, /name: timezone/, 'Account history must document the validated timezone compatibility parameter')
assert.match(accountHistoryPath, /raw response timestamps remain unchanged/, 'Account history must not imply timezone transforms raw timestamps')
assert.match(accountHistoryPath, /Exact request_id mode ignores it/, 'Account history must document request-ID timezone bypass')
assert.match(accountHistoryPath, /any other value applies no type filter/, 'Account history must document unknown type filter behavior')
assert.match(accountHistoryPath, /every other value falls back to 7d/, 'Account history must document unsupported rolling range fallback')
for (const status of ['200', '400', '401', '402', '403', '500']) {
  assert.match(accountHistoryPath, new RegExp(`'${status}':`), `Account history must document ${status} responses`)
}
assert.doesNotMatch(accountHistoryPath, /components\/schemas\/APIError/, 'Account history uses the Open API string error shape')
const accountHistorySchema = openapi.match(/^    AccountHistoryItem:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['latency_ms', 'user_cost', 'cache_creation_tokens', 'api_key_prefix']) {
  assert.match(accountHistorySchema, new RegExp(`required: \\[[^\\]]*${field}`), `Account history must require emitted ${field}`)
}
const accountHistoryReference = generatedReferenceSpecs.match(/"account\/history": \{[\s\S]*?(?=\n  "models\/audio")/)?.[0] ?? ''
assert.match(accountHistoryReference, /"name": "timezone"/, 'Account history reference must list the timezone compatibility parameter')
assert.match(accountHistoryReference, /Timestamps remain UTC/, 'Account history reference must not imply timezone conversion')
assert.doesNotMatch(accountHistoryReference, /openai\/gpt-4o"/, 'Account history reference must not use the retired default GPT-4o example')
const taskCostPath = openapi.match(/^  \/v1\/tasks\/\{task_id\}\/cost:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(taskCostPath, /same API key/, 'Task cost lookup must document its API-key ownership boundary')
assert.match(taskCostPath, /spending limit/, 'Task cost lookup must document its spending-limit exception')
for (const status of ['200', '401', '403', '404']) {
  assert.match(taskCostPath, new RegExp(`'${status}':`), `Task cost lookup must document ${status} responses`)
}
assert.match(taskCostPath, /'403':[\s\S]*APIKeyScopeError/, 'Task cost scope failures must use their implemented nested error shape')
assert.doesNotMatch(taskCostPath, /'500':/, 'Task cost lookup does not expose an internal-error branch')
assert.doesNotMatch(openapi, /^  \/v1\/skills\/\{id\}\/mcp-publications:$/m, 'Skill MCP publication management must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/skill-mcp(?:-publications)?(?:\/|:)/m, 'Skill MCP transports and publications must not be public')
const assetRegistrationPath = openapi.match(/^  \/v1\/assets:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(assetRegistrationPath, /responses:\n\s+'200':/, 'Asset registration must document the implemented 200 response')
assert.doesNotMatch(assetRegistrationPath, /\s+'201':/, 'Asset registration must not document an unimplemented 201 response')
for (const status of ['400', '401', '402', '403', '500', '502']) {
  assert.match(assetRegistrationPath, new RegExp(`'${status}':`), `Asset registration must document ${status} responses`)
}
const assetLookupPath = openapi.match(/^  \/v1\/assets\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500', '502']) {
  assert.match(assetLookupPath, new RegExp(`'${status}':`), `Asset lookup must document ${status} responses`)
}
const createAssetRequest = openapi.match(/^    CreateAssetRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.doesNotMatch(createAssetRequest, /format: uri/, 'Asset registration must not claim URL syntax validation that the handler does not perform')
const getAssetResponse = openapi.match(/^    GetAssetResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(getAssetResponse, /required: \[id, external_id, asset_url, status, asset_type, download_url, created_at\]/, 'Asset lookup must require every always-emitted field')
assert.doesNotMatch(getAssetResponse, /enum: \[Active, Processing, Failed\]/, 'Asset lookup must not restrict provider-reported statuses')
assert.doesNotMatch(getAssetResponse, /download_url:[\s\S]*?format: uri/, 'Asset download_url must allow the emitted empty string')
const assetOverview = readFileSync(new URL('../api-reference/models/assets.md', import.meta.url), 'utf8')
assert.doesNotMatch(assetOverview, /12 hours|images < 5MB|video\/audio < 50MB/, 'Asset docs must not publish limits or expiry not enforced by the current implementation')
const uploadMediaPath = openapi.match(/^  \/v1\/upload:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(uploadMediaPath, /multipart\/form-data:/, 'Media upload must document multipart input')
for (const status of ['200', '400', '401', '402', '403', '500', '503']) {
  assert.match(uploadMediaPath, new RegExp(`'${status}':`), `Media upload must document ${status} responses`)
}
const uploadMediaRequest = openapi.match(/^    UploadMediaRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(uploadMediaRequest, /required: \[file\]/, 'Media upload must require the file part')
assert.match(uploadMediaRequest, /Image \(up to 20 MB\), audio \(up to 50 MB\), or video \(up to 500 MB\)/, 'Media upload must publish implemented category size limits')
const uploadMediaResponse = openapi.match(/^    UploadMediaResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(uploadMediaResponse, /required: \[url, filename, size, type, content_type\]/, 'Media upload must require every emitted success field')
assert.match(modelApiOverview, /\/api-reference\/models\/(?:assets|upload)/, 'Model API overview must link to the media asset references')
assert.doesNotMatch(openapi, /^  \/default\/v1(?:\/|:)/m, 'Internal Console paths must not be public')

const unpublishedFiles = new Set([
  'api-reference/webhooks.md',
])

function inspectPublishedSources(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '_archived' || entry.name === '.git') continue
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      inspectPublishedSources(filename)
      continue
    }
    if (!/\.(?:md|mdx|txt)$/.test(entry.name)) continue
    const relative = path.relative(root, filename)
    if (unpublishedFiles.has(relative)) continue
    const content = readFileSync(filename, 'utf8')
    assert.doesNotMatch(content, /sk-sb-(?:YOUR|your|xxx)/, `${relative} must use the current sk- placeholder for new API keys`)
    assert.doesNotMatch(content, /\/default\/v1(?:\/|\b)/, `${relative} must not expose internal Console API paths`)
    assert.doesNotMatch(content, /\/v1\/generations(?:\/|\b)/, `${relative} must not expose the withdrawn generation path`)
    assert.doesNotMatch(content, /\/v1\/blog\/assets(?:\/|\b)/, `${relative} must not expose the internal Blog publishing storage API`)
    assert.doesNotMatch(content, /\/events\/webhooks(?:\/|\b)/, `${relative} must not expose Sandbox event webhook paths`)
    assert.doesNotMatch(content, /\brun_abc123\b/, `${relative} must not assume a run ID prefix`)
    assert.doesNotMatch(content, /\btask_abc123\b/, `${relative} must not assume a task ID prefix`)
    assert.doesNotMatch(content, /\bcred_01/, `${relative} must use the implemented sec_ Managed Credential ID prefix`)
    assert.doesNotMatch(content, /Default:\s*60 requests\/min,\s*5 concurrent/i, `${relative} must not publish obsolete universal rate limits`)
    assert.doesNotMatch(content, /rate_limited[^\n]*Retry-After header/i, `${relative} must not claim public 429 responses include Retry-After`)
    assert.doesNotMatch(content, /"next_page": null/, `${relative} must omit next_page on a final page`)
    assert.doesNotMatch(content, /POST \/v1\/(?:chat\/completions|embeddings)[^\n]*Bearer or x-api-key/i, `${relative} must not claim standard gateways accept x-api-key`)
    assert.doesNotMatch(content, /\brespone_format\b/, `${relative} must use the response_format field spelling`)
    if (relative.startsWith('model-api-reference/') && content.includes('"path":"/v1/run"')) {
      assert.doesNotMatch(content, /Error message if the task failed\. Empty on success\./, `${relative} must use the structured public run error`)
      assert.doesNotMatch(content, /Array of generated content\. Empty when status is not completed\./, `${relative} must omit outputs from non-terminal run responses`)
      if (!relative.startsWith('model-api-reference/platform-apis/')) {
        assert.doesNotMatch(content, /Contains exactly one item whose only field is data\./, `${relative} must not apply the Platform API data envelope to media outputs`)
      }
    }
    // Only the explicitly published experimental Sandbox guide/playground may link this section.
    if (!['sandbox/index.md', 'sandbox/playground.md'].includes(relative)) {
    assert.doesNotMatch(maskApprovedSandboxPageHrefs(content), sandboxAPIPath, `${relative} must not expose sandbox API paths`)
    }
    assert.doesNotMatch(content, /\/v1\/endpoints\/[^\s`"']+\/mcp\b/i, `${relative} must not expose Endpoint MCP transport`)
    if (relative !== 'scripts/validate-public-api-surface.mjs') {
      assert.doesNotMatch(content, /(?:GET|POST|PUT|PATCH|DELETE) \/v1\/(?:sessions|endpoints|deployments|deployment_runs|credentials|skills\/files)\b/, `${relative} must not document retired Agents routes as current`)
    }
    assert.doesNotMatch(content, /\/v1\/endpoint_runtime_profiles\b/i, `${relative} must not expose Endpoint runtime profiles that reveal MCP transport`)
    assert.doesNotMatch(content, /\/v1\/mcp(?!-connections)(?:\/|\b)/i, `${relative} must not expose the generic MCP transport or its discovery routes`)
    assert.doesNotMatch(content, /\/v1\/mcp\/(?:servers|[^\s/]+\/config)\b/i, `${relative} must not expose MCP discovery or runtime config routes`)
    assert.doesNotMatch(content, /\/mcp\/[^\s/]+\/sse\b/i, `${relative} must not expose the MCP SSE proxy`)
    assert.doesNotMatch(content, /\/v1\/skills\/[^\s/]+\/mcp-publications\b/i, `${relative} must not expose Skill MCP publication creation`)
    assert.doesNotMatch(content, /\/v1\/skill-mcp-publications(?:\/[^\s/]+)?\b/i, `${relative} must not expose Skill MCP publication management`)
    assert.doesNotMatch(content, /\/v1\/capabilities\/[^\s/]+\/mcp\b/i, `${relative} must not expose Capability MCP transport`)
    assert.doesNotMatch(content, /\/v1\/skill-mcp\/[^\s/]+\/mcp\b/i, `${relative} must not expose published Skill MCP transport`)
  }
}

inspectPublishedSources(root)

const h3Models = ['text-to-video', 'image-to-video', 'reference-to-video', 'video-regeneration']
for (const modelSlug of h3Models) {
  const relative = `model-api-reference/video-generation/minimax/h3/${modelSlug}.md`
  const content = readFileSync(path.join(root, relative), 'utf8')
  const encoded = content.match(/^apiReferenceJson: (.+)$/m)?.[1]
  assert.ok(encoded, `${relative} must contain its generated API reference`)
  const reference = JSON.parse(JSON.parse(encoded))
  const responseFields = reference.groups.find((group) => group.title === 'Response Schema')?.fields ?? []
  assert.deepEqual(
    responseFields.filter((field) => field.name.startsWith('usage.')).map((field) => field.name).sort(),
    ['usage.input_image_count', 'usage.input_seconds', 'usage.output_seconds', 'usage.total_seconds'],
    `${relative} must document the exact public MiniMax H3 official usage allowlist`,
  )
  assert.doesNotMatch(
    JSON.stringify(responseFields),
    /billing_breakdown|provider_cost|upstream_cost|credential|endpoint|task_id/,
    `${relative} must not expose internal MiniMax H3 settlement or routing fields`,
  )
  if (modelSlug === 'video-regeneration') {
    for (const example of reference.examples) {
      assert.match(example.code, /["']?videos["']?\s*[:=]\s*\[/, `${example.language} must submit the required videos array`)
    }
  }
}

for (const resolution of ['480p', '720p']) {
  const relative = `model-api-reference/video-generation/alibaba/wan/2.2/i2v-${resolution}-lora.md`
  const content = readFileSync(path.join(root, relative), 'utf8')
  const encoded = content.match(/^apiReferenceJson: (.+)$/m)?.[1]
  assert.ok(encoded, `${relative} must contain its generated API reference`)
  const reference = JSON.parse(JSON.parse(encoded))
  const requestFields = reference.groups.find((group) => group.title === 'Request body')?.fields ?? []
  const fieldByName = new Map(requestFields.map((field) => [field.name, field]))
  assert.equal(fieldByName.get('duration')?.constraints, 'Allowed values: 5, 8', `${relative} must publish the implemented duration enum`)
  for (const name of ['negative_prompt', 'last_image', 'loras', 'high_noise_loras', 'low_noise_loras', 'seed', 'enable_safety_checker']) {
    assert.ok(fieldByName.has(name), `${relative} must document ${name}`)
  }
  for (const name of ['loras', 'high_noise_loras', 'low_noise_loras']) {
    assert.equal(fieldByName.get(name)?.constraints, 'Items: 0 to 3', `${relative} must publish the ${name} item limit`)
    assert.equal(fieldByName.get(`${name}[].path`)?.required, true, `${relative} must require ${name}[].path`)
    assert.equal(fieldByName.get(`${name}[].scale`)?.default, '1', `${relative} must publish the ${name}[].scale default`)
  }
  assert.equal(fieldByName.has('resolution'), false, `${relative} must not expose the model-fixed resolution as input`)
}

console.log('public API surface: ok')
