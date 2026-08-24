import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, '.vitepress', 'dist')

assert.ok(existsSync(dist), 'Built docs directory is missing; run npm run build first')

const forbidden = [
  [/\/v1\/generations(?:\/|\b)/i, 'withdrawn generation API'],
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
    for (const [pattern, label] of forbidden) {
      assert.doesNotMatch(content, pattern, `${relative} must not publish the hidden ${label}`)
    }
  }
}

inspect(dist)
assert.ok(inspected > 0, 'Built docs directory did not contain inspectable output')
console.log(`built public surface: ok (${inspected} files)`)
