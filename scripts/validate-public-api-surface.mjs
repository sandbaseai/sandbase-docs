import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const openapi = readFileSync(new URL('../public/openapi.yaml', import.meta.url), 'utf8')
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
  '/v1/upload:',
  '/v1/account/balance:',
  '/v1/account/history:',
  '/v1/embeds:',
  '/v1/embeds/{id}:',
  '/v1/embeds/{id}/usage:',
  '/v1/responses:',
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
assert.doesNotMatch(openapi, /^  \/events\/webhooks(?:\/\{[^}]+\})?:$/m, 'Sandbox event webhook paths must not be public')
assert.doesNotMatch(openapi, /pattern:\s*['"]?\\?\^run_/, 'Run IDs must remain opaque')
const getRunPath = openapi.match(/^  \/v1\/run\/\{id\}:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.doesNotMatch(getRunPath, /pattern:/, 'Run result lookup IDs must not inherit another resource prefix')
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
for (const status of ['402', '500', '502', '503']) {
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
assert.match(messagesPath, /AnthropicError/, 'Messages must document the Anthropic error envelope')
assert.equal((openapi.match(/AnthropicApiKey:/g) ?? []).length, 2, 'Anthropic x-api-key authentication must be scoped only to Messages')
assert.match(openapi, /AnthropicApiKey:\n\s+type: apiKey\n\s+in: header\n\s+name: x-api-key/, 'AnthropicApiKey must describe the x-api-key header')
const embeddingRequestSchema = openapi.match(/^    EmbeddingRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(embeddingRequestSchema, /additionalProperties: true/, 'Embedding requests must preserve provider-compatible fields')
assert.doesNotMatch(embeddingRequestSchema, /enum: \[2048, 1536/, 'Embeddings must not publish an unimplemented universal dimensions list')
assert.match(embeddingRequestSchema, /enum: \[float, base64\]/, 'Embeddings must document supported OpenAI encoding forms')
assert.match(embeddingRequestSchema, /items:\n\s+type: array\n\s+items:\n\s+type: integer/, 'Embeddings must allow batched token-ID input')
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
const deploymentsPath = openapi.match(/^  \/v1\/deployments:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(deploymentsPath, /name: status\n\s+in: query\n\s+style: form\n\s+explode: true\n\s+schema:\n\s+type: array/, 'Deployment status filters must be repeatable')
const deploymentRunsPath = openapi.match(/^  \/v1\/deployment_runs:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
for (const field of ['trigger_type', 'status']) {
  assert.match(deploymentRunsPath, new RegExp(`name: ${field}\\n\\s+in: query[\\s\\S]*?type: array`), `DeploymentRun ${field} filters must be repeatable`)
}
const feishuTestPath = openapi.match(/^  \/v1\/deployments\/\{id\}\/notifications\/feishu\/test:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(feishuTestPath, /maxProperties: 0/, 'Feishu notification tests must reject custom request fields')
assert.match(feishuTestPath, /This endpoint never accepts a webhook URL or custom message/, 'Feishu notification tests must document the saved-target-only boundary')
for (const status of ['200', '400', '401', '404', '409', '502']) {
  assert.match(feishuTestPath, new RegExp(`'${status}':`), `Feishu notification test must document ${status} responses`)
}
const updateDeploymentSchema = openapi.match(/^    UpdateDeploymentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(updateDeploymentSchema, /notification_settings:\n\s+type: \[object, 'null'\]/, 'Deployment notifications must allow null to clear the saved target')
assert.match(updateDeploymentSchema, /required: \[feishu_webhook_url\]/, 'A non-null notification_settings object must contain only its implemented webhook field')
assert.match(updateDeploymentSchema, /pattern: '\^https:\/\/open\\\.feishu\\\.cn\/open-apis\/bot\/v2\/hook\//, 'Deployment notifications must publish the enforced Feishu webhook origin and path')
assert.match(sidebar, /\/api-reference\/deployments\/test-feishu-notification/, 'Sidebar must link to the Feishu notification test reference')
assert.match(sidebar, /\/api-reference\/endpoints\/acp/, 'Sidebar must link to the Endpoint ACP reference')
const agentSchema = openapi.match(/^    Agent:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['tools', 'mcp_servers', 'skills', 'handoffs']) {
  assert.match(agentSchema, new RegExp(`${field}:\\n\\s+type: \\[array, 'null'\\]`), `Agent ${field} must allow the serializer's null output`)
}
assert.match(agentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Agent metadata must allow the serializer\'s null output')
assert.doesNotMatch(agentSchema, /^        (?:runtime_profile|multiagent):/m, 'Agent responses must not advertise fields omitted by the serializer')
assert.match(agentSchema, /required: \[id, type, name, description, model, system, tools, mcp_servers, skills, handoffs, metadata, version, created_at, updated_at, archived_at\]/, 'Agent responses must require every field always emitted by the serializer')
assert.match(agentSchema, /effort:\n\s+oneOf:\n\s+- type: string/, 'Agent model effort responses must allow the implemented string form')
const updateAgentSchema = openapi.match(/^    UpdateAgentRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['tools', 'skills', 'mcp_servers', 'handoffs']) {
  assert.match(updateAgentSchema, new RegExp(`${field}:\\n\\s+type: \\[array, 'null'\\]`), `Agent update ${field} must allow explicit null replacement`)
}
assert.match(updateAgentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Agent update metadata must allow explicit null replacement')
const updateAgentReference = readFileSync(new URL('../api-reference/agents/update.md', import.meta.url), 'utf8')
assert.match(updateAgentReference, /null is treated as omitted and preserves the current value/, 'Agent string updates must document their implemented null semantics')
assert.doesNotMatch(updateAgentReference, /Send null or an empty string to clear/, 'Agent string updates must not claim null clears pointer fields')
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
const modelCardSchema = openapi.match(/^    ModelCard:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(modelCardSchema, /cache_write_1h_multiplier:/, 'Model cards must include the implemented one-hour cache multiplier')
assert.match(modelCardSchema, /required: \[[^\]]*cache_write_1h_multiplier[^\]]*cover_url[^\]]*\]/, 'Present model cards must require every serializer field')
const modelGetReference = generatedReferenceSpecs.match(/"models\/get": \{[\s\S]*?(?=\n  "models\/image")/)?.[0] ?? ''
assert.match(modelGetReference, /"required": true/, 'Get Model must require its path parameter')
assert.doesNotMatch(modelGetReference, /model_01/, 'Get Model examples must not invent a model_ ID prefix')
const accountBalanceSchema = openapi.match(/^    AccountBalance:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(accountBalanceSchema, /required: \[org_id, balance, credit_limit, alert_threshold\]/, 'Account balance must require every emitted field')
assert.match(accountBalanceSchema, /credit_limit:\n\s+oneOf:[\s\S]*?- type: 'null'/, 'Account credit limit must allow null')
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
const updateEmbedSchema = openapi.match(/^    UpdateEmbedConfigRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.doesNotMatch(updateEmbedSchema, /^        (?:agent_id|environment_id):/m, 'Embed updates must not advertise immutable bindings')
assert.match(updateEmbedSchema, /null values preserve the current value/, 'Embed updates must document implemented null semantics')
const environmentSchema = openapi.match(/^    Environment:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(environmentSchema, /config:\n[\s\S]*?- type: 'null'/, 'Environment config must allow the serializer\'s null output')
assert.match(environmentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Environment metadata must allow the serializer\'s null output')
assert.match(environmentSchema, /credential_bindings:\n\s+type: \[array, 'null'\]/, 'Environment credential bindings must allow the serializer\'s null output')
const endpointSchema = openapi.match(/^    Endpoint:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['session_metadata', 'memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:\\n\\s+type: \\[object, 'null'\\]`), `Endpoint ${field} must allow the serializer's null output`)
}
assert.match(endpointSchema, /store_status:\n\s+type: string\n\s+enum: \[private, pending_review, public, suspended\]/, 'Endpoint responses must document the serializer\'s store status')
assert.doesNotMatch(endpointSchema, /protocols:[\s\S]*?enum: \[rest, acp\]/, 'Endpoint responses must not claim internal transport values are normalized to the public request enum')
for (const schemaName of ['CreateDeclarativeEndpointRequest', 'CreateAdvancedEndpointRequest']) {
  const schema = openapi.match(new RegExp(`^    ${schemaName}:\\n[\\s\\S]*?(?=^    [A-Za-z])`, 'm'))?.[0] ?? ''
  assert.match(schema, /required: \[[^\]]*protocols[^\]]*\]/, `${schemaName} must require explicit public protocols to avoid hidden transport defaults`)
  assert.match(schema, /protocols:\n\s+type: array\n\s+minItems: 1\n\s+uniqueItems: true/, `${schemaName} must require a non-empty unique protocol list`)
  assert.match(schema, /enum: \[rest, acp\]/, `${schemaName} must expose only public invocation transports`)
  assert.doesNotMatch(schema, /default: \[rest\]/, `${schemaName} must not claim an unimplemented REST-only server default`)
}
const endpointACPPath = openapi.match(/^  \/v1\/endpoints\/\{id\}\/acp:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(endpointACPPath, /ACPRequest/, 'Endpoint ACP must document its JSON-RPC request envelope')
assert.match(endpointACPPath, /application\/x-ndjson:/, 'Endpoint ACP must document prompt streaming as NDJSON')
for (const status of ['200', '400', '401', '404', '500']) {
  assert.match(endpointACPPath, new RegExp(`'${status}':`), `Endpoint ACP must document ${status} responses`)
}
const acpRequestSchema = openapi.match(/^    ACPRequest:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(acpRequestSchema, /enum: \[initialize, session\/new, session\/prompt, session\/cancel\]/, 'Endpoint ACP must document every implemented method')
const acpResponseSchema = openapi.match(/^    ACPResponse:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(acpResponseSchema, /oneOf:\n\s+- required: \[result\]\n\s+- required: \[error\]/, 'Endpoint ACP must distinguish JSON-RPC success and error responses')
for (const field of ['memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:[\\s\\S]*?not currently applied to Session execution`), `Endpoint ${field} must be documented as reserved`)
}
const assetRegistrationPath = openapi.match(/^  \/v1\/assets:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(assetRegistrationPath, /responses:\n\s+'200':/, 'Asset registration must document the implemented 200 response')
assert.doesNotMatch(assetRegistrationPath, /\s+'201':/, 'Asset registration must not document an unimplemented 201 response')
for (const status of ['400', '401', '500', '502']) {
  assert.match(assetRegistrationPath, new RegExp(`'${status}':`), `Asset registration must document ${status} responses`)
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
for (const status of ['200', '400', '401', '500', '503']) {
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
  }
}

inspectPublishedSources(root)

console.log('public API surface: ok')
