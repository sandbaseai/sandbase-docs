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
assert.doesNotMatch(sidebar, /\/api-reference\/sandboxes?\b/i, 'Sidebar must not link to sandbox API pages')
assert.doesNotMatch(openapi, /^  \/v1\/endpoints\/\{[^}]+\}\/mcp:$/m, 'Endpoint MCP transport must not be public')

const unpublishedFiles = new Set([
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
    assert.doesNotMatch(content, /\/(?:v1\/)?sandboxes?(?:\/|\{|:|\b)/i, `${relative} must not expose sandbox API paths`)
    assert.doesNotMatch(content, /\/v1\/endpoints\/[^\s`"']+\/mcp\b/i, `${relative} must not expose Endpoint MCP transport`)
  }
}

inspectPublishedSources(root)

console.log('public API surface: ok')
