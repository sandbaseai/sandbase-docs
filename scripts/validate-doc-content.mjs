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
  'setup/cli.md',
  'setup/groups.md',
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
  [/sandbaseai-cli-\d+\.\d+\.\d+\.tgz/, 'version-pinned CLI archive; use the guided installer'],
  [/\bPlatform Groups?\b/, 'retired Platform Groups product label'],
  [/^## What are Environments\?$/m, 'internal Environment product navigation'],
  [/\]\(\/store\/models\/?(?:[)#])/, 'duplicate Models page link; use /models/'],
  [/\bNew accounts receive\b[^\n]*\bfree credits\b/i, 'time-sensitive signup credit claim'],
  [/\$\d+(?:\.\d+)?\s+minimum/i, 'time-sensitive minimum payment claim'],
  [/\b(?:Apple Pay|Google Pay)\b/, 'time-sensitive payment-method claim'],
  [/\bSandBase auto-terminates at \d+s silence\b/i, 'undocumented fixed streaming timeout'],
]

let inspected = 0
for (const filename of files) {
  const source = readFileSync(filename, 'utf8')
  for (const [pattern, label] of forbidden) {
    assert.ok(!pattern.test(source), `${filename} exposes ${label}: ${pattern}`)
  }
  inspected += 1
}

for (const filename of [
  'guides/anthropic-messages.md',
  'guides/chat-completions.md',
  'guides/error-handling.md',
  'guides/rate-limiting.md',
  'guides/streaming.md',
]) {
  const source = readFileSync(filename, 'utf8')
  assert.doesNotMatch(source, /(?:api_key\s*=|apiKey:|Authorization:\s*Bearer)\s*['"]?sk-/i, `${filename} must read API keys from SANDBASE_API_KEY`)
}

const streamingLines = readFileSync('guides/streaming.md', 'utf8').split('\n').length
assert.ok(streamingLines < 250, 'Streaming guide must stay focused; move protocol detail to the API reference')

const guidesIndex = readFileSync('guides/index.md', 'utf8')
for (const link of ['./chat-completions', './anthropic-messages', './streaming', './error-handling', './rate-limiting', './billing']) {
  assert.ok(guidesIndex.includes(`](${link})`), `Guides index must link to ${link}`)
}

const organizationsGuide = readFileSync('admin/organizations.md', 'utf8')
assert.doesNotMatch(organizationsGuide, /Console → Settings[\s\S]{0,80}Create Team/, 'Team creation must use the current Team or Create Team navigation')
assert.match(organizationsGuide, /existing SandBase account/, 'Organization guide must explain the current member prerequisite')

const billingGuide = readFileSync('guides/billing.md', 'utf8')
assert.doesNotMatch(billingGuide, /Console → Usage/, 'Usage is a tab under Console Activities')
assert.match(billingGuide, /Console → Activities → Usage/, 'Billing guide must use the current Usage navigation')

const billingAdmin = readFileSync('admin/billing.md', 'utf8')
assert.doesNotMatch(billingAdmin, /\| Alert threshold \|/, 'Billing docs must not expose a Console control that is not currently rendered')
assert.match(billingAdmin, /Request History[\s\S]+Usage/, 'Billing docs must describe the current Activities tabs')

assert.ok(inspected > 0, 'content validation did not inspect any public hand-written pages')
console.log(`public hand-written content: ok (${inspected} pages)`)
