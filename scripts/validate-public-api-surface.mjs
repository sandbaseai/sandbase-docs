import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const openapi = readFileSync(new URL('../public/openapi.yaml', import.meta.url), 'utf8')
const config = readFileSync(new URL('../.vitepress/config.ts', import.meta.url), 'utf8')
const sidebar = readFileSync(new URL('../.vitepress/sidebar.ts', import.meta.url), 'utf8')
const root = fileURLToPath(new URL('..', import.meta.url))

const forbiddenOpenApiPatterns = [
  [/^  \/sandboxes(?:[/{:]|$)/m, 'sandbox path'],
  [/^  - name: Sandboxes$/m, 'Sandboxes tag'],
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
  '/v1/responses:',
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
assert.doesNotMatch(openapi, /^  \/events\/webhooks(?:\/\{[^}]+\})?:$/m, 'Sandbox event webhook paths must not be public')
assert.doesNotMatch(openapi, /pattern:\s*['"]?\\?\^run_/, 'Run IDs must remain opaque')
assert.doesNotMatch(openapi, /next_page:\s*(?:\{[^\n]*type:\s*\[string, 'null'\]|\n\s+type:\s*\[string, 'null'\])/, 'List cursors must be omitted rather than returned as null')
const responsesPath = openapi.match(/^  \/v1\/responses:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(responsesPath, /additionalProperties: true/, 'Responses must preserve provider-compatible request fields')
assert.match(responsesPath, /text\/event-stream:/, 'Responses must document streaming output')
const messagesPath = openapi.match(/^  \/v1\/messages:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(messagesPath, /security:\n\s+- BearerAuth: \[\]\n\s+- AnthropicApiKey: \[\]/, 'Messages must support Bearer or x-api-key authentication')
assert.equal((openapi.match(/AnthropicApiKey:/g) ?? []).length, 2, 'Anthropic x-api-key authentication must be scoped only to Messages')
assert.match(openapi, /AnthropicApiKey:\n\s+type: apiKey\n\s+in: header\n\s+name: x-api-key/, 'AnthropicApiKey must describe the x-api-key header')
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
const agentSchema = openapi.match(/^    Agent:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['tools', 'mcp_servers', 'skills', 'handoffs']) {
  assert.match(agentSchema, new RegExp(`${field}:\\n\\s+type: \\[array, 'null'\\]`), `Agent ${field} must allow the serializer's null output`)
}
assert.match(agentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Agent metadata must allow the serializer\'s null output')
assert.doesNotMatch(agentSchema, /^        (?:runtime_profile|multiagent):/m, 'Agent responses must not advertise fields omitted by the serializer')
const sessionSchema = openapi.match(/^    Session:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(sessionSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Session metadata must allow the serializer\'s null output')
const environmentSchema = openapi.match(/^    Environment:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
assert.match(environmentSchema, /config:\n[\s\S]*?- type: 'null'/, 'Environment config must allow the serializer\'s null output')
assert.match(environmentSchema, /metadata:\n\s+type: \[object, 'null'\]/, 'Environment metadata must allow the serializer\'s null output')
assert.match(environmentSchema, /credential_bindings:\n\s+type: \[array, 'null'\]/, 'Environment credential bindings must allow the serializer\'s null output')
const endpointSchema = openapi.match(/^    Endpoint:\n[\s\S]*?(?=^    [A-Za-z])/m)?.[0] ?? ''
for (const field of ['session_metadata', 'memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:\\n\\s+type: \\[object, 'null'\\]`), `Endpoint ${field} must allow the serializer's null output`)
}
assert.match(endpointSchema, /store_status:\n\s+type: string\n\s+enum: \[private, pending_review, public, suspended\]/, 'Endpoint responses must document the serializer\'s store status')
for (const field of ['memory_config', 'resource_config', 'vault_config']) {
  assert.match(endpointSchema, new RegExp(`${field}:[\\s\\S]*?not currently applied to Session execution`), `Endpoint ${field} must be documented as reserved`)
}
const assetRegistrationPath = openapi.match(/^  \/v1\/assets:\n[\s\S]*?(?=^  \/)/m)?.[0] ?? ''
assert.match(assetRegistrationPath, /responses:\n\s+'200':/, 'Asset registration must document the implemented 200 response')
assert.doesNotMatch(assetRegistrationPath, /\s+'201':/, 'Asset registration must not document an unimplemented 201 response')
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
