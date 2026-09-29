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
  const r = await sandboxProxy(req('/control/v2/templates', { headers: { Cookie: 'private-cookie' } }), async (url, options) => { seen = { url, options }; return Response.json([{ templateID: 'one' }]) })
  assert.equal(seen.url, 'https://sandbox.sandbase.ai/v2/templates'); assert.equal(seen.options.headers.get('X-API-Key'), key)
  assert.equal(seen.options.headers.get('Cookie'), null); assert.equal(seen.options.redirect, 'manual'); assert.equal(r.headers.get('Cache-Control'), 'no-store')
  assert.equal((await r.json())[0].templateID, 'one')
})
test('rejects cross-site calls, missing auth, unexpected routes and query injection before network', async () => {
  let calls = 0; const never = () => { calls++; throw Error() }
  for (const request of [req('/control/v2/templates', { headers: { Origin: 'https://evil.example' } }), new Request(base + '/control/v2/templates'), req('/control/v2/templates?url=https://evil.example'), req('/control/v2/templates', { method: 'DELETE' }), req('/data/evil.example/files?path=/tmp/x')]) assert.ok((await sandboxProxy(request, never)).status >= 400)
  assert.equal(calls, 0)
})
test('no redirects, raw upstream errors, cookies or secret logging in error response', async () => {
  const r = await sandboxProxy(req('/control/v2/templates'), async () => new Response(key, { status: 500 }))
  assert.equal(r.status, 500); assert.ok(!(await r.text()).includes(key))
  const failed = await sandboxProxy(req('/control/v2/templates'), async () => { throw Error(key) }); assert.ok(!(await failed.text()).includes(key))
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

// Execute the actual component script with Vue refs and a controlled transport.
// Deliberately let a response finish after abort to exercise stale-response guards.
async function playgroundHarness(fetcher) {
  const { ref, computed } = await import('vue')
  const source = readFileSync(new URL('../.vitepress/theme/SandboxPlayground.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  return new Function('ref', 'computed', 'onMounted', 'onBeforeUnmount', 'window', 'templateLabel', 'redact', 'readCommandStream', 'fetch',
    source + '\nreturn { key, connected, accepted, busy, create, forget, act, selected, tokens, events, output, content, requestExample, notice, connect, templates, template, catalogLoaded, select, instances, loadEvents, eventNotice, connectionID, pageWindow: window };')(
    ref, computed, fn => fn(), () => {}, new EventTarget(), templateLabel, redact, readCommandStream, fetcher)
}

test('Clear key clears an unconnected key and all editable page content', async () => {
  const ui = await playgroundHarness(() => { throw new Error('unexpected network') })
  ui.key.value = 'unsubmitted-key'; ui.content.value = 'private file'; ui.output.value = 'private output'
  ui.forget()
  assert.equal(ui.key.value, ''); assert.equal(ui.content.value, ''); assert.equal(ui.output.value, '')
  assert.equal(ui.connected.value, false); assert.equal(ui.tokens.size, 0)
})

test('Clear key aborts an in-flight create and rejects a late body without disturbing a new session', async () => {
  let signal, releaseBody, readingBody
  const started = new Promise(resolve => { readingBody = resolve })
  const ui = await playgroundHarness(async (_url, init) => {
    signal = init.signal
    return { ok: true, status: 200, json: () => { readingBody(); return new Promise(resolve => { releaseBody = resolve }) } }
  })
  ui.key.value = 'old-key'; ui.accepted.value = true
  const old = ui.create(); await started
  ui.forget()
  assert.equal(signal.aborted, true); assert.equal(ui.key.value, ''); assert.equal(ui.busy.value, false)
  const clearedNotice = ui.notice.value
  let releaseNew
  ui.key.value = 'new-key'
  const newer = ui.act('New session', () => new Promise(resolve => { releaseNew = resolve }))
  releaseBody({ sandboxID: 'late-instance', envdAccessToken: 'late-token' })
  await old
  assert.equal(ui.selected.value, null); assert.equal(ui.tokens.size, 0); assert.deepEqual(ui.events.value, [])
  assert.equal(ui.key.value, 'new-key'); assert.equal(ui.busy.value, true); assert.equal(ui.notice.value, 'New session…')
  assert.match(clearedNotice, /Requests already sent may still complete/)
  releaseNew(); await newer
  assert.equal(ui.busy.value, false)
})


test('pagehide clears credentials before a page can enter the browser back-forward cache', async () => {
  const ui = await playgroundHarness(() => { throw new Error('unexpected network') })
  ui.key.value = 'navigation-key'; ui.tokens.set('instance', 'navigation-token')
  ui.pageWindow.dispatchEvent(new Event('pagehide'))
  assert.equal(ui.key.value, ''); assert.equal(ui.tokens.size, 0)
})


test('template picker uses only v2, follows pagination, and selects only ready builds', async () => {
  const paths = []
  const ui = await playgroundHarness(async path => {
    paths.push(path)
    if (path === '/docs/_sandbox/control/v2/templates?limit=100') return Response.json([
      { templateID: 'pending', names: ['Building'], public: false, buildStatus: 'building' },
      { templateID: 'unnamed-ready', names: [], aliases: [], public: true, buildStatus: 'ready' },
    ], { headers: { 'X-Next-Token': 'page-2' } })
    if (path === '/docs/_sandbox/control/v2/templates?limit=100&nextToken=page-2') return Response.json([
      { templateID: 'private-ready', names: ['Private workspace'], public: false, buildStatus: 'ready' },
      { templateID: 'failed', aliases: ['Failed build'], public: false, buildStatus: 'failed' },
    ])
    if (path.startsWith('/docs/_sandbox/control/v2/sandboxes?')) return Response.json([])
    throw new Error('unexpected route: ' + path)
  })
  ui.key.value = 'fixture-key'; await ui.connect()
  assert.equal(ui.catalogLoaded.value, true)
  assert.equal(ui.templates.value.length, 4)
  assert.equal(ui.template.value, 'unnamed-ready')
  assert.deepEqual(ui.templates.value.map(t => t.runnable), [false, true, true, false])
  assert.deepEqual(ui.templates.value.map(t => t.label), ['Building', 'unnamed-ready', 'Private workspace', 'Failed build'])
  assert.equal(paths.length, 3)
  const denied = await sandboxProxy(req('/control/templates'), () => { throw new Error('legacy upstream must not be called') })
  assert.equal(denied.status, 404)
})


test('redirects are rejected on control, access checks and data requests without forwarding Location', async () => {
  for (const path of ['/control/v2/templates', '/data/sbx-owned/files?path=/tmp/x']) {
    for (const status of [301, 302, 303, 307, 308]) {
      const stages = path.startsWith('/data/') ? [1, 2] : [1]
      for (const redirectAt of stages) {
        let calls = 0
        const r = await sandboxProxy(req(path, { headers: { 'X-Access-Token': 'synthetic-token' } }), async (_url, options) => {
          assert.equal(options.redirect, 'manual')
          if (++calls < redirectAt) return Response.json({ state: 'running' })
          return new Response('private upstream body', { status, headers: { Location: 'https://untrusted.example/', 'Set-Cookie': 'private' } })
        })
        assert.equal(r.status, 502); assert.equal(calls, redirectAt)
        assert.equal(r.headers.get('Location'), null); assert.equal(r.headers.get('Set-Cookie'), null)
        assert.deepEqual(await r.json(), { error: { code: 'upstream_redirect_rejected' } })
      }
    }
  }
})


test('instance selection is immediate and independent of detail or event endpoints', async () => {
  let calls = 0
  const ui = await playgroundHarness(() => { calls++; throw new Error('network must not be needed for selection') })
  ui.connectionID.value = 'page'
  const first = { sandboxID: 'one', state: 'running', metadata: { docsPlayground: 'page' } }
  const second = { sandboxID: 'two', state: 'running', metadata: { docsPlayground: 'page' } }
  ui.tokens.set('one', 'one-token'); ui.tokens.set('two', 'two-token')
  ui.select(first); ui.output.value = 'first output'; ui.content.value = 'first file'
  ui.select(second)
  assert.equal(ui.selected.value.sandboxID, 'two'); assert.equal(calls, 0)
  assert.equal(ui.output.value, ''); assert.equal(ui.content.value, '')
  assert.equal(ui.tokens.get('two'), 'two-token'); assert.match(ui.notice.value, /Selected two/)
  ui.busy.value = true; ui.select(first); assert.equal(ui.selected.value.sandboxID, 'two')
})

test('event 404 does not undo selection or mark a completed creation as failed', async () => {
  const ui = await playgroundHarness(async () => Response.json({ error: { code: 'upstream_http_404' } }, { status: 404 }))
  ui.select({ sandboxID: 'one', state: 'running' })
  await ui.act('Create sandbox', ui.loadEvents)
  assert.equal(ui.selected.value.sandboxID, 'one'); assert.equal(ui.notice.value, 'Create sandbox completed.')
  assert.match(ui.eventNotice.value, /Lifecycle events unavailable/); assert.equal(ui.busy.value, false)
  await ui.act('Refresh events', ui.loadEvents)
  assert.match(ui.notice.value, /selection is unchanged/)
})
