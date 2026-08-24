import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const openapi = readFileSync(new URL('../public/openapi.yaml', import.meta.url), 'utf8')
const openapiDocument = parse(openapi)
const config = readFileSync(new URL('../.vitepress/config.ts', import.meta.url), 'utf8')
const sidebar = readFileSync(new URL('../.vitepress/sidebar.ts', import.meta.url), 'utf8')
const generatedReferenceSpecs = readFileSync(new URL('../.vitepress/theme/generatedApiReferenceSpecs.ts', import.meta.url), 'utf8')
const apiKeyGuide = readFileSync(new URL('../getting-started/api-keys.md', import.meta.url), 'utf8')
const authenticationReference = readFileSync(new URL('../api-reference/authentication.md', import.meta.url), 'utf8')
const root = fileURLToPath(new URL('..', import.meta.url))

const forbiddenOpenApiPatterns = [
  [/^  \/sandboxes(?:[/{:]|$)/m, 'sandbox path'],
  [/^  \/[^:\n]*sandbox[^:\n]*:$/im, 'any sandbox path'],
  [/^  - name: Sandboxes$/m, 'Sandboxes tag'],
  [/^    [A-Za-z0-9]*Sandbox[A-Za-z0-9]*:$/m, 'any Sandbox component schema'],
  [/^    SandboxId:$/m, 'SandboxId parameter'],
  [/^    CreateSandboxRequest:$/m, 'CreateSandboxRequest schema'],
  [/^    Sandbox:$/m, 'Sandbox schema'],
  [/resourceType[^\n]*enum[^\n]*sandbox/i, 'sandbox webhook resource type'],
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
  '/v1/embeds:',
  '/v1/embeds/{id}:',
  '/v1/embeds/{id}/usage:',
  '/v1/responses:',
  '/v1beta/models/{model}:generateContent:',
  '/v1beta/models/{model}:streamGenerateContent:',
  '/v1beta/interactions:',
  '/v1beta/interactions/{id}:',
  '/v1/images/generations:',
  '/v1/images/edits:',
  '/v1/assets:',
  '/v1/assets/{id}:',
  '/v1/skills/files:',
  '/v1/skills:',
  '/v1/skills/{id}:',
  '/v1/credentials:',
  '/v1/credentials/{id}:',
  '/v1/credentials/{id}/rotate:',
  '/v1/deployments/{id}/pause:',
  '/v1/deployments/{id}/unpause:',
  '/v1/deployments/{id}/archive:',
  '/v1/deployments/{id}/notifications/feishu/test:',
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
      if (Number(status) >= 200 && Number(status) < 300 && status !== '204') {
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

for (const publicPath of ['/v1/sessions', '/v1/sessions/{id}/events', '/v1/deployments']) {
  assert.ok(
    jsonSuccessSchema('get', publicPath)?.required?.includes('data'),
    `GET ${publicPath} must require the always-emitted data collection`,
  )
}

for (const status of ['400', '500', '503']) {
  assert.equal(
    jsonErrorSchema('post', '/v1/skills/files', status)?.$ref,
    '#/components/schemas/TaskCostError',
    `Skill file upload ${status} must document its implemented flat error envelope`,
  )
}
for (const [method, publicPath, statuses] of [
  ['post', '/v1/skills', ['400', '500']],
  ['get', '/v1/skills', ['500']],
  ['get', '/v1/skills/{id}', ['404', '500']],
  ['put', '/v1/skills/{id}', ['400', '404', '500']],
  ['delete', '/v1/skills/{id}', ['404', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
assert.deepEqual(
  jsonErrorSchema('post', '/v1/skills', '401')?.oneOf?.map((schema) => schema.$ref),
  ['#/components/schemas/TaskCostError', '#/components/schemas/APIError'],
  'Skill creation must document both middleware and creator-context authentication envelopes',
)
for (const [method, publicPath, statuses] of [
  ['post', '/v1/credentials', ['400', '500']],
  ['get', '/v1/credentials', ['500']],
  ['get', '/v1/credentials/{id}', ['404', '500']],
  ['patch', '/v1/credentials/{id}', ['400', '404', '500']],
  ['post', '/v1/credentials/{id}/rotate', ['400', '404', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/LegacyResourceError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented legacy error envelope`,
    )
  }
}
for (const [method, publicPath, statuses] of [
  ['post', '/v1/environments', ['400', '422', '500']],
  ['get', '/v1/environments', ['400', '500']],
  ['get', '/v1/environments/{id}', ['404', '500']],
  ['patch', '/v1/environments/{id}', ['400', '404', '409', '422', '500']],
  ['post', '/v1/environments/{id}', ['400', '404', '409', '422', '500']],
  ['delete', '/v1/environments/{id}', ['404', '409', '500']],
  ['post', '/v1/environments/{id}/archive', ['404', '409', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
for (const method of ['patch', 'post']) {
  assert.deepEqual(
    jsonErrorSchema(method, '/v1/environments/{id}', '403')?.oneOf?.map((schema) => schema.$ref),
    ['#/components/schemas/APIError', '#/components/schemas/APIKeyScopeError'],
    `${method.toUpperCase()} Environment update must document both archived-resource and scoped-key rejections`,
  )
}
for (const [method, publicPath, statuses] of [
  ['post', '/v1/deployments', ['400', '404', '415', '422', '500']],
  ['get', '/v1/deployments', ['400', '500']],
  ['get', '/v1/deployments/{id}', ['404', '500']],
  ['patch', '/v1/deployments/{id}', ['400', '404', '409', '422', '500']],
  ['post', '/v1/deployments/{id}', ['400', '404', '409', '422', '500']],
  ['delete', '/v1/deployments/{id}', ['404', '409', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
for (const [method, publicPath, statuses] of [
  ['post', '/v1/deployments/{id}/run', ['400', '404', '409', '500', '503']],
  ['post', '/v1/deployments/{id}/pause', ['404', '409', '500']],
  ['post', '/v1/deployments/{id}/unpause', ['404', '409', '500']],
  ['post', '/v1/deployments/{id}/archive', ['404', '409', '500']],
  ['post', '/v1/deployments/{id}/notifications/feishu/test', ['400', '404', '409', '502']],
  ['post', '/v1/deployments/{id}/runs', ['400', '404', '409', '500', '503']],
  ['get', '/v1/deployments/{id}/runs', ['400', '500', '503']],
  ['get', '/v1/deployments/{id}/runs/{drun_id}', ['404', '409', '503']],
  ['get', '/v1/deployment_runs', ['400', '500', '503']],
  ['get', '/v1/deployment_runs/{id}', ['404', '503']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
for (const [method, publicPath, statuses] of [
  ['patch', '/v1/endpoints/{id}', ['400', '404', '409', '422', '500']],
  ['post', '/v1/endpoints/{id}', ['400', '404', '409', '422', '500']],
  ['delete', '/v1/endpoints/{id}', ['404', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
for (const status of ['404', '409', '500']) {
  assert.equal(
    jsonErrorSchema('delete', '/v1/sessions/{id}', status)?.$ref,
    '#/components/schemas/SessionAPIError',
    `DELETE /v1/sessions/{id} ${status} must document its implemented typed error envelope`,
  )
}
for (const [method, publicPath, statuses] of [
  ['post', '/v1/embeds', ['400', '404', '422', '500']],
  ['get', '/v1/embeds', ['500']],
  ['get', '/v1/embeds/{id}', ['404', '500']],
  ['patch', '/v1/embeds/{id}', ['400', '404', '422', '500']],
  ['post', '/v1/embeds/{id}', ['400', '404', '422', '500']],
  ['put', '/v1/embeds/{id}', ['400', '404', '422', '500']],
  ['delete', '/v1/embeds/{id}', ['404', '500']],
  ['get', '/v1/embeds/{id}/usage', ['404', '500']],
]) {
  for (const status of statuses) {
    assert.equal(
      jsonErrorSchema(method, publicPath, status)?.$ref,
      '#/components/schemas/APIError',
      `${method.toUpperCase()} ${publicPath} ${status} must document its implemented typed error envelope`,
    )
  }
}
assert.deepEqual(
  jsonErrorSchema('post', '/v1/embeds', '403')?.oneOf?.map((schema) => schema.$ref),
  ['#/components/schemas/APIError', '#/components/schemas/APIKeyScopeError'],
  'Embed Config creation must document both resource-limit and scoped-key rejections',
)

assert.match(config, /'_archived\/\*\*'/, 'Archived API pages must stay excluded from the public build')
assert.match(config, /'guides\/site-agent-integration\.md'/, 'Legacy Site Agent guide must stay excluded from the public build')
assert.match(config, /'use-cases\/site-agent-copilot\.md'/, 'Legacy Site Agent use case must stay excluded from the public build')
assert.match(config, /'api-reference\/webhooks\.md'/, 'Sandbox event webhook reference must stay excluded from the public build')
assert.doesNotMatch(sidebar, /\/api-reference\/sandboxes?\b/i, 'Sidebar must not link to sandbox API pages')
assert.doesNotMatch(sidebar, /\/api-reference\/webhooks\b/i, 'Sidebar must not link to Sandbox event webhook APIs')
assert.doesNotMatch(openapi, /^  \/v1\/endpoints\/\{[^}]+\}\/mcp:$/m, 'Endpoint MCP transport must not be public')
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
assert.match(sidebar, /\/api-reference\/gemini-generate-content/, 'Sidebar must link to the Gemini native protocol reference')
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
assert.match(sidebar, /\/api-reference\/gemini-interactions/, 'Sidebar must link to the Gemini Interactions reference')
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
assert.match(sidebar, /\/api-reference\/volcengine-contents-generations/, 'Sidebar must link to the Volcengine native protocol reference')
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
assert.match(runRequestSchema, /public HTTPS callback URL for asynchronous image, video, audio, or API tasks/, 'Run must scope webhook callbacks to implemented async capability types')
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
assert.match(imageGenerationRequest, /const: gpt-image-2/, 'Image generation must publish the implemented public model alias')
assert.match(imageGenerationRequest, /additionalProperties: true/, 'Image generation must preserve compatible JSON fields')
assert.match(imageGenerationRequest, /stream:\n\s+type: boolean\n\s+const: false/, 'Image generation must not advertise unsupported streaming')
const imageEditRequest = openapi.match(/^    ImageEditRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
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
const agentListPage = openapi.match(/^    AgentListPage:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(agentListPage, /required: \[data\]/, 'Agent list responses must require data')
assert.doesNotMatch(agentListPage, /required: \[[^\]]*next_page/, 'Agent list next_page must be optional on the final page')
const nestedDeploymentRuns = openapi.match(/^  \/v1\/deployments\/\{id\}\/runs:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(nestedDeploymentRuns, /name: limit[\s\S]*?name: page/, 'Nested DeploymentRun lists must document implemented cursor pagination')
assert.match(nestedDeploymentRuns, /next_page:\n\s+type: string/, 'Nested DeploymentRun lists must document their emitted cursor')
const triggerDeploymentRun = nestedDeploymentRuns.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
assert.match(triggerDeploymentRun, /EmptyObjectRequest/, 'Deployment triggers must document their empty-object-only request body')
for (const status of ['200', '400', '401', '402', '403', '404', '409', '500', '503']) {
  assert.match(triggerDeploymentRun, new RegExp(`'${status}':`), `Deployment triggers must document ${status} responses`)
}
const listNestedDeploymentRuns = nestedDeploymentRuns.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
assert.match(listNestedDeploymentRuns, /required: \[data\]/, 'Nested DeploymentRun lists must require data')
for (const status of ['200', '400', '401', '402', '403', '500', '503']) {
  assert.match(listNestedDeploymentRuns, new RegExp(`'${status}':`), `Nested DeploymentRun lists must document ${status} responses`)
}
assert.doesNotMatch(listNestedDeploymentRuns, /'404':/, 'Nested DeploymentRun lists return an empty page for an unknown Deployment')
const triggerDeploymentRunAlias = openapi.match(/^  \/v1\/deployments\/\{id\}\/run:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(triggerDeploymentRunAlias, /EmptyObjectRequest/, 'The Deployment trigger alias must preserve the empty-object-only request body')
for (const status of ['200', '400', '401', '402', '403', '404', '409', '500', '503']) {
  assert.match(triggerDeploymentRunAlias, new RegExp(`'${status}':`), `The Deployment trigger alias must document ${status} responses`)
}
const nestedDeploymentRun = openapi.match(/^  \/v1\/deployments\/\{id\}\/runs\/\{drun_id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '409', '503']) {
  assert.match(nestedDeploymentRun, new RegExp(`'${status}':`), `Nested DeploymentRun reads must document ${status} responses`)
}
const deploymentsPath = openapi.match(/^  \/v1\/deployments:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(deploymentsPath, /name: status\n\s+in: query\n\s+style: form\n\s+explode: true\n\s+schema:\n\s+type: array/, 'Deployment status filters must be repeatable')
const deploymentRunsPath = openapi.match(/^  \/v1\/deployment_runs:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const field of ['trigger_type', 'status']) {
  assert.match(deploymentRunsPath, new RegExp(`name: ${field}\\n\\s+in: query[\\s\\S]*?type: array`), `DeploymentRun ${field} filters must be repeatable`)
}
for (const field of ['created_at_gt', 'created_at_gte', 'created_at_lt', 'created_at_lte']) {
  assert.match(deploymentRunsPath, new RegExp(`name: ${field}, in: query, deprecated: true`), `DeploymentRun lists must document the ${field} compatibility filter`)
}
for (const status of ['200', '400', '401', '402', '403', '500', '503']) {
  assert.match(deploymentRunsPath, new RegExp(`'${status}':`), `Global DeploymentRun lists must document ${status} responses`)
}
const globalDeploymentRun = openapi.match(/^  \/v1\/deployment_runs\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '503']) {
  assert.match(globalDeploymentRun, new RegExp(`'${status}':`), `Global DeploymentRun reads must document ${status} responses`)
}
assert.doesNotMatch(globalDeploymentRun, /'409':/, 'Global DeploymentRun reads return pending records instead of a conflict')
const emptyObjectRequest = openapi.match(/^    EmptyObjectRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(emptyObjectRequest, /maxProperties: 0/, 'Deployment triggers must reject request fields')
const deploymentRunSchema = openapi.match(/^    DeploymentRun:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(deploymentRunSchema, /trigger_context:\n\s+oneOf:\n\s+- type: 'null'/, 'DeploymentRun trigger context must tolerate invalid legacy JSON projected as null')
assert.doesNotMatch(deploymentRunSchema, /^        status:/m, 'DeploymentRun responses must not expose internal creation status')
const deploymentsPathForCreate = openapi.match(/^  \/v1\/deployments:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createDeploymentOperation = deploymentsPathForCreate.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
for (const mediaType of ['application/json', 'application/yaml', 'application/x-yaml']) {
  assert.match(createDeploymentOperation, new RegExp(mediaType.replace('/', '\\/') + ':'), `Deployment creation must document ${mediaType}`)
}
for (const status of ['200', '400', '401', '402', '403', '404', '415', '422', '500']) {
  assert.match(createDeploymentOperation, new RegExp(`'${status}':`), `Deployment creation must document ${status} responses`)
}
assert.match(createDeploymentOperation, /CreateDeclarativeDeploymentRequest/, 'Deployment creation must document declarative runtime definitions')
const declarativeDeploymentRequest = openapi.match(/^    CreateDeclarativeDeploymentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(declarativeDeploymentRequest, /required: \[name, runtime, initial_events\]/, 'Declarative Deployments must require runtime and initial events')
assert.doesNotMatch(declarativeDeploymentRequest, /mcp_servers:|protocols:/, 'Declarative Deployment creation must not expose hidden transports')
assert.doesNotMatch(declarativeDeploymentRequest, /metadata:/, 'Declarative Deployment creation must not document ignored metadata')
const advancedDeploymentRequest = openapi.match(/^    CreateDeploymentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(advancedDeploymentRequest, /anyOf:[\s\S]*?- required: \[agent_id\][\s\S]*?- required: \[agent\]/, 'Advanced Deployment creation must allow the implemented Agent compatibility alias')
for (const field of ['agent_version', 'timeout_policy']) {
  assert.match(advancedDeploymentRequest, new RegExp(`^        ${field}:`, 'm'), `Advanced Deployment creation must document ${field}`)
}
for (const field of ['resources', 'vault_ids']) {
  assert.match(advancedDeploymentRequest, new RegExp(`${field}: \\{ type: array, maxItems: 0`), `Advanced Deployment creation must reject non-empty ${field}`)
}
const feishuTestPath = openapi.match(/^  \/v1\/deployments\/\{id\}\/notifications\/feishu\/test:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(feishuTestPath, /maxProperties: 0/, 'Feishu notification tests must reject custom request fields')
assert.match(feishuTestPath, /This endpoint never accepts a webhook URL or custom message/, 'Feishu notification tests must document the saved-target-only boundary')
for (const status of ['200', '400', '401', '402', '403', '404', '409', '502']) {
  assert.match(feishuTestPath, new RegExp(`'${status}':`), `Feishu notification test must document ${status} responses`)
}
const updateDeploymentSchema = openapi.match(/^    UpdateDeploymentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['resources', 'vault_ids']) {
  assert.doesNotMatch(updateDeploymentSchema, new RegExp(`^        ${field}:`, 'm'), `Deployment updates must not advertise always-rejected ${field}`)
}
assert.match(updateDeploymentSchema, /initial_events:\n\s+type: array\n\s+minItems: 1/, 'Deployment updates must require non-empty initial events')
assert.match(updateDeploymentSchema, /notification_settings:\n\s+type: \[object, 'null'\]/, 'Deployment notifications must allow null to clear the saved target')
assert.match(updateDeploymentSchema, /required: \[feishu_webhook_url\]/, 'A non-null notification_settings object must contain only its implemented webhook field')
assert.match(updateDeploymentSchema, /pattern: '\^https:\/\/open\\\.feishu\\\.cn\/open-apis\/bot\/v2\/hook\//, 'Deployment notifications must publish the enforced Feishu webhook origin and path')
assert.match(sidebar, /\/api-reference\/deployments\/test-feishu-notification/, 'Sidebar must link to the Feishu notification test reference')
assert.match(sidebar, /\/api-reference\/endpoints\/acp/, 'Sidebar must link to the Endpoint ACP reference')
const deploymentSchema = openapi.match(/^    Deployment:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const [publicPath, pathItem] of Object.entries(openapiDocument.paths)) {
  if (!publicPath.startsWith('/v1/deployment')) continue
  for (const method of publicMethods) {
    const operation = pathItem[method]
    if (!operation) continue
    assert.equal(
      operation.responses['401'].content?.['application/json']?.schema?.$ref,
      '#/components/schemas/TaskCostError',
      `${method.toUpperCase()} ${publicPath} must document the implemented string-error authentication envelope`,
    )
  }
}
assert.match(deploymentSchema, /required: \[id, type, name, description, metadata, resources, vault_ids, agent, agent_id, agent_version, environment_id, schedule, timeout_policy, status, version, next_run_at, creation_mode, created_at, updated_at\]/, 'Deployment responses must require fields emitted by every list and detail projection')
const deploymentResourcePath = openapi.match(/^  \/v1\/deployments\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['400', '401', '402', '403', '404', '409', '422', '500']) {
  assert.match(deploymentResourcePath, new RegExp(`'${status}':`), `Deployment resource operations must collectively document ${status}`)
}
for (const suffix of ['pause', 'unpause', 'archive']) {
  const lifecyclePath = openapi.match(new RegExp(`^  /v1/deployments/\\{id\\}/${suffix}:\\n[\\s\\S]*?(?=^  /)`, 'm'))?.[0] ?? ''
  for (const status of ['200', '401', '402', '403', '404', '409', '500']) {
    assert.match(lifecyclePath, new RegExp(`'${status}':`), `Deployment ${suffix} must document ${status}`)
  }
}
const agentSchema = openapi.match(/^    Agent:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['tools', 'mcp_servers', 'skills', 'handoffs']) {
  assert.match(agentSchema, new RegExp(`${field}:\\n\\s+type: \\[array, 'null'\\]`), `Agent ${field} must allow the serializer's null output`)
}
assert.match(agentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Agent metadata must allow the serializer\'s null output')
assert.doesNotMatch(agentSchema, /^        (?:runtime_profile|multiagent):/m, 'Agent responses must not advertise fields omitted by the serializer')
assert.match(agentSchema, /required: \[id, type, name, description, model, system, tools, mcp_servers, skills, handoffs, metadata, version, created_at, updated_at, archived_at\]/, 'Agent responses must require every field always emitted by the serializer')
assert.match(agentSchema, /effort:\n\s+description: Optional model runtime hint preserved/, 'Agent model effort responses must allow the implemented pass-through value')
assert.match(agentSchema, /id:\n\s+type: string\n\s+pattern: '\^agent_\[0-9a-f\]\{8\}-\[0-9a-f\]\{3\}\$'/, 'Agent IDs must document the implemented generated shape')
const updateAgentSchema = openapi.match(/^    UpdateAgentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['tools', 'skills', 'mcp_servers', 'handoffs']) {
  assert.match(updateAgentSchema, new RegExp(`${field}:\\n\\s+type: \\[array, 'null'\\]`), `Agent update ${field} must allow explicit null replacement`)
}
assert.match(updateAgentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Agent update metadata must allow explicit null replacement')
assert.match(updateAgentSchema, /additionalProperties: true/, 'Agent updates must allow ignored compatibility fields')
assert.match(updateAgentSchema, /name:\n\s+type: \[string, 'null'\]/, 'Agent updates must allow null scalar fields to preserve their values')
const createAgentSchema = openapi.match(/^    CreateAgentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(createAgentSchema, /additionalProperties: true/, 'Agent creation must allow ignored compatibility fields')
assert.match(createAgentSchema, /pattern: '\^\[A-Za-z0-9\]/, 'Agent model identities must require implemented vendor/model syntax')
assert.match(createAgentSchema, /tools:\n\s+type: \[array, 'null'\]/, 'Agent creation must distinguish omitted default tools from explicit null')
assert.doesNotMatch(createAgentSchema, /maxItems: (?:20|128)|maxLength: (?:256|2048|100000)/, 'Agent creation must not advertise limits that are not enforced')
const agentsPath = openapi.match(/^  \/v1\/agents:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createAgent = agentsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '422', '500']) {
  assert.match(createAgent, new RegExp(`'${status}':`), `Agent creation must document ${status} responses`)
}
const listAgents = agentsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '500']) {
  assert.match(listAgents, new RegExp(`'${status}':`), `Agent listing must document ${status} responses`)
}
const agentPath = openapi.match(/^  \/v1\/agents\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(agentPath.match(/^    get:\n[\s\S]*?(?=^    post:)/m)?.[0] ?? '', new RegExp(`'${status}':`), `Agent reads must document ${status} responses`)
}
const updateAgent = agentPath.match(/^    post:\n[\s\S]*/m)?.[0] ?? ''
assert.match(updateAgent, /a no-op returns the current Agent without incrementing/, 'Agent updates must document no-op version semantics')
for (const status of ['200', '400', '401', '402', '403', '404', '409', '422', '500']) {
  assert.match(updateAgent, new RegExp(`'${status}':`), `Agent updates must document ${status} responses`)
}
const archiveAgentPath = openapi.match(/^  \/v1\/agents\/\{id\}\/archive:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '409', '500']) {
  assert.match(archiveAgentPath, new RegExp(`'${status}':`), `Agent archival must document ${status} responses`)
}
const agentVersionsPath = openapi.match(/^  \/v1\/agents\/\{id\}\/versions:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(agentVersionsPath, new RegExp(`'${status}':`), `Agent version listing must document ${status} responses`)
}
const agentVersionPath = openapi.match(/^  \/v1\/agents\/\{id\}\/versions\/\{version\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(agentVersionPath, new RegExp(`'${status}':`), `Agent version reads must document ${status} responses`)
}
const updateAgentReference = readFileSync(new URL('../api-reference/agents/update.md', import.meta.url), 'utf8')
assert.match(updateAgentReference, /null is treated as omitted and preserves the current value/, 'Agent string updates must document their implemented null semantics')
assert.doesNotMatch(updateAgentReference, /Send null or an empty string to clear/, 'Agent string updates must not claim null clears pointer fields')
const agentReferenceText = ['create', 'get', 'list', 'update', 'get-version', 'versions']
  .map((page) => readFileSync(new URL(`../api-reference/agents/${page}.md`, import.meta.url), 'utf8'))
  .join('\n')
assert.doesNotMatch(agentReferenceText, /"model":\s*(?:"|\{"id":\s*")claude-sonnet-4/, 'Agent examples must use implemented vendor/model identities')
const sessionSchema = openapi.match(/^    Session:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(sessionSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Session metadata must allow the serializer\'s null output')
assert.match(sessionSchema, /required: \[[^\]]*title[^\]]*metadata[^\]]*archived_at[^\]]*updated_at[^\]]*\]/, 'Session responses must require fields always emitted by the serializer')
assert.match(sessionSchema, /source:\n\s+type: string\n\s+enum: \[direct, endpoint, deployment, store_trial\]/, 'Session source must include Service store trials')
const sessionEventSchema = openapi.match(/^    SessionEvent:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(sessionEventSchema, /required: \[id, type, processed_at, created_at\]/, 'Session Events must require the serializer\'s created_at field')
const sessionEventStream = openapi.match(/^  \/v1\/sessions\/\{id\}\/events\/stream:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(sessionEventStream, /does not synthesize preview deltas/, 'Session event_delta must not promise unimplemented preview deltas')
const sessionStreamReference = generatedReferenceSpecs.match(/"sessions\/stream": \{[\s\S]*?(?=\n  \},\n  "skills\/create")/)?.[0] ?? ''
assert.match(sessionStreamReference, /id: sevt_01/, 'Session SSE examples must include the emitted id field')
assert.match(sessionStreamReference, /created_at/, 'Session SSE examples must include the emitted created_at field')
const credentialSchema = openapi.match(/^    Credential:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(credentialSchema, /id: \{ type: string, pattern: '\^sec_' \}/, 'Managed Credential IDs must use the implemented sec_ prefix')
assert.match(credentialSchema, /required: \[[^\]]*last_used_at[^\]]*cooldown_until[^\]]*failure_count[^\]]*\]/, 'Credential responses must require fields always emitted by the serializer')
assert.doesNotMatch(credentialSchema, /^        (?:value|value_encrypted):/m, 'Credential responses must never expose plaintext or encrypted values')
const createCredentialSchema = openapi.match(/^    CreateCredentialRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(createCredentialSchema, /strategy: \{ type: string, enum: \[round_robin\]/, 'Credential creation must document the only implemented strategy')
assert.match(createCredentialSchema, /weight: \{ type: integer, minimum: 1/, 'Credential creation must require a positive weight')
assert.match(createCredentialSchema, /Defaults to the submitted scope_name and secret_key joined by a colon/, 'Credential creation must document its derived group key')
const credentialsPath = openapi.match(/^  \/v1\/credentials:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createCredential = credentialsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
for (const status of ['201', '400', '401', '402', '403', '500']) {
  assert.match(createCredential, new RegExp(`'${status}':`), `Credential creation must document ${status} responses`)
}
const listCredentials = credentialsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '500']) {
  assert.match(listCredentials, new RegExp(`'${status}':`), `Credential listing must document ${status} responses`)
}
const credentialPath = openapi.match(/^  \/v1\/credentials\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.doesNotMatch(credentialPath, /^    delete:/m, 'Credentials do not implement deletion')
const getCredential = credentialPath.match(/^    get:\n[\s\S]*?(?=^    patch:)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(getCredential, new RegExp(`'${status}':`), `Credential reads must document ${status} responses`)
}
const updateCredential = credentialPath.match(/^    patch:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(updateCredential, new RegExp(`'${status}':`), `Credential updates must document ${status} responses`)
}
const rotateCredential = openapi.match(/^  \/v1\/credentials\/\{id\}\/rotate:\n[\s\S]*?(?=^  \/|^components:)/m)?.[0] ?? ''
assert.match(rotateCredential, /pattern: '\^sec_'/, 'Credential rotation IDs must use the implemented sec_ prefix')
assert.match(rotateCredential, /reset failure_count to 0 and clear cooldown_until/, 'Credential rotation must document health-state reset semantics')
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(rotateCredential, new RegExp(`'${status}':`), `Credential rotation must document ${status} responses`)
}
const skillSchema = openapi.match(/^    Skill:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(skillSchema, /id: \{ type: string, format: uuid \}/, 'Skill resources must document their UUID identity')
assert.match(skillSchema, /required: \[[^\]]*icon_url[^\]]*preview_urls[^\]]*\]/, 'Skill responses must require fields always emitted by every projection')
const skillUploadPath = openapi.match(/^  \/v1\/skills\/files:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(skillUploadPath, /preview image[\s\S]*?10 MB/, 'Skill uploads must document supported preview images and their size limit')
const skillReferences = generatedReferenceSpecs.match(/"skills\/create": \{[\s\S]*?(?=\n  "inference\/responses")/)?.[0] ?? ''
assert.doesNotMatch(skillReferences, /skill_01/, 'Skill reference examples must not invent a skill_ ID prefix')
assert.match(skillReferences, /550e8400-e29b-41d4-a716-446655440000/, 'Skill reference examples must use a UUID')
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
const embedConfigSchema = openapi.match(/^    EmbedConfig:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(embedConfigSchema, /required: \[[^\]]*allowed_origins[^\]]*embed_code[^\]]*updated_at[^\]]*\]/, 'Embed Configs must require every serializer field')
assert.match(embedConfigSchema, /allowed_origins:\n\s+type: \[array, 'null'\]/, 'Embed Config origins must allow stored null output')
assert.doesNotMatch(embedConfigSchema, /identity_secret|key_hash/, 'Embed Config responses must not expose authentication internals')
const createEmbedSchema = openapi.match(/^    CreateEmbedConfigRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(createEmbedSchema, /required: \[agent_id, environment_id\]/, 'Embed creation must require both implemented bindings')
assert.match(createEmbedSchema, /additionalProperties: true/, 'Embed creation must allow ignored compatibility fields')
assert.match(createEmbedSchema, /name: \{ type: \[string, 'null'\]/, 'Embed creation must allow null optional strings')
const updateEmbedSchema = openapi.match(/^    UpdateEmbedConfigRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.doesNotMatch(updateEmbedSchema, /^        (?:agent_id|environment_id):/m, 'Embed updates must not advertise immutable bindings')
assert.match(updateEmbedSchema, /null values preserve the current value/, 'Embed updates must document implemented null semantics')
assert.match(updateEmbedSchema, /additionalProperties: true/, 'Embed updates must allow ignored compatibility fields')
assert.match(updateEmbedSchema, /enabled: \{ type: \[boolean, 'null'\]/, 'Null Embed enabled values must preserve the current state')
const embedsPath = openapi.match(/^  \/v1\/embeds:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createEmbed = embedsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
for (const status of ['201', '400', '401', '402', '403', '404', '422', '500']) {
  assert.match(createEmbed, new RegExp(`'${status}':`), `Embed creation must document ${status} responses`)
}
const listEmbeds = embedsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '500']) {
  assert.match(listEmbeds, new RegExp(`'${status}':`), `Embed listing must document ${status} responses`)
}
const embedPath = openapi.match(/^  \/v1\/embeds\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const getEmbed = embedPath.match(/^    get:\n[\s\S]*?(?=^    patch:)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(getEmbed, new RegExp(`'${status}':`), `Embed reads must document ${status} responses`)
}
for (const method of ['patch', 'post', 'put']) {
  const next = method === 'patch' ? 'post' : method === 'post' ? 'put' : 'delete'
  const operation = embedPath.match(new RegExp(`^    ${method}:\\n[\\s\\S]*?(?=^    ${next}:)`, 'm'))?.[0] ?? ''
  assert.match(operation, /UpdateEmbedConfigRequest/, `${method.toUpperCase()} Embed updates must use the implemented request schema`)
  for (const status of ['200', '400', '401', '402', '403', '404', '422', '500']) {
    assert.match(operation, new RegExp(`'${status}':`), `${method.toUpperCase()} Embed updates must document ${status} responses`)
  }
}
const deleteEmbed = embedPath.match(/^    delete:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(deleteEmbed, new RegExp(`'${status}':`), `Embed deletion must document ${status} responses`)
}
const embedUsagePath = openapi.match(/^  \/v1\/embeds\/\{id\}\/usage:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(embedUsagePath, /Session Event record/, 'Embed usage must describe what message_count actually counts')
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(embedUsagePath, new RegExp(`'${status}':`), `Embed usage must document ${status} responses`)
}
assert.match(embedUsagePath, /'500': \{ description: Usage statistics could not be loaded/, 'Embed usage must document configuration lookup failures without implying that aggregation count errors propagate')
const taskCostPath = openapi.match(/^  \/v1\/tasks\/\{task_id\}\/cost:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(taskCostPath, /same API key/, 'Task cost lookup must document its API-key ownership boundary')
assert.match(taskCostPath, /spending limit/, 'Task cost lookup must document its spending-limit exception')
for (const status of ['200', '401', '403', '404']) {
  assert.match(taskCostPath, new RegExp(`'${status}':`), `Task cost lookup must document ${status} responses`)
}
assert.match(taskCostPath, /'403':[\s\S]*APIKeyScopeError/, 'Task cost scope failures must use their implemented nested error shape')
assert.doesNotMatch(taskCostPath, /'500':/, 'Task cost lookup does not expose an internal-error branch')
const sessionsPath = openapi.match(/^  \/v1\/sessions:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createSession = sessionsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
assert.match(createSession, /Unknown top-level fields are rejected/, 'Session creation must document strict unknown-field handling')
assert.match(createSession, /unsupported_feature, agent_runtime_environment_mismatch/, 'Session creation must document every implemented 422 class')
for (const status of ['200', '400', '401', '402', '403', '404', '422', '500', '502', '503']) {
  assert.match(createSession, new RegExp(`'${status}':`), `Session creation must document ${status} responses`)
}
const listSessions = sessionsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '500']) {
  assert.match(listSessions, new RegExp(`'${status}':`), `Session listing must document ${status} responses`)
}
const sessionPath = openapi.match(/^  \/v1\/sessions\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const getSession = sessionPath.match(/^    get:\n[\s\S]*?(?=^    post:)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(getSession, new RegExp(`'${status}':`), `Session reads must document ${status} responses`)
}
const updateSession = sessionPath.match(/^    post:\n[\s\S]*?(?=^    delete:)/m)?.[0] ?? ''
assert.match(updateSession, /shallow-merge metadata/, 'Session updates must document metadata merge semantics')
assert.match(updateSession, /null removes a key/, 'Session updates must document metadata key deletion')
assert.match(updateSession, /additionalProperties: true/, 'Session updates must allow ignored compatibility fields')
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(updateSession, new RegExp(`'${status}':`), `Session updates must document ${status} responses`)
}
const deleteSession = sessionPath.match(/^    delete:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '409', '500']) {
  assert.match(deleteSession, new RegExp(`'${status}':`), `Session deletion must document ${status} responses`)
}
const archiveSessionPath = openapi.match(/^  \/v1\/sessions\/\{id\}\/archive:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(archiveSessionPath, new RegExp(`'${status}':`), `Session archival must document ${status} responses`)
}
const sessionEventsPath = openapi.match(/^  \/v1\/sessions\/\{id\}\/events:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '409', '422', '500']) {
  assert.match(sessionEventsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? '', new RegExp(`'${status}':`), `Session Event send must document ${status} responses`)
}
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(sessionEventsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? '', new RegExp(`'${status}':`), `Session Event listing must document ${status} responses`)
}
const sessionStreamPath = openapi.match(/^  \/v1\/sessions\/\{id\}\/events\/stream:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(sessionStreamPath, new RegExp(`'${status}':`), `Session Event streaming must document ${status} responses`)
}
const publicSessionSchema = openapi.match(/^    Session:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(publicSessionSchema, /SessionAgentProjection/, 'Session responses must use the implemented full-or-minimal Agent projection')
const sessionAgentProjection = openapi.match(/^    SessionAgentProjection:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(sessionAgentProjection, /legacy or unavailable snapshots fall back/, 'Session Agent projection must document its fallback behavior')
assert.match(sessionAgentProjection, /required: \[id, type, version\]/, 'Session Agent fallback must require every serializer field')
const environmentSchema = openapi.match(/^    Environment:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const [publicPath, pathItem] of Object.entries(openapiDocument.paths)) {
  if (!publicPath.startsWith('/v1/environments')) continue
  for (const method of publicMethods) {
    const operation = pathItem[method]
    if (!operation) continue
    assert.equal(
      operation.responses['401'].content?.['application/json']?.schema?.$ref,
      '#/components/schemas/TaskCostError',
      `${method.toUpperCase()} ${publicPath} must document the implemented string-error authentication envelope`,
    )
  }
}
assert.match(environmentSchema, /required: \[id, type, agent_id, name, description, config, metadata, credential_bindings, archived_at, created_at, updated_at\]/, 'Environment responses must require every serializer field')
assert.match(environmentSchema, /id:\n\s+type: string\n\s+pattern: '\^env_'/, 'Environment IDs must document their public prefix')
assert.match(environmentSchema, /config:\n[\s\S]*?- type: 'null'/, 'Environment config must allow the serializer\'s null output')
assert.match(environmentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Environment metadata must allow the serializer\'s null output')
assert.match(environmentSchema, /credential_bindings:\n\s+type: \[array, 'null'\]/, 'Environment credential bindings must allow the serializer\'s null output')
const environmentsPath = openapi.match(/^  \/v1\/environments:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createEnvironment = environmentsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '422', '500']) {
  assert.match(createEnvironment, new RegExp(`'${status}':`), `Environment creation must document ${status} responses`)
}
const listEnvironments = environmentsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
assert.match(listEnvironments, /name: include_archived/, 'Environment lists must document the implemented archive filter')
assert.match(listEnvironments, /required: \[data\]/, 'Environment lists must require data')
for (const status of ['200', '400', '401', '402', '403', '500']) {
  assert.match(listEnvironments, new RegExp(`'${status}':`), `Environment lists must document ${status} responses`)
}
const environmentPath = openapi.match(/^  \/v1\/environments\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(environmentPath.match(/^    get:\n[\s\S]*?(?=^    patch:)/m)?.[0] ?? '', new RegExp(`'${status}':`), `Environment reads must document ${status} responses`)
}
for (const method of ['patch', 'post']) {
  const terminator = method === 'patch' ? 'post' : 'delete'
  const operation = environmentPath.match(new RegExp(`^    ${method}:\\n[\\s\\S]*?(?=^    ${terminator}:)`, 'm'))?.[0] ?? ''
  assert.match(operation, /UpdateEnvironmentRequest/, `${method.toUpperCase()} Environment updates must use the partial update schema`)
  for (const status of ['200', '400', '401', '402', '403', '404', '409', '422', '500']) {
    assert.match(operation, new RegExp(`'${status}':`), `${method.toUpperCase()} Environment updates must document ${status} responses`)
  }
}
const deleteEnvironment = environmentPath.match(/^    delete:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '409', '500']) {
  assert.match(deleteEnvironment, new RegExp(`'${status}':`), `Environment deletion must document ${status} responses`)
}
const archiveEnvironment = openapi.match(/^  \/v1\/environments\/\{id\}\/archive:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '409', '500']) {
  assert.match(archiveEnvironment, new RegExp(`'${status}':`), `Environment archival must document ${status} responses`)
}
const createEnvironmentSchema = openapi.match(/^    CreateEnvironmentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(createEnvironmentSchema, /required: \[name, config\]/, 'Environment creation must require name and config')
assert.match(createEnvironmentSchema, /credential_bindings:\n\s+type: \[array, 'null'\]/, 'Environment creation must allow null credential bindings')
const updateEnvironmentSchema = openapi.match(/^    UpdateEnvironmentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.doesNotMatch(updateEnvironmentSchema, /minProperties:/, 'Empty Environment updates are implemented no-ops')
assert.match(updateEnvironmentSchema, /name:\n\s+type: \[string, 'null'\]/, 'Null Environment names must preserve the current value')
assert.match(updateEnvironmentSchema, /credential_bindings:\n\s+type: \[array, 'null'\]/, 'Null Environment credential bindings must clear the field')
assert.doesNotMatch(openapi, /^  \/v1\/skills\/\{id\}\/mcp-publications:$/m, 'Skill MCP publication management must not be public')
assert.doesNotMatch(openapi, /^  \/v1\/skill-mcp(?:-publications)?(?:\/|:)/m, 'Skill MCP transports and publications must not be public')
const skillFilesPath = openapi.match(/^  \/v1\/skills\/files:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['201', '400', '401', '402', '403', '500', '503']) {
  assert.match(skillFilesPath, new RegExp(`'${status}':`), `Skill file uploads must document ${status} responses`)
}
const skillsPath = openapi.match(/^  \/v1\/skills:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createSkill = skillsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
assert.match(createSkill, /SkillCreated/, 'Skill creation must use its compact response projection')
for (const status of ['201', '400', '401', '402', '403', '500']) {
  assert.match(createSkill, new RegExp(`'${status}':`), `Skill creation must document ${status} responses`)
}
const listSkills = skillsPath.match(/^    get:\n[\s\S]*/m)?.[0] ?? ''
assert.match(listSkills, /SkillListItem/, 'Skill lists must use their list-item response projection')
for (const status of ['200', '401', '402', '403', '500']) {
  assert.match(listSkills, new RegExp(`'${status}':`), `Skill lists must document ${status} responses`)
}
const skillPath = openapi.match(/^  \/v1\/skills\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const getSkill = skillPath.match(/^    get:\n[\s\S]*?(?=^    put:)/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(getSkill, new RegExp(`'${status}':`), `Skill reads must document ${status} responses`)
}
const updateSkill = skillPath.match(/^    put:\n[\s\S]*?(?=^    delete:)/m)?.[0] ?? ''
assert.match(updateSkill, /Omitted name, description, and categories are cleared/, 'Skill PUT must document its replacement-style display fields')
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(updateSkill, new RegExp(`'${status}':`), `Skill updates must document ${status} responses`)
}
const deleteSkill = skillPath.match(/^    delete:\n[\s\S]*/m)?.[0] ?? ''
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(deleteSkill, new RegExp(`'${status}':`), `Skill deletion must document ${status} responses`)
}
const skillCreatedSchema = openapi.match(/^    SkillCreated:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(skillCreatedSchema, /required: \[id, name, display_name, vendor_slug, plugin_slug, icon_url, preview_urls, created_at\]/, 'Skill creation responses must require exactly their emitted fields')
const skillListItemSchema = openapi.match(/^    SkillListItem:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(skillListItemSchema, /required: \[id, name, display_name, vendor_slug, plugin_slug, description, icon_url, preview_urls, created_at, updated_at\]/, 'Skill list items must require every emitted field')
const publicSkillSchema = openapi.match(/^    Skill:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(publicSkillSchema, /required: \[id, name, display_name, vendor_slug, plugin_slug, description, categories, icon_url, preview_urls, skill_file_url, git_url, created_at, updated_at\]/, 'Skill detail responses must require every emitted field')
const createSkillSchema = openapi.match(/^    CreateSkillRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.doesNotMatch(createSkillSchema, /format: uri/, 'Skill registration does not validate submitted source strings as URLs')
const updateSkillSchema = openapi.match(/^    UpdateSkillRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(updateSkillSchema, /Omitted name, description, and categories are cleared/, 'Skill update schemas must document mixed replacement semantics')
assert.doesNotMatch(updateSkillSchema, /^        git_url:/m, 'Skill updates must not advertise the ignored git_url field')
const endpointSchema = openapi.match(/^    Endpoint:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['session_metadata', 'memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:\\n\\s+type: \\[object, 'null'\\]`), `Endpoint ${field} must allow the serializer's null output`)
}
assert.match(endpointSchema, /store_status:\n\s+type: string\n\s+enum: \[private, pending_review, public, suspended\]/, 'Endpoint responses must document the serializer\'s store status')
assert.match(endpointSchema, /required: \[id, type, name, slug, agent_id, agent_version, environment_id, protocols, config, session_metadata, memory_config, resource_config, vault_config, status, store_status, creation_mode, run_url, acp_url, created_at, updated_at\]/, 'Endpoint responses must require every field always emitted by the serializer')
assert.match(endpointSchema, /config:\n\s+type: \[object, 'null'\]/, 'Endpoint responses must document advanced config and declarative null output')
assert.match(endpointSchema, /acp_url:[\s\S]*?presence does not mean ACP is enabled/, 'Endpoint ACP URLs must not imply the protocol is enabled')
assert.doesNotMatch(endpointSchema, /^        mcp_url:/m, 'Endpoint responses must not document the hidden MCP transport URL')
assert.doesNotMatch(endpointSchema, /protocols:[\s\S]*?enum: \[rest, acp\]/, 'Endpoint responses must not claim internal transport values are normalized to the public request enum')
for (const schemaName of ['CreateDeclarativeEndpointRequest', 'CreateAdvancedEndpointRequest']) {
  const schema = openapi.match(new RegExp(`^    ${schemaName}:\\n[\\s\\S]*?(?=^    [A-Za-z])`, 'm'))?.[0] ?? ''
  assert.match(schema, /required: \[[^\]]*protocols[^\]]*\]/, `${schemaName} must require explicit public protocols to avoid hidden transport defaults`)
  assert.match(schema, /protocols:\n\s+type: array\n\s+minItems: 1\n\s+uniqueItems: true/, `${schemaName} must require a non-empty unique protocol list`)
  assert.match(schema, /enum: \[rest, acp\]/, `${schemaName} must expose only public invocation transports`)
  assert.doesNotMatch(schema, /default: \[rest\]/, `${schemaName} must not claim an unimplemented REST-only server default`)
}
const endpointsPath = openapi.match(/^  \/v1\/endpoints:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const createEndpointOperation = endpointsPath.match(/^    post:\n[\s\S]*?(?=^    get:)/m)?.[0] ?? ''
assert.match(createEndpointOperation, /responses:\n\s+'201':/, 'Endpoint creation must document its implemented 201 response')
assert.doesNotMatch(createEndpointOperation, /responses:\n\s+'200':/, 'Endpoint creation must not document an unimplemented 200 response')
for (const status of ['400', '401', '402', '403', '404', '409', '415', '422', '500']) {
  assert.match(createEndpointOperation, new RegExp(`'${status}':`), `Endpoint creation must document ${status} responses`)
}
const listEndpointOperation = endpointsPath.match(/^    get:\n[\s\S]*$/m)?.[0] ?? ''
for (const status of ['200', '400', '401', '402', '403', '500']) {
  assert.match(listEndpointOperation, new RegExp(`'${status}':`), `Endpoint listing must document ${status} responses`)
}
const endpointResourcePath = openapi.match(/^  \/v1\/endpoints\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
const getEndpointOperation = endpointResourcePath.match(/^    get:\n[\s\S]*?(?=^    patch:)/m)?.[0] ?? ''
assert.match(getEndpointOperation, /EndpointId/, 'Endpoint reads must use the Endpoint path parameter')
assert.doesNotMatch(getEndpointOperation, /EnvironmentId|Environment updated/, 'Endpoint reads must not inherit Environment contracts')
for (const status of ['200', '401', '402', '403', '404']) {
  assert.match(getEndpointOperation, new RegExp(`'${status}':`), `Endpoint reads must document ${status} responses`)
}
for (const method of ['patch', 'post']) {
  const next = method === 'patch' ? 'post' : 'delete'
  const operation = endpointResourcePath.match(new RegExp(`^    ${method}:\\n[\\s\\S]*?(?=^    ${next}:)`, 'm'))?.[0] ?? ''
  assert.match(operation, /UpdateEndpointRequest/, `${method.toUpperCase()} Endpoint updates must use the implemented request schema`)
  assert.doesNotMatch(operation, /UpdateEnvironmentRequest|Environment updated/, `${method.toUpperCase()} Endpoint updates must not inherit Environment contracts`)
  for (const status of ['200', '400', '401', '402', '403', '404', '409', '422', '500']) {
    assert.match(operation, new RegExp(`'${status}':`), `${method.toUpperCase()} Endpoint updates must document ${status} responses`)
  }
  assert.match(operation, /'401':[\s\S]*?TaskCostError/, `${method.toUpperCase()} Endpoint updates must document the implemented string-error envelope for authentication failures`)
}
const deleteEndpointOperation = endpointResourcePath.match(/^    delete:\n[\s\S]*/m)?.[0] ?? ''
assert.match(deleteEndpointOperation, /required: \[id, deleted\]/, 'Endpoint deletion must use its implemented response projection')
assert.doesNotMatch(deleteEndpointOperation, /environment_deleted|EnvironmentId/, 'Endpoint deletion must not inherit Environment contracts')
for (const status of ['200', '401', '402', '403', '404', '500']) {
  assert.match(deleteEndpointOperation, new RegExp(`'${status}':`), `Endpoint deletion must document ${status} responses`)
}
assert.match(deleteEndpointOperation, /'401':[\s\S]*?TaskCostError/, 'Endpoint deletion must document the implemented string-error envelope for authentication failures')
const endpointACPPath = openapi.match(/^  \/v1\/endpoints\/\{id\}\/acp:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(endpointACPPath, /ACPRequest/, 'Endpoint ACP must document its JSON-RPC request envelope')
assert.match(endpointACPPath, /application\/x-ndjson:/, 'Endpoint ACP must document prompt streaming as NDJSON')
for (const status of ['200', '400', '401', '402', '403', '404', '500']) {
  assert.match(endpointACPPath, new RegExp(`'${status}':`), `Endpoint ACP must document ${status} responses`)
}
const acpRequestSchema = openapi.match(/^    ACPRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(acpRequestSchema, /enum: \[initialize, session\/new, session\/prompt, session\/cancel\]/, 'Endpoint ACP must document every implemented method')
const acpResponseSchema = openapi.match(/^    ACPResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(acpResponseSchema, /oneOf:\n\s+- required: \[result\]\n\s+- required: \[error\]/, 'Endpoint ACP must distinguish JSON-RPC success and error responses')
const endpointRunPath = openapi.match(/^  \/v1\/endpoints\/\{id\}\/run:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const status of ['202', '400', '401', '402', '403', '404', '409', '500', '503']) {
  assert.match(endpointRunPath, new RegExp(`'${status}':`), `Endpoint REST invocation must document ${status} responses`)
}
for (const status of ['422', '502']) {
  assert.doesNotMatch(endpointRunPath, new RegExp(`'${status}':`), `Endpoint REST invocation must not document unimplemented direct ${status} responses`)
}
assert.match(endpointRunPath, /When both input and content are supplied, content takes precedence/, 'Endpoint REST invocation must document implemented input precedence')
const endpointInvokeRequest = openapi.match(/^    EndpointInvokeRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(endpointInvokeRequest, /- type: object\n\s+additionalProperties: true/, 'Endpoint REST invocation must allow a single content block object')
const endpointInvokeAccepted = openapi.match(/^    EndpointInvokeAccepted:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(endpointInvokeAccepted, /EndpointAcceptedEvent/, 'Endpoint REST acceptance must use its emitted compact event projection')
const endpointAcceptedEvent = openapi.match(/^    EndpointAcceptedEvent:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(endpointAcceptedEvent, /required: \[id, type, processed_at\]/, 'Endpoint REST accepted events must require exactly their emitted identity fields')
for (const field of ['memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:[\\s\\S]*?not currently applied to Session execution`), `Endpoint ${field} must be documented as reserved`)
}
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
assert.match(sidebar, /\/api-reference\/models\/upload/, 'Sidebar must link to the media upload reference')
assert.match(openapi, /type:\s*\{ type: string, const: environment_deleted \}/, 'Environment deletion must document its response discriminator')
assert.doesNotMatch(openapi, /^  \/default\/v1(?:\/|:)/m, 'Internal Console paths must not be public')

const unpublishedFiles = new Set([
  'api-reference/webhooks.md',
  'guides/site-agent-integration.md',
  'use-cases/site-agent-copilot.md',
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
    assert.doesNotMatch(content, /\/default\/v1(?:\/|\b)/, `${relative} must not expose internal Console API paths`)
    assert.doesNotMatch(content, /\/v1\/generations(?:\/|\b)/, `${relative} must not expose the withdrawn generation path`)
    assert.doesNotMatch(content, /\/events\/webhooks(?:\/|\b)/, `${relative} must not expose Sandbox event webhook paths`)
    assert.doesNotMatch(content, /\brun_abc123\b/, `${relative} must not assume a run ID prefix`)
    assert.doesNotMatch(content, /\btask_abc123\b/, `${relative} must not assume a task ID prefix`)
    assert.doesNotMatch(content, /\bcred_01/, `${relative} must use the implemented sec_ Managed Credential ID prefix`)
    assert.doesNotMatch(content, /Default:\s*60 requests\/min,\s*5 concurrent/i, `${relative} must not publish obsolete universal rate limits`)
    assert.doesNotMatch(content, /rate_limited[^\n]*Retry-After header/i, `${relative} must not claim public 429 responses include Retry-After`)
    assert.doesNotMatch(content, /"next_page": null/, `${relative} must omit next_page on a final page`)
    assert.doesNotMatch(content, /POST \/v1\/(?:chat\/completions|embeddings)[^\n]*Bearer or x-api-key/i, `${relative} must not claim standard gateways accept x-api-key`)
    if (relative.startsWith('model-api-reference/') && content.includes('"path":"/v1/run"')) {
      assert.doesNotMatch(content, /Error message if the task failed\. Empty on success\./, `${relative} must use the structured public run error`)
      assert.doesNotMatch(content, /Array of generated content\. Empty when status is not completed\./, `${relative} must omit outputs from non-terminal run responses`)
      if (!relative.startsWith('model-api-reference/platform-apis/')) {
        assert.doesNotMatch(content, /Contains exactly one item whose only field is data\./, `${relative} must not apply the Platform API data envelope to media outputs`)
      }
    }
    assert.doesNotMatch(content, /\/(?:v1\/)?sandboxes?(?:\/|\{|:|\b)/i, `${relative} must not expose sandbox API paths`)
    assert.doesNotMatch(content, /\/v1\/endpoints\/[^\s`"']+\/mcp\b/i, `${relative} must not expose Endpoint MCP transport`)
    assert.doesNotMatch(content, /\/v1\/endpoint_runtime_profiles\b/i, `${relative} must not expose Endpoint runtime profiles that reveal MCP transport`)
    assert.doesNotMatch(content, /\/v1\/mcp(?:\/|\b)/i, `${relative} must not expose the generic MCP transport or its discovery routes`)
    assert.doesNotMatch(content, /\/v1\/mcp\/(?:servers|[^\s/]+\/config)\b/i, `${relative} must not expose MCP discovery or runtime config routes`)
    assert.doesNotMatch(content, /\/mcp\/[^\s/]+\/sse\b/i, `${relative} must not expose the MCP SSE proxy`)
    assert.doesNotMatch(content, /\/v1\/skills\/[^\s/]+\/mcp-publications\b/i, `${relative} must not expose Skill MCP publication creation`)
    assert.doesNotMatch(content, /\/v1\/skill-mcp-publications(?:\/[^\s/]+)?\b/i, `${relative} must not expose Skill MCP publication management`)
    assert.doesNotMatch(content, /\/v1\/capabilities\/[^\s/]+\/mcp\b/i, `${relative} must not expose Capability MCP transport`)
    assert.doesNotMatch(content, /\/v1\/skill-mcp\/[^\s/]+\/mcp\b/i, `${relative} must not expose published Skill MCP transport`)
  }
}

inspectPublishedSources(root)

console.log('public API surface: ok')
