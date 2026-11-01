import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const roots = ['admin', 'agents', 'sandbox', 'api-reference', 'for-agents', 'getting-started', 'guides', 'setup']
const excluded = [
  'agents/endpoint-quickstart.md',
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
  [/\b(?:GET|POST|PUT|PATCH|DELETE) \/v1\/(?:sessions|endpoints|deployments|deployment_runs|credentials|skills\/files)\b/, 'retired Agents route; use the sandbase-agents resources'],
  [/\bdrun_|\bdepl_|\binitial_events\b|"user\.message"/, 'retired Deployment or Session contract'],
  [/https:\/\/api\.sandbase\.ai\/sandboxes\b/, 'non-public Sandbox API'],
  [/\bEmbed Configs?\b/i, 'retired Embed Config product'],
  [/\bEndpoints API\b/, 'retired Endpoint API product label'],
  [/\bDeployments API\b/, 'retired Deployment API product label'],
  [/\bPublished Agents?\b/, 'retired Published Agent product label'],
  [/\b(?:Services|Schedules) API\b/, 'retired Services or Schedules API product label'],
  [/\b(?:GET|POST|PUT|PATCH|DELETE) \/v1\/(?:services|schedules)\b/, 'retired Services or Schedules route'],
  [/https:\/\/api\.sandbase\.ai\/v1\/(?:services|schedules)\b/, 'retired Services or Schedules route'],
  [/\]\((?:\/docs)?\/agents\/(?:services|schedules|deployments)\b/, 'link to a removed Services, Schedules, or Deployments guide'],
  [/\]\((?:\/docs)?\/api-reference\/(?:services|schedules|deployments|endpoints|credentials)\//, 'link to a removed Agents API reference'],
  [/\]\((?:\/docs)?\/(?:store|models)\//, 'link to a removed docs catalog page; use the main-site catalog'],
  [/\]\((?:\/docs)?\/model-api-reference\b/, 'link to the removed Model API Reference; use the API reference or the main-site model or API page'],
  [/\bSeedance Native API\b/, 'legacy provider-native API label; use Official Native API'],
  [/openai\/gpt-4o\b/, 'stale hand-written example model'],
  [/openai\/gpt-5\.4\b/, 'stale hand-written example model'],
  [/anthropic\/claude-sonnet-4(?:-|\b)/, 'stale hand-written example model'],
  [/deepseek\/deepseek-v3\b/, 'stale hand-written example model'],
  [/gemini-2\.5-flash\b/, 'stale hand-written example model'],
  [/GET \/v1\/models\/\{name\}/, 'incorrect model detail path parameter'],
  [/\/v1\/tasks\/\{id\}\/cost/, 'incorrect task cost path parameter'],
  [/\/docs\/setup\/cli\b/, 'retired setup alias'],
  [/\/docs\/docs\//, 'duplicated docs base path'],
  [/sandbaseai-cli-\d+\.\d+\.\d+\.tgz/, 'version-pinned CLI archive; use the guided installer'],
  [/\bPlatform Groups?\b/, 'retired Platform Groups product label'],
  [/^## What are Environments\?$/m, 'internal Environment product navigation'],
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
assert.doesNotMatch(billingGuide, /(?:Console|Developer) → Usage/, 'Usage is a tab under Console Activities')
assert.match(billingGuide, /Developer → Activities → Usage/, 'Billing guide must use the current Usage navigation')

const billingAdmin = readFileSync('admin/billing.md', 'utf8')
assert.doesNotMatch(billingAdmin, /\| Alert threshold \|/, 'Billing docs must not expose a Console control that is not currently rendered')
assert.match(billingAdmin, /Request History[\s\S]+Usage/, 'Billing docs must describe the current Activities tabs')
assert.match(billingAdmin, /Developer → Billing/, 'Billing docs must use the current sidebar entry')
assert.match(billingAdmin, /Buy credits[\s\S]+Payment provider[\s\S]+Continue with Stripe/, 'Billing docs must describe the current checkout labels (Stripe default, Airwallex optional)')
assert.match(billingAdmin, /Auto Top-up[\s\S]+Stripe/, 'Billing docs must describe auto top-up')
assert.doesNotMatch(billingAdmin, /Console Credits|Console → Billing|Add Credits|Continue with Airwallex, then/, 'Billing docs must not use retired Console labels')

const agentOverview = readFileSync('agents/index.md', 'utf8')
assert.doesNotMatch(agentOverview, /published endpoint/i, 'Agent guide must not use the retired published endpoint label')

const credentialGuide = readFileSync('agents/api-credentials.md', 'utf8')
assert.match(credentialGuide, /Credentials page, opened from the Agent editor/, 'Credentials is reached from the Agent editor, not the sidebar')
assert.doesNotMatch(credentialGuide, /Developer → Credentials/, 'Credentials is no longer a Developer sidebar entry')
assert.doesNotMatch(credentialGuide, /Agents → \[Your Agent\] → Credentials/, 'Credential guide must not use retired Agent-level navigation')
assert.match(credentialGuide, /mcp_bearer/, 'Credential guide must describe MCP Bearer Secrets')
assert.match(credentialGuide, /not environment variables/, 'Credential guide must not imply runtime environment injection')

const sessionsGuide = readFileSync('agents/sessions.md', 'utf8')
assert.match(sessionsGuide, /\/v1\/agents\/sessions/, 'Sessions guide must use the current Session path')
assert.match(sessionsGuide, /live-only/, 'Sessions guide must explain that the native stream is live-only')

const setupGuide = readFileSync('setup/index.md', 'utf8')
assert.doesNotMatch(setupGuide, /^The installer requires Node\.js 20 or newer\./m, 'Setup prerequisites must remain client-specific')
assert.match(setupGuide, /Developer → API Keys/, 'Setup removal must point to the current CLI Login key location')

const firstCallGuide = readFileSync('getting-started/first-call.md', 'utf8')
assert.doesNotMatch(firstCallGuide, /Every request to SandBase's LLM Gateway follows/, 'First call must not generalize one route to every LLM request')
assert.doesNotMatch(firstCallGuide, /The first chunk contains `delta\.role`/, 'Streaming guide must not require a provider-dependent first chunk')

const geminiInteractionsReference = readFileSync('api-reference/gemini-interactions.md', 'utf8')
assert.match(geminiInteractionsReference, /path: \/v1beta\/interactions|"path":"\/v1beta\/interactions"|\/v1beta\/interactions/, 'Gemini Interactions must document the native Interactions endpoint')
assert.match(geminiInteractionsReference, /google\/gemini-omni-flash-preview/, 'Gemini Interactions must list Gemini Omni')
assert.match(geminiInteractionsReference, /not a generic route for every model/, 'Gemini Interactions must not imply support for every Google model')
assert.match(geminiInteractionsReference, /Nano Banana Pro and Nano Banana 2 use\s+\[?`\/v1beta\/models\/\{model\}:generateContent`/, 'Gemini Interactions must direct image models to GenerateContent')
const geminiGenerateContentReference = readFileSync('api-reference/gemini-generate-content.md', 'utf8')
for (const model of ['gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-nano-banana-2.1']) {
  assert.match(geminiGenerateContentReference, new RegExp(`\`${model.replace(/\./g, '\\.')}\``), `GenerateContent must list the native ${model} mapping`)
}
assert.match(geminiGenerateContentReference, /inlineData/, 'GenerateContent must show how to edit an image with inlineData')
for (const filename of ['generations', 'edits']) {
  const imagesReference = readFileSync(`api-reference/images/${filename}.md`, 'utf8')
  for (const model of ['gpt-image-2.5-flare', 'gpt-image-2.5-sunburst', 'gpt-image-2']) {
    assert.match(imagesReference, new RegExp(`\`${model.replace(/\./g, '\\.')}\``), `Images ${filename} must list ${model}`)
  }
  assert.doesNotMatch(imagesReference, /model=?(?:"|')?openai\/gpt-image-2/, `Images ${filename} must not send an internal model name to the native endpoint`)
}
assert.match(readFileSync('api-reference/images/edits.md', 'utf8'), /images\/edits[\s\S]*-F "image=@/, 'Images edits must show a multipart edit request')
const runReference = readFileSync('api-reference/models/run.md', 'utf8')
assert.doesNotMatch(runReference, /webhook_url[^\n]*API tasks/i, 'Run reference must not promise callbacks for API capabilities')
assert.match(runReference, /webhook_url[^\n]*image, video, or audio tasks/i, 'Run reference must match webhook capability scope')
const openApiReference = readFileSync('public/openapi.yaml', 'utf8')
assert.doesNotMatch(openApiReference, /webhook_url:\n[\s\S]{0,180}?description:[^\n]*API tasks/i, 'OpenAPI must not promise callbacks for API capabilities')
assert.match(openApiReference, /webhook_url:\n[\s\S]{0,180}?description:[^\n]*image, video, or audio tasks/i, 'OpenAPI must match webhook capability scope')
const sidebarSource = readFileSync('.vitepress/sidebar.ts', 'utf8')
assert.doesNotMatch(sidebarSource, /model-api-reference|nativeApiReferenceSidebar/, 'Sidebar must not link the retired Model API Reference')
assert.doesNotMatch(sidebarSource, /seedance-native-api/i, 'Sidebar must not link the legacy Seedance native API page')
assert.match(sidebarSource, /link: '\/api-reference\/volcengine-contents-generations'/, 'API sidebar must link the Seedance protocol reference')
// Seedance: the protocol reference carries the full guide and the Asset workflow.
const seedanceReference = readFileSync('api-reference/volcengine-contents-generations.md', 'utf8')
assert.doesNotMatch(seedanceReference, /^robots:\s*noindex/m, 'Seedance reference must be indexable now that it is the only Seedance page')
assert.doesNotMatch(seedanceReference, /`DELETE`\s*\|\s*`\/api\/v3\/contents\/generations\/tasks/, 'Seedance reference must not document the removed task deletion')
assert.match(seedanceReference, /Listing tasks and cancelling or deleting a task are not supported/, 'Seedance reference must state that only create and retrieve are available')
assert.match(seedanceReference, /bytedance\/seedance\/2\.5-official[\s\S]*bytedance\/seedance\/2\.0-official/, 'Seedance reference must list both models')
assert.match(seedanceReference, /`POST \/v1\/assets`/, 'Seedance Asset workflow must document Asset registration')
assert.match(seedanceReference, /`GET \/v1\/assets\/\{external_id\}`/, 'Seedance Asset workflow must document Asset readiness lookup')
assert.match(seedanceReference, /asset:\/\/asset-/, 'Seedance Asset workflow must use the persistent Asset reference in a generation request')
assert.match(seedanceReference, /official-compatible Asset protocol/, 'Seedance Asset workflow must describe the official-compatible protocol boundary')
assert.match(seedanceReference, /passed through unchanged/, 'Seedance Asset workflow must state that asset references pass through unchanged')
assert.doesNotMatch(seedanceReference, /\/v1\/upload/, 'Seedance Asset workflow must not mix in the generic upload endpoint')
assert.doesNotMatch(seedanceReference, /POST \/api\/v3\/assets/, 'Seedance Asset workflow must not expose the internal Asset gateway')
assert.ok(inspected > 0, 'content validation did not inspect any public hand-written pages')
console.log(`public hand-written content: ok (${inspected} pages)`)
