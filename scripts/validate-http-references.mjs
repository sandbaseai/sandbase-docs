import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import YAML from 'yaml'

const root = process.cwd()
const spec = YAML.parse(fs.readFileSync(path.join(root, 'public/openapi.yaml'), 'utf8'))
const methods = ['get', 'post', 'put', 'patch', 'delete']
const routes = []
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

for (const [routePath, definition] of Object.entries(spec.paths ?? {})) {
  for (const method of methods) {
    if (!definition[method]) continue
    const segments = routePath.split('/').map((segment, index, all) => {
      if (!/^\{[^}]+\}$/.test(segment)) return escapeRegex(segment)
      // Model names are vendor-qualified and therefore contain a slash.
      return index === all.length - 1 && segment === '{id_or_name}' ? '.+' : '[^/]+'
    })
    routes.push({ method: method.toUpperCase(), pattern: new RegExp(`^${segments.join('/')}$`) })
  }
}

const roots = ['agents', 'api-reference', 'for-agents', 'getting-started', 'guides', 'models', 'public']
const references = []

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '_archived') continue
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(filename)
    else if (/\.(?:md|mdx|txt)$/.test(entry.name)) {
      const content = fs.readFileSync(filename, 'utf8')
      for (const match of content.matchAll(/\b(GET|POST|PUT|PATCH|DELETE)\s+(\/(?:v1(?:beta)?|events)\/[A-Za-z0-9_{}./:-]+)/g)) {
        references.push({
          file: path.relative(root, filename),
          line: content.slice(0, match.index).split('\n').length,
          method: match[1],
          routePath: match[2].replace(/[.,;:]$/, ''),
        })
      }
    }
  }
}

for (const directory of roots) {
  const absolute = path.join(root, directory)
  if (fs.existsSync(absolute)) walk(absolute)
}

const invalid = references.filter(
  (reference) => !routes.some((route) => route.method === reference.method && route.pattern.test(reference.routePath)),
)

if (invalid.length) {
  for (const reference of invalid) {
    console.error(`${reference.file}:${reference.line}: ${reference.method} ${reference.routePath} is not in public/openapi.yaml`)
  }
  process.exit(1)
}

console.log(`HTTP references: ok (${references.length} references)`)
