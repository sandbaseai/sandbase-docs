import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

const roots = ['admin', 'agents', 'api-reference', 'for-agents', 'getting-started', 'guides', 'models', 'setup', 'store']
const excluded = [
  'agents/endpoint-quickstart.md',
  'api-reference/embeds/',
  'api-reference/environments/',
  'api-reference/webhooks.md',
  'guides/site-agent-integration.md',
]
let inspected = 0

function isExcluded(filename) {
  return excluded.some((entry) => filename === entry || filename.startsWith(entry))
}

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (isExcluded(filename)) continue
    if (entry.isDirectory()) {
      inspect(filename)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const source = readFileSync(filename, 'utf8')
    const match = source.match(/^---\n([\s\S]*?)\n---/)
    assert.ok(match, `${filename} must declare frontmatter for page metadata`)
    const frontmatter = YAML.parse(match[1]) ?? {}
    assert.ok(String(frontmatter.title ?? '').trim(), `${filename} must declare a non-empty title`)
    assert.ok(String(frontmatter.description ?? '').trim(), `${filename} must declare a non-empty description`)
    assert.ok(String(frontmatter.title).length <= 65, `${filename} title must be 65 characters or fewer`)
    assert.ok(String(frontmatter.description).length <= 170, `${filename} description must be 170 characters or fewer`)
    inspected += 1
  }
}

for (const root of roots) inspect(root)
assert.ok(inspected > 0, 'SEO validation did not inspect any public hand-written pages')
console.log(`SEO source metadata: ok (${inspected} pages)`)
