import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const keyGuide = readFileSync('getting-started/api-keys.md', 'utf8')
const authentication = readFileSync('api-reference/authentication.md', 'utf8')
const errors = readFileSync('api-reference/errors.md', 'utf8')
const firstCall = readFileSync('getting-started/first-call.md', 'utf8')
const sidebar = readFileSync('.vitepress/sidebar.ts', 'utf8')
const config = readFileSync('.vitepress/config.ts', 'utf8')
const openapi = readFileSync('public/openapi.yaml', 'utf8')
const publicAuth = `${keyGuide}\n${authentication}\n${errors}\n${firstCall}`

assert.ok(!existsSync('admin/api-keys.md'), 'duplicate admin API Keys guide must stay removed')
assert.match(config, /'admin\/api-keys\.md'/, 'duplicate admin API Keys route must stay excluded from the public build')
assert.equal((sidebar.match(/link: '\/getting-started\/api-keys'/g) ?? []).length, 1, 'Docs sidebar must expose one canonical API Keys guide')
assert.doesNotMatch(sidebar, /\/admin\/api-keys\b/, 'Docs sidebar must not link the retired API Keys duplicate')

for (const required of [
  'Developer → API Keys',
  'New key',
  'Create key',
  'A revoked key cannot be re-enabled',
  'Authorization: Bearer $SANDBASE_API_KEY',
  'POST /v1/messages',
  'x-api-key',
  'x-goog-api-key',
]) {
  assert.ok(publicAuth.includes(required), `Authentication documentation must include: ${required}`)
}

assert.doesNotMatch(publicAuth, /re-enable (?:the )?(?:existing )?key/i, 'revoked keys must never be described as recoverable')
assert.doesNotMatch(firstCall, /apiKey:\s*['"]sk-/i, 'First-call SDK examples must read API keys from the environment')
assert.doesNotMatch(firstCall, /api_key\s*=\s*['"]sk-/, 'First-call SDK examples must read API keys from the environment')
assert.doesNotMatch(errors, /Add `Authorization: Bearer sk-sb-/, 'error guidance must treat API key formats as opaque')
assert.doesNotMatch(openapi, /description: "API key with `sk-sb-` prefix"/, 'OpenAPI bearer authentication must treat keys as opaque')
assert.doesNotMatch(openapi, /example: "gpt-4o"/, 'OpenAPI must not publish a stale example model')
assert.doesNotMatch(openapi, /Agents and Sessions.*Use Anthropic SDK/, 'OpenAPI must not map SandBase resource APIs to the Anthropic SDK')

console.log('Authentication docs: ok (one key guide, current Console flow, irreversible revocation)')
