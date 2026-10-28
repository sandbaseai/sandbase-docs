import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const setup = readFileSync('setup/index.md', 'utf8')
const quickstart = readFileSync('getting-started/quickstart.md', 'utf8')
const llms = `${readFileSync('public/llms.txt', 'utf8')}\n${readFileSync('public/llms-full.txt', 'utf8')}`
const sidebar = readFileSync('.vitepress/sidebar.ts', 'utf8')
const config = readFileSync('.vitepress/config.ts', 'utf8')
const publicSetup = `${setup}\n${quickstart}\n${llms}`

assert.ok(!existsSync('setup/cli.md'), 'duplicate CLI setup page must stay removed')
assert.ok(!existsSync('setup/groups.md'), 'retired Platform Groups page must stay removed')
assert.ok(!existsSync('setup/installed.md'), 'retired Workspace Services page must stay removed')
assert.match(config, /'setup\/installed\.md'/, 'retired Workspace Services route must stay excluded from the public build')
assert.match(config, /'setup\/cli\.md'/, 'duplicate CLI setup route must stay excluded from the public build')
assert.match(config, /'setup\/groups\.md'/, 'retired Platform Groups route must stay excluded from the public build')

for (const required of [
  'https://www.sandbase.ai/console/setup',
  'set up https://www.sandbase.ai/SKILL.md',
  'npx -y @sandbaseai/cli@latest connect',
  'curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex',
  'curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents',
  'npx -y @sandbaseai/cli doctor --client codex',
]) {
  assert.ok(publicSetup.includes(required), `Setup documentation must include the current flow: ${required}`)
}

assert.doesNotMatch(publicSetup, /Workspace Services|console\/setup\/installed/, 'Workspace Services was folded into AI tools')

assert.doesNotMatch(publicSetup, /sandbaseai-cli-\d+\.\d+\.\d+\.tgz/, 'public setup guidance must not pin a release archive')
assert.doesNotMatch(publicSetup, /\bPlatform Groups?\b/, 'public setup guidance must not expose the retired Platform Groups label')
assert.equal((sidebar.match(/link: '\/setup\/'/g) ?? []).length, 1, 'Docs sidebar must expose one unified Setup entry')
assert.doesNotMatch(sidebar, /\/setup\/(?:cli|groups|installed)\b/, 'Docs sidebar must not link retired Setup pages')

console.log('Setup docs: ok (AI tools prompt, CLI connect, retired pages removed)')
