import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const setup = readFileSync('setup/index.md', 'utf8')
const workspaceServices = readFileSync('setup/installed.md', 'utf8')
const quickstart = readFileSync('getting-started/quickstart.md', 'utf8')
const llms = `${readFileSync('public/llms.txt', 'utf8')}\n${readFileSync('public/llms-full.txt', 'utf8')}`
const sidebar = readFileSync('.vitepress/sidebar.ts', 'utf8')
const config = readFileSync('.vitepress/config.ts', 'utf8')
const publicSetup = `${setup}\n${workspaceServices}\n${quickstart}\n${llms}`

assert.ok(!existsSync('setup/cli.md'), 'duplicate CLI setup page must stay removed')
assert.ok(!existsSync('setup/groups.md'), 'retired Platform Groups page must stay removed')
assert.match(config, /'setup\/cli\.md'/, 'duplicate CLI setup route must stay excluded from the public build')
assert.match(config, /'setup\/groups\.md'/, 'retired Platform Groups route must stay excluded from the public build')

for (const required of [
  'https://www.sandbase.ai/console/setup',
  'curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex',
  'curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents',
  'npx -y @sandbaseai/cli doctor --client codex',
]) {
  assert.ok(publicSetup.includes(required), `Setup documentation must include the current flow: ${required}`)
}

for (const section of ['Core services', 'My Custom', 'Scenarios']) {
  assert.ok(workspaceServices.includes(section), `Workspace Services must document ${section}`)
}

assert.doesNotMatch(publicSetup, /sandbaseai-cli-\d+\.\d+\.\d+\.tgz/, 'public setup guidance must not pin a release archive')
assert.doesNotMatch(publicSetup, /\bPlatform Groups?\b/, 'public setup guidance must not expose the retired Platform Groups label')
assert.equal((sidebar.match(/link: '\/setup\/'/g) ?? []).length, 1, 'Docs sidebar must expose one unified Setup entry')
assert.doesNotMatch(sidebar, /\/setup\/(?:cli|groups)\b/, 'Docs sidebar must not link retired Setup pages')

console.log('Setup docs: ok (one guided flow, current installer, retired duplicates removed)')
