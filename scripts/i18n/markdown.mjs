// Markdown helpers for the translation script: protect code from the
// translator, split long pages, and keep English heading anchors.
import YAML from 'yaml'

/** Replace code, scripts and component tags with placeholders. */
export function protect(body) {
  const blocks = []
  const lines = body.split('\n')
  const out = []
  // The placeholder takes the block's first-line indent, so the block is
  // stored without it and lists keep their nesting.
  const keep = (text, indent = '') => {
    out.push(`${indent}<!--sb-keep-${blocks.length}-->`)
    blocks.push(text.slice(indent.length))
  }
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const fence = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fence) {
      const [, indent, marker] = fence
      let end = i + 1
      const close = new RegExp(`^\\s*${marker[0] === '`' ? '`' : '~'}{${marker.length},}\\s*$`)
      while (end < lines.length && !close.test(lines[end])) end += 1
      keep(lines.slice(i, end + 1).join('\n'), indent)
      i = end
      continue
    }
    const block = line.match(/^<(script|style)\b/)
    if (block) {
      let end = i
      while (end < lines.length && !lines[end].includes(`</${block[1]}>`)) end += 1
      keep(lines.slice(i, end + 1).join('\n'))
      i = end
      continue
    }
    // Vue components on their own line, e.g. <QuickstartResources group="ops" />
    if (/^\s*<\/?[A-Z][\w-]*(\s[^>]*)?\/?>\s*$/.test(line)) {
      keep(line, line.match(/^\s*/)[0])
      continue
    }
    out.push(line)
  }
  return { text: out.join('\n'), blocks }
}

export function restore(text, blocks) {
  for (let index = 0; index < blocks.length; index += 1) {
    const marker = `<!--sb-keep-${index}-->`
    const count = text.split(marker).length - 1
    if (count !== 1) throw new Error(`placeholder ${index} appears ${count} times`)
  }
  return text.replace(/<!--sb-keep-(\d+)-->/g, (_, index) => blocks[Number(index)])
}

/** Split protected Markdown at H2 boundaries into chunks of at most ~limit characters. */
export function chunk(text, limit = 7000) {
  const sections = text.split(/\n(?=## )/)
  const chunks = []
  let current = ''
  for (const section of sections) {
    if (current && current.length + section.length > limit) {
      chunks.push(current)
      current = section
    } else {
      current = current ? `${current}\n${section}` : section
    }
  }
  if (current) chunks.push(current)
  return chunks
}

// ─── Headings keep their English anchors ───────────────────────────

function headings(md, body) {
  return md.parse(body, {}).filter((token) => token.type === 'heading_open' && token.map)
    .map((token) => ({ line: token.map[0], id: token.attrGet('id'), tag: token.tag }))
}

/** Give each translated heading the anchor ID of the matching English heading. */
export function pinAnchors(md, englishBody, translatedBody) {
  const source = headings(md, englishBody)
  const target = headings(md, translatedBody)
  if (source.length !== target.length) {
    throw new Error(`heading count changed (${source.length} -> ${target.length})`)
  }
  const lines = translatedBody.split('\n')
  target.forEach((heading, index) => {
    if (heading.tag !== source[index].tag) throw new Error(`heading level changed at heading ${index + 1}`)
    const line = lines[heading.line]
    // Some English headings have no usable anchor (e.g. `GET /v1/assets/{id}`).
    if (!/^\s*#{1,6}\s/.test(line) || !source[index].id) return
    lines[heading.line] = `${line.replace(/\s*\{#[^}]*\}\s*$/, '')} {#${source[index].id}}`
  })
  return lines.join('\n')
}

export function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { data: {}, body: source }
  return { data: YAML.parse(match[1]) ?? {}, body: source.slice(match[0].length) }
}

/** [path, text] pairs of translatable frontmatter strings. */
export function frontmatterStrings(data) {
  const found = []
  const take = (keys, value) => {
    if (typeof value === 'string' && value.trim()) found.push([keys, value])
  }
  take(['title'], data.title)
  take(['description'], data.description)
  const ref = data.apiReference
  if (ref) {
    take(['apiReference', 'title'], ref.title)
    take(['apiReference', 'description'], ref.description)
    ref.groups?.forEach((group, g) => {
      take(['apiReference', 'groups', g, 'title'], group.title)
      take(['apiReference', 'groups', g, 'description'], group.description)
      group.fields?.forEach((field, f) => {
        take(['apiReference', 'groups', g, 'fields', f, 'description'], field.description)
        take(['apiReference', 'groups', g, 'fields', f, 'constraints'], field.constraints)
      })
    })
    ref.notes?.forEach((note, n) => {
      take(['apiReference', 'notes', n, 'title'], note.title)
      try { JSON.parse(note.description) } catch { take(['apiReference', 'notes', n, 'description'], note.description) }
    })
    ref.errors?.forEach((error, e) => take(['apiReference', 'errors', e, 'description'], error.description))
  }
  return found
}

export function setPath(target, keys, value) {
  let node = target
  for (const key of keys.slice(0, -1)) node = node[key]
  node[keys.at(-1)] = value
}
