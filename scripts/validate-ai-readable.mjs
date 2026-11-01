import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const aiFiles = [
  'for-agents/index.md',
  'for-agents/full.md',
  'for-agents/models.md',
  'for-agents/errors.md',
  'public/llms.txt',
  'public/llms-full.txt',
]

const sources = new Map(aiFiles.map((filename) => [filename, readFileSync(filename, 'utf8')]))
const combined = [...sources.values()].join('\n')

const forbidden = [
  ['/v1/generations', 'retired generations API'],
  ['/docs/setup/cli', 'retired CLI alias'],
  ['/v1/endpoints/{id}/mcp', 'non-public Endpoint MCP transport'],
  ['/v1/environments', 'non-public Environment management API'],
  ['openai/gpt-4o', 'stale example model'],
  ['anthropic/claude-sonnet-4-20250514', 'stale example model'],
  ['bfl/flux-1/schnell', 'stale example model'],
  ['GET /v1/models/{name}', 'incorrect model detail path parameter'],
  ['/v1/sessions', 'retired Session path; use /v1/agents/sessions'],
  ['/v1/deployments', 'retired Deployment API'],
  ['/v1/deployment_runs', 'retired DeploymentRun API'],
  ['/v1/endpoints', 'retired Endpoint API'],
  ['/v1/credentials', 'retired Credentials API; use /v1/secrets'],
  ['/v1/skills/files', 'retired Skill file upload'],
  ['/v1/services', 'retired Services API'],
  ['/v1/schedules', 'retired Schedules API'],
  ['/agents/services', 'removed Services guide'],
  ['/agents/schedules', 'removed Schedules guide'],
  ['/api-reference/services/', 'removed Services API reference'],
  ['/api-reference/schedules/', 'removed Schedules API reference'],
  ['/docs/store/', 'removed docs catalog page'],
  ['/docs/models/', 'removed docs catalog page; use https://www.sandbase.ai/models'],
  ['/model-api-reference/llm-models', 'removed per-model reference; use the main-site model page'],
  ['/model-api-reference/image-generation', 'removed per-model reference; use the main-site model page'],
  ['/model-api-reference/video-generation', 'removed per-model reference; use the main-site model page'],
  ['/model-api-reference/audio-generation', 'removed per-model reference; use the main-site model page'],
  ['/model-api-reference/platform-apis', 'removed per-API reference; use the main-site API page'],
  ['drun_', 'retired DeploymentRun ID prefix'],
  ['depl_', 'retired Deployment ID prefix'],
  ['initial_events', 'retired Deployment field'],
  ['user.message', 'retired Session event type'],
]

for (const [needle, label] of forbidden) {
  assert.ok(!combined.includes(needle), `${label} must not appear in AI-readable documentation: ${needle}`)
}

assert.ok(!/Anthropic 90%|OpenAI 50%|Google 75%|up to 90% discount/i.test(combined), 'fixed cache discount claims must not appear')
assert.ok(!/\b\d[\d,]*\+\s+(?:AI\s+)?models and APIs\b/i.test(combined), 'time-sensitive catalog counts must not appear')
assert.ok(!/flat `?base_price`? per generation/i.test(combined), 'AI-readable docs must not generalize one media pricing formula')
assert.ok(!/spend alerts|budget alerts|Console → Usage/i.test(combined), 'AI-readable docs must use current spending controls and Activities navigation')
assert.ok(!/Supports streaming, function calling, vision, JSON mode/i.test(combined), 'AI-readable docs must keep optional chat capabilities model-specific')
assert.ok(!/provide it to continue that Session/.test(combined), 'AI-readable docs must not omit version checks for Session continuation')
assert.ok(!/\b(?:Services?|Schedules?) (?:API|product)\b/.test(combined), 'AI-readable docs must not describe the retired Services or Schedules products')

for (const required of [
  'https://www.sandbase.ai/docs/openapi.yaml',
  'GET /v1/models',
  'GET /v1/models/{id_or_name}',
  'GET /v1/run/{id}',
  'GET /v1/tasks/{id}/cost',
  'POST /v1/agents/sessions',
]) {
  assert.ok(combined.includes(required), `AI-readable documentation must include ${required}`)
}

// Per-model reference pages now live on the main site, so examples can only be
// checked for the public vendor/model identifier shape here.
const exampleModelIds = new Set()
for (const source of sources.values()) {
  for (const match of source.matchAll(/"model"\s*:\s*"([^"<][^"]*)"/g)) exampleModelIds.add(match[1])
}
for (const modelId of exampleModelIds) {
  assert.match(modelId, /^[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/, `AI-readable example model must use a vendor/model identifier: ${modelId}`)
}
assert.ok(sources.get('for-agents/full.md').includes('complete machine-readable contract'), 'AI API Guide must identify OpenAPI as the complete contract')
assert.ok(sources.get('public/llms-full.txt').includes('complete machine-readable contract'), 'llms-full.txt must identify OpenAPI as the complete contract')

console.log(`AI-readable docs: ok (${aiFiles.length} files, ${exampleModelIds.size} vendor/model example IDs)`)
