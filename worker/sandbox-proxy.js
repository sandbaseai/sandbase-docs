// Stateless BYOK bridge. No service credential, storage, logging or arbitrary upstream URL.
export const PREFIX = '/docs/_sandbox'
const UPSTREAM = 'https://sandbox.sandbase.ai'
const ID = '[a-zA-Z0-9_-]{1,128}'
const routes = [
  ['GET', /^\/templates$/], ['GET', /^\/v2\/templates$/],
  ['GET|POST', /^\/v2\/sandboxes$/],
  ['POST', new RegExp(`^/v2/sandboxes/${ID}/connect$`)],
  ['GET|DELETE', new RegExp(`^/sandboxes/${ID}$`)],
  ['POST', new RegExp(`^/sandboxes/${ID}/(?:pause|timeout)$`)],
  ['GET', new RegExp(`^/events/sandboxes/${ID}$`)],
  ['GET', new RegExp(`^/sandboxes/${ID}/metrics$`)],
  ['GET', new RegExp(`^/v2/sandboxes/${ID}/logs$`)],
  ['GET', new RegExp(`^/sandbox-gateway/sandboxes/${ID}/usage$`)],
]
const responseHeaders = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' }
const error = (status, code) => new Response(JSON.stringify({ error: { code } }), { status, headers: responseHeaders })
export function encodeFrame(value) {
  const body = new TextEncoder().encode(JSON.stringify(value)), frame = new Uint8Array(body.length + 5)
  new DataView(frame.buffer).setUint32(1, body.length); frame.set(body, 5); return frame
}
async function limitedBody(request, limit = 131072) {
  const reader = request.body?.getReader(); if (!reader) return new Uint8Array()
  const chunks = []; let size = 0
  try { for (;;) { const { value, done } = await reader.read(); if (done) break
    size += value.length; if (size > limit) { await reader.cancel(); throw new Error('body_too_large') } chunks.push(value)
  } } finally { reader.releaseLock() }
  const out = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length } return out
}
export async function sandboxProxy(request, fetcher = fetch) {
  const url = new URL(request.url)
  if (!url.pathname.startsWith(PREFIX + '/')) return error(404, 'not_found')
  // Custom header forces a CORS preflight for cross-site callers; no CORS grants here.
  if (request.headers.get('X-Sandbox-Playground') !== '1' ||
      (request.headers.has('Origin') && request.headers.get('Origin') !== url.origin) ||
      request.headers.get('Sec-Fetch-Site') === 'cross-site') return error(403, 'same_origin_required')
  const key = request.headers.get('X-API-Key')
  if (!key || key.length > 8192 || /[\r\n]/.test(key)) return error(401, 'api_key_required')
  if ([...url.searchParams.keys()].some(k => !['limit','nextToken','state','metadata','cursor','path','user'].includes(k))) return error(400, 'invalid_query')
  const path = url.pathname.slice(PREFIX.length), method = request.method
  let target, headers = new Headers(), body
  try {
    if (path.startsWith('/control/')) {
      const apiPath = path.slice('/control'.length)
      if (!routes.some(([verbs, re]) => verbs.split('|').includes(method) && re.test(apiPath))) return error(404, 'unsupported_operation')
      target = UPSTREAM + apiPath + url.search
      headers.set('X-API-Key', key)
      if (method === 'POST') {
        if (!request.headers.get('Content-Type')?.startsWith('application/json')) return error(415, 'json_required')
        body = await limitedBody(request); JSON.parse(new TextDecoder().decode(body)); headers.set('Content-Type', 'application/json')
      }
    } else {
      const match = path.match(new RegExp(`^/data/(${ID})/(command|files)$`))
      if (!match || !['GET','POST'].includes(method) || (match[2] === 'command' && method !== 'POST')) return error(404, 'unsupported_operation')
      const [, id, action] = match, token = request.headers.get('X-Access-Token')
      if (!token || token.length > 8192) return error(401, 'connect_required')
      // Recheck the supplied customer's ownership before forwarding to any data host.
      const check = await fetcher(`${UPSTREAM}/sandboxes/${id}`, { headers: { 'X-API-Key': key }, redirect: 'error', signal: AbortSignal.timeout(15000) })
      if (!check.ok) { await check.body?.cancel(); return error(check.status, 'sandbox_access_denied') }
      const info = await check.json()
      if (info.state !== 'running') return error(409, 'sandbox_not_running')
      headers.set('X-Access-Token', token)
      headers.set('Authorization', 'Basic ' + btoa('user:'))
      if (action === 'command') {
        const input = JSON.parse(new TextDecoder().decode(await limitedBody(request, 16384)))
        if (typeof input.command !== 'string' || !input.command.trim() || input.command.length > 8192) return error(400, 'invalid_command')
        body = encodeFrame({ process: { cmd: '/usr/bin/timeout', args: ['25s', '/bin/bash', '-lc', input.command], cwd: '/tmp' }, stdin: false })
        headers.set('Content-Type', 'application/connect+json'); headers.set('Connect-Protocol-Version', '1'); headers.set('Connect-Timeout-Ms', '30000')
        target = `https://49983-${id}.sandbox.sandbase.ai/process.Process/Start`
      } else {
        const filePath = url.searchParams.get('path')
        if (!filePath?.startsWith('/tmp/') || filePath.split('/').includes('..') || filePath.includes('\0') || filePath.length > 512) return error(400, 'tmp_path_required')
        const query = new URLSearchParams({ path: filePath, user: 'user' })
        target = `https://49983-${id}.sandbox.sandbase.ai/files?${query}`
        if (method === 'POST') {
          if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data;')) return error(415, 'multipart_required')
          headers.set('Content-Type', request.headers.get('Content-Type')); body = await limitedBody(request, 65536)
        }
      }
    }
    const upstream = await fetcher(target, { method, headers, body, redirect: 'error', signal: AbortSignal.timeout(35000) })
    if (!upstream.ok) { await upstream.body?.cancel(); return error(upstream.status, `upstream_http_${upstream.status}`) }
    const outHeaders = new Headers(responseHeaders)
    outHeaders.set('Content-Type', upstream.headers.get('Content-Type') || 'application/octet-stream')
    for (const name of ['X-Next-Token','X-Request-ID']) if (upstream.headers.has(name)) outHeaders.set(name, upstream.headers.get(name))
    return new Response(upstream.body, { status: upstream.status, headers: outHeaders })
  } catch (e) { return error(e.message === 'body_too_large' ? 413 : 502, e.message === 'body_too_large' ? 'body_too_large' : 'request_failed_result_unknown') }
}
