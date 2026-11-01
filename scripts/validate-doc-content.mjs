import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'

const roots = ['admin', 'agents', 'sandbox', 'api-reference', 'for-agents', 'getting-started', 'guides', 'setup', 'model-api-reference']
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
  [/\]\((?:\/docs)?\/model-api-reference\/(?:platform-apis|llm-models|image-generation|video-generation|audio-generation)\b/, 'link to a removed per-model reference; use the main-site model or API page'],
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

// Official Native API pages embed API reference JSON; each request field must
// appear exactly once so the page cannot publish contradictory request forms.
function collectModelPages(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? collectModelPages(filename) : entry.name.endsWith('.md') ? [filename] : []
  })
}
for (const filename of collectModelPages('model-api-reference')) {
  const source = readFileSync(filename, 'utf8')
  assert.doesNotMatch(source, /Range: −∞ to|Range: [0-9.]+ to ∞/, `${filename} contains an unbounded constraint rendered as a fake range`)
  const frontmatter = source.split(/^---$/m)[1] ?? ''
  const metadata = parseYaml(frontmatter)
  if (!metadata?.apiReferenceJson) continue
  const reference = JSON.parse(metadata.apiReferenceJson)
  for (const group of reference.groups ?? []) {
    const names = (group.fields ?? []).map((field) => field.name)
    assert.equal(new Set(names).size, names.length, `${filename} repeats a field in ${group.title}`)
  }
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

const modelReference = readFileSync('model-api-reference/index.md', 'utf8')
assert.doesNotMatch(modelReference, /\b(?:All|Every) LLM models? uses? /i, 'Model reference must not claim every LLM uses one protocol')
assert.match(modelReference, /https:\/\/www\.sandbase\.ai\/models\/\{vendor\}\/\{model\}\/docs/, 'Model reference must explain where per-model references live')
assert.match(modelReference, /https:\/\/www\.sandbase\.ai\/apis\/\{vendor\}\/\{endpoint\}\/docs/, 'Model reference must explain where per-API references live')
assert.match(modelReference, /\[Anthropic Messages\]\(\/api-reference\/anthropic-compat\)/, 'Model reference must identify the Anthropic protocol')

const geminiOmniReference = readFileSync('model-api-reference/official-native-api/google/gemini-omni-flash-preview.md', 'utf8')
assert.match(geminiOmniReference, /path\\?\":\\?\"\/v1beta\/interactions/, 'Gemini Omni must use the native Interactions endpoint')
assert.doesNotMatch(geminiOmniReference, /path\\?\":\\?\"\/v1\/chat\/completions/, 'Gemini Omni must not advertise Chat Completions')

const geminiInteractionsReference = readFileSync('api-reference/gemini-interactions.md', 'utf8')
assert.match(geminiInteractionsReference, /not a generic route for every model/, 'Gemini Interactions must not imply support for every Google model')
assert.match(geminiInteractionsReference, /Nano Banana Pro and Nano Banana 2 use\s+`\/v1beta\/models\/\{model\}:generateContent`/, 'Gemini Interactions must direct image models to GenerateContent')

for (const filename of ['gemini-3-pro-image.md', 'gemini-3.1-flash-image.md']) {
  const geminiImageReference = readFileSync(`model-api-reference/official-native-api/google/${filename}`, 'utf8')
  assert.match(geminiImageReference, /path:\s*\/v1beta\/models\//, `${filename} must use the native GenerateContent endpoint`)
  assert.match(geminiImageReference, /:generateContent/, `${filename} must document the GenerateContent action`)
  assert.doesNotMatch(geminiImageReference, /path:\s*\/v1\/chat\/completions/, `${filename} must not advertise Chat Completions`)
}

for (const variant of ['flare', 'sunburst']) {
  const gptImage25Reference = readFileSync(`model-api-reference/official-native-api/openai/gpt-image-2.5-${variant}.md`, 'utf8')
  assert.match(gptImage25Reference, /path:\s*\/v1\/images\/generations/, `GPT Image 2.5 ${variant} must document native generation`)
  assert.match(gptImage25Reference, /POST \/v1\/images\/edits/, `GPT Image 2.5 ${variant} must document native editing`)
  assert.match(gptImage25Reference, new RegExp(`gpt-image-2\\.5-${variant}`), `GPT Image 2.5 ${variant} must use its exact public alias`)
  assert.doesNotMatch(gptImage25Reference, /model=?(?:"|')?openai\/gpt-image-2\.5/, `GPT Image 2.5 ${variant} must not send an internal model name to the native endpoint`)
}

const runReference = readFileSync('api-reference/models/run.md', 'utf8')
assert.doesNotMatch(runReference, /webhook_url[^\n]*API tasks/i, 'Run reference must not promise callbacks for API capabilities')
assert.match(runReference, /webhook_url[^\n]*image, video, or audio tasks/i, 'Run reference must match webhook capability scope')
const openApiReference = readFileSync('public/openapi.yaml', 'utf8')
assert.doesNotMatch(openApiReference, /webhook_url:\n[\s\S]{0,180}?description:[^\n]*API tasks/i, 'OpenAPI must not promise callbacks for API capabilities')
assert.match(openApiReference, /webhook_url:\n[\s\S]{0,180}?description:[^\n]*image, video, or audio tasks/i, 'OpenAPI must match webhook capability scope')

// Official Native API has one dedicated navigation entry in the native API sidebar.
const sidebarSource = readFileSync('.vitepress/sidebar.ts', 'utf8')
const nativeSidebarStart = sidebarSource.indexOf('export const nativeApiReferenceSidebar')
assert.ok(nativeSidebarStart >= 0, 'Sidebar must export nativeApiReferenceSidebar')
const nativeSidebarSource = sidebarSource.slice(nativeSidebarStart, sidebarSource.indexOf('export const docsSidebar'))
assert.equal((nativeSidebarSource.match(/\/model-api-reference\/official-native-api\//g) ?? []).length, 1, 'Official Native API must have exactly one native sidebar entry')
assert.doesNotMatch(sidebarSource, /seedance-native-api/i, 'Sidebar must not link the legacy Seedance native API page')

const nativeReference = readFileSync('model-api-reference/official-native-api/index.md', 'utf8')
// Task listing and deletion were removed from the apiserver; the reference must not advertise them.
assert.doesNotMatch(nativeReference, /`DELETE`\s*\|\s*`\/api\/v3\/contents\/generations\/tasks/, 'Official Native API must not document the removed task deletion')
assert.match(nativeReference, /Listing tasks and cancelling or deleting a task are not supported/, 'Official Native API must state that only create and retrieve are available')

const seedanceAssetReference = readFileSync('model-api-reference/official-native-api/bytedance/media-assets.md', 'utf8')
assert.match(seedanceAssetReference, /`POST \/v1\/assets`/, 'Seedance Asset guide must document Asset registration')
assert.match(seedanceAssetReference, /`GET \/v1\/assets\/\{external_id\}`/, 'Seedance Asset guide must document Asset readiness lookup')
assert.match(seedanceAssetReference, /asset:\/\/asset-/, 'Seedance Asset guide must use the persistent Asset reference in a generation request')
assert.match(seedanceAssetReference, /reference_image[\s\S]*reference_video[\s\S]*reference_audio/, 'Seedance Asset guide must map image, video, and audio roles')
assert.match(seedanceAssetReference, /official-compatible Asset protocol/, 'Seedance Asset guide must describe the official-compatible protocol boundary')
assert.match(seedanceAssetReference, /passed through unchanged/, 'Seedance Asset guide must state that asset references pass through unchanged')
assert.doesNotMatch(seedanceAssetReference, /\/v1\/upload/, 'Seedance official Asset guide must not mix in the generic upload endpoint')
assert.doesNotMatch(seedanceAssetReference, /SandBase Asset library/, 'Seedance Asset guide must not describe the compatible Asset protocol as a separate SandBase library')
assert.doesNotMatch(seedanceAssetReference, /POST \/api\/v3\/assets/, 'Seedance Asset guide must not expose the internal Asset gateway')

for (const filename of ['seedance-2.5-official.md', 'seedance-2.0-official.md']) {
  const seedanceModelReference = readFileSync(`model-api-reference/official-native-api/bytedance/${filename}`, 'utf8')
  assert.match(seedanceModelReference, /Media Assets for Seedance/, `${filename} must link the Asset workflow`)
  assert.match(seedanceModelReference, /asset:\/\/asset-/, `${filename} must show how to use a reusable Asset`)
}

assert.ok(inspected > 0, 'content validation did not inspect any public hand-written pages')
console.log(`public hand-written content: ok (${inspected} pages)`)
