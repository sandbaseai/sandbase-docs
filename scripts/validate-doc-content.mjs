import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const roots = ['admin', 'agents', 'api-reference', 'for-agents', 'getting-started', 'guides', 'models', 'setup', 'store']
const excluded = [
  'agents/deployments.md',
  'agents/endpoint-quickstart.md',
  'api-reference/embeds/',
  'api-reference/environments/',
  'api-reference/webhooks.md',
  'guides/site-agent-integration.md',
]

const files = ['index.md']
function isExcluded(filename) {
  return excluded.some((entry) => filename === entry || filename.startsWith(entry))
}
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (isExcluded(filename)) continue
    if (entry.isDirectory()) collect(filename)
    else if (entry.name.endsWith('.md')) files.push(filename)
  }
}
for (const root of roots) collect(root)

const forbidden = [
  [/\/v1\/generations\b/, 'retired generations API'],
  [/\/v1\/environments\b/, 'non-public Environment management API'],
  [/\/v1\/embeds\b/, 'retired Embed Config API'],
  [/\/v1\/endpoints\/\{[^}]+\}\/mcp\b/, 'non-public Endpoint MCP transport'],
  [/https:\/\/api\.sandbase\.ai\/sandboxes\b/, 'non-public Sandbox API'],
  [/\bEmbed Configs?\b/i, 'retired Embed Config product'],
  [/\bEndpoints API\b/, 'legacy product label; use Services API'],
  [/\bDeployments API\b/, 'legacy product label; use Schedules API'],
  [/openai\/gpt-4o\b/, 'stale hand-written example model'],
  [/anthropic\/claude-sonnet-4(?:-|\b)/, 'stale hand-written example model'],
  [/GET \/v1\/models\/\{name\}/, 'incorrect model detail path parameter'],
  [/\/docs\/setup\/cli\b/, 'retired setup alias'],
  [/\]\(\/store\/models\/?(?:[)#])/, 'duplicate Models page link; use /models/'],
]

let inspected = 0
for (const filename of files) {
  const source = readFileSync(filename, 'utf8')
  for (const [pattern, label] of forbidden) {
    assert.ok(!pattern.test(source), `${filename} exposes ${label}: ${pattern}`)
  }
  inspected += 1
}

assert.ok(inspected > 0, 'content validation did not inspect any public hand-written pages')
console.log(`public hand-written content: ok (${inspected} pages)`)
