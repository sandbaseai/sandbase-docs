import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

const roots = ['admin', 'agents', 'api-reference', 'for-agents', 'getting-started', 'guides', 'models', 'setup', 'store', 'model-api-reference']
const excluded = [
  'agents/endpoint-quickstart.md',
  'api-reference/embeds/',
  'api-reference/environments/',
  'api-reference/webhooks.md',
  'guides/site-agent-integration.md',
  'setup/cli.md',
  'setup/groups.md',
]
let inspected = 0
const publicTitles = new Map()
const publicDescriptions = new Map()
const generatedTitles = new Map()
const generatedDescriptions = new Map()

function registerUnique(map, value, filename, label) {
  const previous = map.get(value)
  assert.ok(!previous, `${filename} duplicates ${label} from ${previous}: ${value}`)
  map.set(value, filename)
}

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
    assert.ok(!/\bAPI API\b/i.test(String(frontmatter.title)), `${filename} title must not repeat API`)
    assert.ok(!/\bAPI API\b/i.test(String(frontmatter.description)), `${filename} description must not repeat API`)
    const titleBase = String(frontmatter.title).split(' — ', 1)[0]
    assert.ok(!/\b([A-Za-z][A-Za-z0-9'-]*)\s+\1\b/i.test(titleBase), `${filename} title must not repeat adjacent words`)
    if (filename.startsWith('model-api-reference/')) {
      assert.ok(!/(?:\.\.\.|…)\s*$/.test(String(frontmatter.title)), `${filename} title must not end with a truncation ellipsis`)
      assert.ok(!/(?:\.\.\.|…)\s*$/.test(String(frontmatter.description)), `${filename} description must not end with a truncation ellipsis`)
    }
    const robots = String(frontmatter.robots ?? 'index,follow')
    if (robots.startsWith('noindex')) {
      if (frontmatter.canonical != null) {
        assert.ok(String(frontmatter.canonical).startsWith('/docs/'), `${filename} canonical URL must start with /docs/`)
      }
    } else {
      // Generated model pages intentionally use compact, model-specific descriptions;
      // require those to remain unique as well so duplicate operation pages do not
      // collapse into indistinguishable search results.
      const titleMap = filename.startsWith('model-api-reference/') ? generatedTitles : publicTitles
      const descriptionMap = filename.startsWith('model-api-reference/') ? generatedDescriptions : publicDescriptions
      // Keep generated model pages distinct from one another, while allowing a
      // category landing page to share its concise heading with the hand-written
      // API guide (for example, "Image Generation").
      if (filename.startsWith('model-api-reference/')) {
        registerUnique(titleMap, String(frontmatter.title).trim(), filename, 'an indexable generated title')
      } else {
        registerUnique(titleMap, String(frontmatter.title).trim(), filename, 'an indexable title')
      }
      registerUnique(descriptionMap, String(frontmatter.description).trim(), filename, 'an indexable description')
    }
    inspected += 1
  }
}

for (const root of roots) inspect(root)
assert.ok(inspected > 0, 'SEO validation did not inspect any public hand-written pages')
console.log(`SEO source metadata: ok (${inspected} pages)`)
