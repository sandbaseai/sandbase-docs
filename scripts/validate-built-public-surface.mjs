import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, '.vitepress', 'dist')

assert.ok(existsSync(dist), 'Built docs directory is missing; run npm run build first')

for (const retiredPage of [
  'README.html',
  'CONTRIBUTING.html',
  'DEPLOYMENT.html',
  'agents/endpoint-quickstart.html',
  'setup/cli.html',
  'setup/groups.html',
]) {
  assert.ok(!existsSync(path.join(dist, retiredPage)), `${retiredPage} must not be included in the public docs build`)
}

const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
for (const excludedUrl of ['/docs/README', '/docs/CONTRIBUTING', '/docs/DEPLOYMENT', '/docs/setup/cli', '/docs/setup/groups', '/docs/agents/deployments', '/docs/store/models']) {
  assert.ok(!sitemap.includes(`<loc>https://www.sandbase.ai${excludedUrl}</loc>`), `${excludedUrl} must not be indexed in the sitemap`)
}

const deploymentAlias = readFileSync(path.join(dist, 'agents', 'deployments.html'), 'utf8')
assert.match(deploymentAlias, /<meta name="robots" content="noindex,follow">/, 'Legacy deployment guide must be noindex')

const storeModelsAlias = readFileSync(path.join(dist, 'store', 'models.html'), 'utf8')
assert.match(storeModelsAlias, /<meta name="robots" content="noindex,follow">/, 'Legacy Store Models alias must be noindex')
assert.match(storeModelsAlias, /<link rel="canonical" href="https:\/\/www\.sandbase\.ai\/docs\/models\/">/, 'Legacy Store Models alias must canonicalize to the Models page')

const forbidden = [
  [/\/v1\/generations(?:\/|\b)/i, 'withdrawn generation API'],
  [/\/v1\/blog\/assets(?:\/|\b)/i, 'internal Blog publishing storage API'],
  [/\/(?:v1\/)?sandboxes?(?:\/|%7b|\{|:|\b)/i, 'Sandbox API'],
  [/\/events\/webhooks(?:\/|\b)/i, 'Sandbox event webhook API'],
  [/\/v1\/endpoints\/[A-Za-z0-9_{}%.-]+\/mcp\b/i, 'Endpoint MCP transport'],
  [/\/v1\/endpoint_runtime_profiles\b/i, 'Endpoint runtime-profile discovery'],
  [/\/v1\/mcp(?:\/|\b)/i, 'generic MCP transport or discovery'],
  [/\/v1\/mcp\/(?:servers|[A-Za-z0-9_{}%.-]+\/config)\b/i, 'MCP discovery or runtime config'],
  [/\/mcp\/[A-Za-z0-9_{}%.-]+\/sse\b/i, 'MCP SSE proxy'],
  [/\/v1\/skills\/[A-Za-z0-9_{}%.-]+\/mcp-publications\b/i, 'Skill MCP publication creation'],
  [/\/v1\/skill-mcp-publications(?:\/|\b)/i, 'Skill MCP publication management'],
  [/\/v1\/capabilities\/[A-Za-z0-9_{}%.-]+\/mcp\b/i, 'Capability MCP transport'],
  [/\/v1\/skill-mcp\/[A-Za-z0-9_{}%.-]+\/mcp\b/i, 'published Skill MCP transport'],
]

let inspected = 0
let htmlPages = 0

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      inspect(filename)
      continue
    }
    if (!/\.(?:html|js|css|json|xml|txt)$/.test(entry.name)) continue
    const content = readFileSync(filename, 'utf8')
    const relative = path.relative(dist, filename)
    inspected += 1
    if (entry.name.endsWith('.html') && relative !== '404.html') {
      htmlPages += 1
      for (const [pattern, label] of [
        [/<title>[^<]+<\/title>/g, 'document title'],
        [/<meta name="description" content="[^"]+">/g, 'meta description'],
        [/<link rel="canonical" href="[^"]+">/g, 'canonical URL'],
        [/<meta name="robots" content="[^"]+">/g, 'robots directive'],
        [/<meta property="og:title" content="[^"]+">/g, 'Open Graph title'],
        [/<meta property="og:description" content="[^"]+">/g, 'Open Graph description'],
      ]) {
        assert.equal(content.match(pattern)?.length ?? 0, 1, `${relative} must contain exactly one ${label}`)
      }
    }
    for (const [pattern, label] of forbidden) {
      assert.doesNotMatch(content, pattern, `${relative} must not publish the hidden ${label}`)
    }
  }
}

inspect(dist)
assert.ok(inspected > 0, 'Built docs directory did not contain inspectable output')
assert.ok(htmlPages > 0, 'Built docs directory did not contain indexable HTML pages')
console.log(`built public surface: ok (${inspected} files, ${htmlPages} HTML pages)`)
