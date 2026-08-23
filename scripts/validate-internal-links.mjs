import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const ignoredDirectories = new Set(['.git', '.vitepress', '_archived', 'node_modules'])

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return []
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function routeExists(route) {
  if (route === '/') return existsSync('index.md')
  if (route.startsWith('/docs/')) return existsSync(path.join('public', route.slice('/docs/'.length)))

  const localPath = route.slice(1).replace(/\/$/, '')
  return existsSync(`${localPath}.md`)
    || existsSync(path.join(localPath, 'index.md'))
    || existsSync(path.join('public', localPath))
}

const markdownFiles = walk('.').filter((file) => file.endsWith('.md'))
const brokenLinks = []

for (const file of markdownFiles) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(/\[[^\]]*\]\((\/[^) #?]+)(?:[?#][^)]*)?\)/g)) {
    if (!routeExists(match[1])) brokenLinks.push(`${file}: ${match[1]}`)
  }
}

assert.deepEqual(brokenLinks, [], `Broken internal links:\n${brokenLinks.join('\n')}`)
console.log(`internal links: ok (${markdownFiles.length} Markdown files)`)
