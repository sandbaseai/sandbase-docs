import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { sandboxProxy, encodeFrame } from '../worker/sandbox-proxy.js'
import { templateLabel, redact, readCommandStream } from '../.vitepress/theme/sandbox-client.mjs'
const origin = 'https://www.sandbase.ai'
const base = origin + '/docs/_sandbox'
const key = 'synthetic-test-key'
const headers = { 'X-API-Key': key, 'X-Sandbox-Playground': '1', Origin: origin }
const req = (path, options = {}) => new Request(base + path, { ...options, headers: { ...headers, ...options.headers } })
test('proxy forwards only fixed control routes and never forwards cookies', async () => {
  let seen
  const r = await sandboxProxy(req('/control/templates', { headers: { Cookie: 'private-cookie' } }), async (url, options) => { seen = { url, options }; return Response.json([{ templateID: 'one' }]) })
  assert.equal(seen.url, 'https://sandbox.sandbase.ai/templates'); assert.equal(seen.options.headers.get('X-API-Key'), key)
  assert.equal(seen.options.headers.get('Cookie'), null); assert.equal(seen.options.redirect, 'error'); assert.equal(r.headers.get('Cache-Control'), 'no-store')
  assert.equal((await r.json())[0].templateID, 'one')
})
test('rejects cross-site calls, missing auth, unexpected routes and query injection before network', async () => {
  let calls = 0; const never = () => { calls++; throw Error() }
  for (const request of [req('/control/templates', { headers: { Origin: 'https://evil.example' } }), new Request(base + '/control/templates'), req('/control/templates?url=https://evil.example'), req('/control/templates', { method: 'DELETE' }), req('/data/evil.example/files?path=/tmp/x')]) assert.ok((await sandboxProxy(request, never)).status >= 400)
  assert.equal(calls, 0)
})
test('no redirects, raw upstream errors, cookies or secret logging in error response', async () => {
  const r = await sandboxProxy(req('/control/templates'), async () => new Response(key, { status: 500 }))
  assert.equal(r.status, 500); assert.ok(!(await r.text()).includes(key))
  const failed = await sandboxProxy(req('/control/templates'), async () => { throw Error(key) }); assert.ok(!(await failed.text()).includes(key))
})
test('command requires customer ownership and running state; API key never reaches data host', async () => {
  const seen = []; const request = () => req('/data/sbx-owned/command', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Access-Token': 'synthetic-token' }, body: JSON.stringify({ command: 'pwd' }) })
  const r = await sandboxProxy(request(), async (url, options) => {
    seen.push({ url, options }); if (seen.length === 1) return Response.json({ state: 'running' })
    return new Response(encodeFrame({ event: { end: { exitCode: 0 } } }), { headers: { 'Content-Type': 'application/connect+json' } })
  })
  assert.equal(r.status, 200); assert.equal(seen[1].url, 'https://49983-sbx-owned.sandbox.sandbase.ai/process.Process/Start')
  assert.equal(seen[1].options.headers.get('X-API-Key'), null); assert.equal(seen[1].options.headers.get('X-Access-Token'), 'synthetic-token')
  const command = JSON.parse(new TextDecoder().decode(seen[1].options.body.slice(5))); assert.deepEqual(command.process.args, ['25s', '/bin/bash', '-lc', 'pwd'])
  for (const check of [new Response('', { status: 403 }), Response.json({ state: 'paused' })]) { let calls = 0; const failed = await sandboxProxy(request(), async () => { calls++; return check }); assert.ok(failed.status >= 400); assert.equal(calls, 1) }
})
test('file requests reject traversal and oversized multipart, keep binary payload intact', async () => {
  const fileHeaders = { 'X-Access-Token': 'synthetic-token' }
  const fetcher = async () => Response.json({ state: 'running' })
  assert.equal((await sandboxProxy(req('/data/sbx/files?path=/tmp/../secret', { headers: fileHeaders }), fetcher)).status, 400)
  assert.equal((await sandboxProxy(req('/data/sbx/files?path=/tmp/x', { method: 'POST', headers: { ...fileHeaders, 'Content-Type': 'multipart/form-data; boundary=x' }, body: 'a'.repeat(65537) }), fetcher)).status, 413)
})
function stream(chunks) { return new ReadableStream({ start(c) { for (const chunk of chunks) c.enqueue(chunk); c.close() } }) }
function terminal() { const frame = encodeFrame({}); frame[0] = 2; return frame }
test('Connect decoder handles byte-by-byte frames and requires process AND transport terminal', async () => {
  const frames = [encodeFrame({ event: { start: { pid: 1 } } }), encodeFrame({ event: { data: { stdout: 'aGVsbG8=' } } }), encodeFrame({ event: { end: { exitCode: 0 } } }), terminal()]
  const events = []; await readCommandStream(stream(frames.flatMap(f => [...f].map(b => new Uint8Array([b])))), e => events.push(e))
  assert.equal(events.length, 3); assert.equal(events[2].end.exitCode, 0)
  await assert.rejects(readCommandStream(stream(frames.slice(0, 2)), () => {}), /interrupted/)
  await assert.rejects(readCommandStream(stream([frames[2]]), () => {}), /interrupted/)
  const err = encodeFrame({ error: { message: 'secret' } }); err[0] = 2
  await assert.rejects(readCommandStream(stream([err]), () => {}), /command_stream_error/)
})
test('blank names remain visible and secrets are redacted from rendered evidence', () => {
  assert.equal(templateLabel({ templateID: 'private-id', name: '', names: ['', ''], aliases: [] }), 'private-id')
  assert.equal(templateLabel({ templateID: 't', names: ['Named'] }), 'Named')
  assert.equal(redact({ envdAccessToken: 'test', output: key }, [key]), '{\n  "envdAccessToken": "[redacted]",\n  "output": "[redacted]"\n}')
})
test('UI has no credential persistence, HTML injection or platform environment credentials', () => {
  const source = readFileSync(new URL('../.vitepress/theme/SandboxPlayground.vue', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /localStorage|sessionStorage|v-html|process\.env|SANDBASE_PROD_SG_API_KEY/)
  assert.match(source, /docsCreate: attempt/); assert.match(source, /tokens\.delete\(currentID\)/)
})

test('stateless lifecycle and file relay keep renewed tokens and bytes correct', async () => {
  let state = 'running', content = '', token = 'token-old'; const paths = []
  const fetcher = async (url, options) => {
    paths.push(new URL(url).pathname)
    if (url.includes('/v2/sandboxes') && !url.endsWith('/connect')) return Response.json({ sandboxID: 'fixture', envdAccessToken: token })
    if (url.endsWith('/pause')) { state = 'paused'; return new Response(null, { status: 204 }) }
    if (url.endsWith('/connect')) { state = 'running'; token = 'token-new'; return Response.json({ sandboxID: 'fixture', envdAccessToken: token }) }
    if (url.includes('49983-fixture')) {
      assert.equal(options.headers.get('X-Access-Token'), token)
      if (options.method === 'POST') { const form = await new Request(url, options).formData(); content = await form.get('file').text(); return Response.json({ path: '/tmp/test' }) }
      return new Response(content)
    }
    return Response.json({ state })
  }
  const post = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const created = await sandboxProxy(req('/control/v2/sandboxes', post({ templateID: 'fixture' })), fetcher); assert.equal((await created.json()).envdAccessToken, 'token-old')
  const form = new FormData(); form.append('file', new Blob(['中文 retained']), 'test.txt')
  const write = await sandboxProxy(req('/data/fixture/files?path=/tmp/test', { method: 'POST', headers: { 'X-Access-Token': token }, body: form }), fetcher); assert.equal(write.status, 200)
  await sandboxProxy(req('/control/sandboxes/fixture/pause', post({})), fetcher)
  await sandboxProxy(req('/control/v2/sandboxes/fixture/connect', post({ timeout: 120 })), fetcher)
  const read = await sandboxProxy(req('/data/fixture/files?path=/tmp/test', { headers: { 'X-Access-Token': token } }), fetcher); assert.equal(await read.text(), '中文 retained'); assert.equal(token, 'token-new')
  assert.equal(paths.filter(p => p === '/v2/sandboxes').length, 1)
})
