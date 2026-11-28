<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { templateLabel, redact, readCommandStream } from './sandbox-client.mjs'
import { useI18n } from './i18n'
const { tx } = useI18n()
const key = ref(''), connected = ref(false), busy = ref(false), accepted = ref(false)
const catalogLoaded = ref(false)
const templates = ref([]), template = ref(''), instances = ref([]), selected = ref(null)
const tab = ref('command'), command = ref('uname -a'), output = ref(''), events = ref([]), notice = ref('')
const filePath = ref('/tmp/sandbase-playground.txt'), content = ref('Hello from Sandbox Playground'), fileStatus = ref('')
const evidence = ref(tx('Not loaded')), observation = ref('metrics'), ttl = ref(120), requestExample = ref(tx('Connect to view a request example.'))
const eventNotice = ref(tx('Refresh to load lifecycle events for the selected instance.'))
const pendingCreate = ref(''), observedPause = new Set(), restored = new Set(), saved = new Map(), tokens = new Map()
const connectionID = ref(''); let controller
const responseSignals = new WeakMap()
async function readResponse(response, format = 'json') {
  const signal = responseSignals.get(response)
  signal?.throwIfAborted()
  const value = await response[format]()
  signal?.throwIfAborted()
  return value
}
const idOf = x => x?.sandboxID || x?.sandboxId || x?.id
const id = computed(() => idOf(selected.value))
const owned = computed(() => selected.value?.metadata?.docsPlayground === connectionID.value)
const runnable = computed(() => owned.value && selected.value?.state === 'running' && tokens.has(id.value))
const counts = computed(() => !catalogLoaded.value ? tx('Not loaded') : tx('{public} public · {private} private', { public: templates.value.filter(t => t.public === true).length, private: templates.value.filter(t => t.public === false).length }))
const secrets = () => [key.value, ...tokens.values()]
const safe = value => redact(value, secrets())
function record(type, source, data) { events.value.unshift({ id: crypto.randomUUID(), type, source, time: new Date().toLocaleTimeString(), data: safe(data) }); events.value = events.value.slice(0, 100) }
async function api(path, method = 'GET', body, dataToken) {
  const signal = controller?.signal
  signal?.throwIfAborted()
  const headers = { 'X-API-Key': key.value, 'X-Sandbox-Playground': '1' }
  if (dataToken) headers['X-Access-Token'] = dataToken
  if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body) }
  const response = await fetch(`/docs/_sandbox${path}`, { method, headers, body, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal })
  signal?.throwIfAborted()
  responseSignals.set(response, signal)
  if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.error?.code || `http_${response.status}`) }
  return response
}
async function control(path, method = 'GET', body) {
  requestExample.value = path.startsWith('/sandbox-gateway/') ? tx('Usage details are shown in the Observe tab.') : `${method} https://sandbox.sandbase.ai${path}\nX-API-Key: <YOUR_API_KEY>${body ? '\n\n' + JSON.stringify(body, null, 2) : ''}`
  const response = await api('/control' + path, method, body)
  return response.status === 204 ? null : readResponse(response)
}
const pending = label => tx('{action}…', { action: tx(label) })
async function act(label, fn) {
  if (busy.value) return
  busy.value = true; const active = new AbortController(); controller = active; notice.value = pending(label)
  try { await fn(); if (active.signal.aborted) return; if (notice.value === pending(label)) notice.value = tx('{action} completed.', { action: tx(label) }) }
  catch (e) { if (active.signal.aborted) return; notice.value = tx('Not completed: {error}. The result may be unknown. Refresh to reconcile before retrying.', { error: safe(e.message) }); record('request.failed', 'Playground', { action: label, code: e.message }) }
  finally { if (controller === active) { busy.value = false; controller = null } }
}
async function list() {
  const rows = []; let next = '', pages = 0
  do {
    const query = new URLSearchParams({ limit: '100', state: 'running,paused' }); if (next) query.set('nextToken', next)
    const response = await api('/control/v2/sandboxes?' + query)
    const page = await readResponse(response); if (!Array.isArray(page)) throw new Error('invalid_list')
    rows.push(...page); next = response.headers.get('X-Next-Token') || ''
  } while (next && ++pages < 10)
  instances.value = rows
  if (next) notice.value = tx('Showing the first 1,000 instances. An instance missing from this list may still exist.')
  if (pendingCreate.value && rows.some(x => x.metadata?.docsCreate === pendingCreate.value && x.metadata?.docsPlayground === connectionID.value)) pendingCreate.value = ''
  if (selected.value) selected.value = rows.find(x => idOf(x) === id.value) || null
}
async function connect() { await act('Load templates and instances', async () => {
  connectionID.value = crypto.randomUUID(); connected.value = true
  const first = await api('/control/v2/templates?limit=100')
  const catalog = await readResponse(first)
  if (!Array.isArray(catalog)) throw new Error('invalid_templates')
  let next = first.headers.get('X-Next-Token'), pages = 1
  while (next && pages++ < 10) {
    const page = await api('/control/v2/templates?' + new URLSearchParams({ limit: '100', nextToken: next }))
    const rows = await readResponse(page)
    if (!Array.isArray(rows)) throw new Error('invalid_templates')
    catalog.push(...rows); next = page.headers.get('X-Next-Token')
  }
  if (next) notice.value = tx('Showing the first 1,000 templates, not the full organization total.')
  templates.value = catalog.map(t => ({ ...t, label: templateLabel(t), runnable: t.buildStatus === 'ready' }))
  catalogLoaded.value = true
  template.value = templates.value.find(t => t.runnable)?.templateID || ''
  await list()
}) }
function forget() {
  controller?.abort(); controller = null; busy.value = false
  eventNotice.value = ''; template.value = ''; connectionID.value = ''; accepted.value = false; command.value = 'uname -a'; content.value = ''; filePath.value = '/tmp/sandbase-playground.txt'; fileStatus.value = ''; requestExample.value = tx('Connect to view a request example.')
  tokens.clear(); catalogLoaded.value = false; key.value = ''; connected.value = false; selected.value = null; instances.value = []; templates.value = []; events.value = []; output.value = ''; evidence.value = ''; saved.clear(); observedPause.clear(); restored.clear(); pendingCreate.value = ''; notice.value = tx('Key, connection tokens, and page activity cleared. Requests already sent may still complete. Your sandboxes have not been deleted.')
}
function select(value) {
  if (busy.value || idOf(value) === id.value) return
  selected.value = value
  output.value = ''; content.value = ''; fileStatus.value = ''; evidence.value = tx('Not loaded'); events.value = []
  requestExample.value = tx('Choose an operation to view its request example.')
  eventNotice.value = tx('Refresh to load lifecycle events for this instance.')
  notice.value = `${tx('Selected {id}.', { id: idOf(value) })} ${owned.value ? tx('Ready for this instance’s available operations.') : tx('Read-only instance. Only instances created in this page session can be changed.')}`
}
async function create() { if (!accepted.value || pendingCreate.value) return
  await act('Create sandbox', async () => {
    const attempt = crypto.randomUUID(); pendingCreate.value = attempt
    const result = await control('/v2/sandboxes', 'POST', { templateID: template.value, timeout: Number(ttl.value), metadata: { docsPlayground: connectionID.value, docsCreate: attempt } })
    const currentID = idOf(result); if (!currentID) throw new Error('create_result_unknown')
    if (result.envdAccessToken) tokens.set(currentID, result.envdAccessToken)
    selected.value = result; pendingCreate.value = ''; await list(); await loadEvents(); record('create.completed', 'Playground', { sandboxId: currentID })
  })
}
const lifecycleLabels = { pause: 'Pause', connect: 'Resume / Connect', timeout: 'Extend timeout', delete: 'Delete' }
async function lifecycle(action) {
  if (!owned.value) return
  if (action === 'delete' && !window.confirm(tx('Delete {id}? Files in this instance will be permanently lost.', { id: id.value }))) return
  await act(lifecycleLabels[action], async () => {
    const currentID = id.value
    if (action === 'delete') { await control(`/sandboxes/${currentID}`, 'DELETE'); tokens.delete(currentID); selected.value = null }
    else if (action === 'connect') {
      tokens.delete(currentID)
      const result = await control(`/v2/sandboxes/${currentID}/connect`, 'POST', { timeout: Number(ttl.value) })
      if (result.envdAccessToken) tokens.set(currentID, result.envdAccessToken)
      if (observedPause.has(currentID)) restored.add(currentID)
      selected.value = result
    } else {
      await control(`/sandboxes/${currentID}/${action}`, 'POST', action === 'timeout' ? { timeout: Number(ttl.value) } : {})
      if (action === 'pause') { tokens.delete(currentID); observedPause.add(currentID); restored.delete(currentID) }
    }
    await list(); if (selected.value) await loadEvents(); record(`${action}.completed`, 'Playground', { sandboxId: currentID })
  })
}
async function run() { if (!runnable.value) return
  await act('Run command', async () => {
    const signal = controller.signal
    let stdout = '', stderr = '', exit
    const stdoutDecoder = new TextDecoder(), stderrDecoder = new TextDecoder()
    const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0))
    output.value = ''; record('command.started', 'Playground', { sandboxId: id.value })
    requestExample.value = `// E2B JavaScript SDK\nawait sandbox.commands.run(${JSON.stringify(safe(command.value))}, { timeoutMs: 25_000 });`
    const response = await api(`/data/${id.value}/command`, 'POST', { command: command.value }, tokens.get(id.value))
    await readCommandStream(response.body, event => {
      signal.throwIfAborted()
      if (event.data?.stdout) stdout += stdoutDecoder.decode(bytes(event.data.stdout), { stream: true })
      if (event.data?.stderr) stderr += stderrDecoder.decode(bytes(event.data.stderr), { stream: true })
      // Hold a trailing credential-length window so split tokens never flash in the DOM.
      const hold = Math.max(1, ...secrets().map(s => s.length))
      output.value = safe(stdout).slice(0, Math.max(0, safe(stdout).length - hold)) + safe(stderr).slice(0, Math.max(0, safe(stderr).length - hold))
      if (event.start) record('process.started', 'Sandbox process', { pid: event.start.pid })
      if (event.data) record('process.output', 'Sandbox process', { stdoutBytes: stdout.length, stderrBytes: stderr.length })
      if (event.end) { exit = event.end.exitCode ?? 0; stdout += stdoutDecoder.decode(); stderr += stderrDecoder.decode() }
    })
    signal.throwIfAborted()
    output.value = safe(stdout + (stderr ? '\n[stderr]\n' + stderr : '') + `\n[exit ${exit}]`)
    record('command.completed', 'Playground', { exitCode: exit }); notice.value = tx('Command finished with exit code {code}.', { code: exit })
  })
}
async function file(write) { if (!runnable.value) return
  await act(write ? 'Write and read back' : 'Read file', async () => {
    const path = `/data/${id.value}/files?` + new URLSearchParams({ path: filePath.value })
    const slot = `${id.value}:${filePath.value}`
    if (write) {
      if (new TextEncoder().encode(content.value).length > 32768) throw new Error('file_limit_32KiB')
      const form = new FormData(); form.append('file', new Blob([content.value], { type: 'text/plain' }), 'playground.txt')
      await api(path, 'POST', form, tokens.get(id.value))
    }
    const result = await api(path, 'GET', undefined, tokens.get(id.value)); const text = await readResponse(result, 'text')
    if (text.length > 65536) throw new Error('file_too_large')
    if (write && text !== content.value) throw new Error('readback_mismatch')
    if (write) { saved.set(slot, text); restored.delete(id.value); fileStatus.value = tx('Write and readback match ✓') }
    else fileStatus.value = restored.has(id.value) && saved.has(slot) ? (saved.get(slot) === text ? tx('File preserved after pause → resume ✓') : tx('Content changed after resume')) : tx('Read complete; pause/resume verification is not yet complete')
    content.value = safe(text); record(write ? 'file.verified' : 'file.read', 'Playground', { path: filePath.value })
  })
}
async function loadEvents() {
  const signal = controller?.signal
  eventNotice.value = tx('Loading lifecycle events…')
  try {
    const rows = await control(`/events/sandboxes/${id.value}?limit=100`)
    if (!Array.isArray(rows)) throw new Error('invalid_events')
    for (const event of rows) if (!events.value.some(x => x.id === event.id && x.source === 'Sandbox lifecycle')) events.value.unshift({ id: event.id, type: event.type, source: 'Sandbox lifecycle', time: event.timestamp, data: safe(event) })
    events.value = events.value.slice(0, 100)
    eventNotice.value = rows.length ? '' : tx('No lifecycle events returned yet.')
  } catch (e) {
    if (signal?.aborted) throw e
    eventNotice.value = tx('Lifecycle events unavailable ({error}). Your selection and completed operations are unchanged.', { error: safe(e.message) })
    if (notice.value === pending('Refresh events')) notice.value = tx('Events could not be loaded. Your instance selection is unchanged.')
  }
}
async function observe() { if (!id.value) return
  await act('Load observations', async () => {
    const signal = controller.signal
    const paths = { metrics: `/sandboxes/${id.value}/metrics`, logs: `/v2/sandboxes/${id.value}/logs?limit=100`, usage: `/sandbox-gateway/sandboxes/${id.value}/usage` }
    evidence.value = tx('Loading…')
    try { evidence.value = safe(await control(paths[observation.value])) } catch (e) { if (signal.aborted) throw e; evidence.value = tx('Unavailable · No observation evidence received'); throw e }
  })
}
onMounted(() => window.addEventListener('pagehide', forget))
onBeforeUnmount(() => { window.removeEventListener('pagehide', forget); forget() })
</script>

<template>
  <div class="sp">
    <header class="sp-hero"><div><span class="sp-kicker">{{ tx('SANDBOX / DEVELOPER LAB') }}</span><h2>{{ tx('Run once. See every step.') }}</h2><p>{{ tx('Create, execute, pause, and resume. See the results as you go.') }}</p></div><span class="sp-badge">{{ tx('Experimental') }}</span></header>
    <div class="sp-auth">
      <div class="sp-auth-heading">
        <label for="sandbox-api-key">{{ tx('Your API key') }}</label>
        <span>{{ tx('No API key?') }} <a href="https://www.sandbase.ai/console/keys" target="_blank" rel="noopener noreferrer">{{ tx('Developer → API Keys') }} ↗</a></span>
      </div>
      <div class="sp-auth-row">
        <input id="sandbox-api-key" v-model="key" :disabled="connected || busy" type="password" autocomplete="off" :placeholder="tx('API key with Sandbox access')" />
        <button :disabled="!key.trim() || busy || connected" @click="connect">{{ tx('Connect') }}</button>
        <button :disabled="!key && !connected && !busy" @click="forget">{{ tx('Clear key') }}</button>
      </div>
      <small>{{ tx('Sign in or sign up in the Console, then create an API key to try the Playground.') }}</small>
      <small>{{ tx('Your key stays in this page’s memory only. This Playground does not save it in browser storage, add it to URLs, or record it in page activity. Clear it at any time with “Clear key”; refreshing or leaving this page also clears it.') }}</small>
    </div>
    <p class="sp-notice" role="status">{{ notice || tx('Connect your organization to begin. Operations use real resources and your own API key.') }}</p>
    <div class="sp-layout">
      <aside class="sp-resources">
        <h3>{{ tx('Environment') }} <small>{{ counts }}</small></h3>
        <label>{{ tx('Template') }}<select v-model="template" :disabled="busy || !connected"><option value="">{{ tx('Choose a template') }}</option><option v-for="t in templates" :key="t.templateID" :value="t.templateID" :disabled="!t.runnable">{{ t.public ? tx('Public') : tx('Private') }} · {{ t.label }}{{ t.runnable ? '' : ` (${t.buildStatus || tx('unavailable')})` }}</option></select></label>
        <label>{{ tx('Timeout (30–600 seconds)') }}<input v-model="ttl" type="number" min="30" max="600" :disabled="busy" /></label>
        <label class="sp-check"><input v-model="accepted" type="checkbox" /> {{ tx('I understand that real resources may incur charges. I will delete them after use.') }}</label>
        <button class="sp-primary" :disabled="busy || !connected || !template || !accepted || !!pendingCreate || Number(ttl) < 30 || Number(ttl) > 600" @click="create">＋ {{ tx('Create sandbox') }}</button>
        <p v-if="pendingCreate" class="sp-warn">{{ tx('Creation result is unknown. Refresh and reconcile this marker before creating again:') }} {{ pendingCreate }}</p>
        <h3>{{ tx('Instances') }} <button :disabled="busy || !connected" @click="act('Refresh', list)">{{ tx('Refresh') }}</button></h3>
        <p class="sp-muted">{{ busy ? tx('An operation is in progress. Selection unlocks when it finishes.') : tx('Click an instance to select it. Refresh to update its status.') }}</p><p v-if="!instances.length" class="sp-muted">{{ tx('No instances loaded') }}</p>
        <button v-for="s in instances" :key="idOf(s)" class="sp-instance" :class="{ chosen: idOf(s) === id }" :aria-pressed="idOf(s) === id" :title="busy ? tx('Wait for the current operation to finish') : tx('Select {id}', { id: idOf(s) })" :disabled="busy" @click="select(s)"><span class="sp-instance-id">{{ idOf(s) }}</span><span v-if="idOf(s) === id" class="sp-selected">✓ {{ tx('Selected') }}</span><small>{{ s.state }} · {{ s.metadata?.docsPlayground === connectionID ? tx('Created here') : tx('Read-only') }}</small></button>
      </aside>
      <section class="sp-work">
        <div class="sp-current"><strong>{{ id || tx('Select an instance') }}</strong><span>{{ selected?.state || tx('Disconnected') }}</span></div>
        <div class="sp-actions"><button :disabled="busy || !owned || selected?.state !== 'running'" @click="lifecycle('pause')">{{ tx('Pause') }}</button><button :disabled="busy || !owned" @click="lifecycle('connect')">{{ tx('Resume / Connect') }}</button><button :disabled="busy || !owned" @click="lifecycle('timeout')">{{ tx('Extend timeout') }}</button><button :disabled="busy || !owned" @click="lifecycle('delete')">{{ tx('Delete') }}</button></div>
        <nav class="sp-tabs" :aria-label="tx('Playground tools')"><button v-for="[value,label] in [['command','Commands'],['files','Files'],['observe','Observe']]" :key="value" :class="{ active: tab === value }" @click="tab = value">{{ tx(label) }}</button></nav>
        <div v-if="tab === 'command'"><p class="sp-muted">{{ tx('Shell commands, not AI chat. Each command can run for up to 25 seconds.') }}</p><div class="sp-actions"><button :disabled="busy" @click="command = 'uname -a'">{{ tx('System info') }}</button><button :disabled="busy" @click="command = `python3 -c 'print(2 ** 20)'`">{{ tx('Try Python') }}</button><button :disabled="busy" @click="command = 'cat /tmp/sandbase-playground.txt'">{{ tx('Verify file') }}</button></div><label>{{ tx('Command') }}<textarea v-model="command" :disabled="busy" rows="3" spellcheck="false" /></label><button class="sp-primary" :disabled="busy || !runnable || !command.trim()" @click="run">{{ tx('Run command') }} ↗</button><pre aria-live="polite">{{ output || tx('stdout / stderr will appear here.') }}</pre></div>
        <div v-if="tab === 'files'"><p class="sp-muted">{{ tx('Write → pause → resume → read back to verify file persistence.') }}</p><label>{{ tx('Text file path under /tmp/') }}<input v-model="filePath" :disabled="busy" /></label><label>{{ tx('Contents') }}<textarea v-model="content" :disabled="busy" rows="6" /></label><div class="sp-actions"><button :disabled="busy || !runnable" @click="file(true)">{{ tx('Write & verify') }}</button><button :disabled="busy || !runnable" @click="file(false)">{{ tx('Read back file') }}</button></div><p role="status">{{ fileStatus }}</p></div>
        <div v-if="tab === 'observe'"><p class="sp-muted">{{ tx('Missing evidence does not mean zero usage. Machine-time records are not final billing.') }}</p><label>{{ tx('Observation type') }}<select v-model="observation" :disabled="busy"><option value="metrics">{{ tx('CPU / memory metrics') }}</option><option value="logs">{{ tx('Instance logs') }}</option><option value="usage">{{ tx('Machine-time evidence') }}</option></select></label><button :disabled="busy || !id" @click="observe">{{ tx('Load') }}</button><pre>{{ evidence }}</pre></div>
        <details class="sp-request"><summary>{{ tx('Request example (credentials omitted)') }}</summary><pre>{{ requestExample }}</pre></details>
      </section>
      <aside class="sp-events"><h3>{{ tx('Events') }} <button :disabled="busy || !id" @click="act('Refresh events', loadEvents)">{{ tx('Refresh') }}</button></h3><p class="sp-muted">{{ tx('Refresh lifecycle events manually. Process output arrives as a live stream. Each event is labeled by source.') }}</p><p v-if="eventNotice" class="sp-muted" role="status">{{ eventNotice }}</p><article v-for="event in events" :key="event.source + event.id"><small>{{ event.source }} · {{ event.time }}</small><strong>{{ event.type }}</strong><details><summary>{{ tx('Event data') }}</summary><pre>{{ event.data }}</pre></details></article></aside>
    </div>
    <p class="sp-foot">{{ tx('Leaving this page does not delete sandboxes. Delete instances created here, including paused ones. After a refresh, use your organization tools to clean up.') }}</p>
  </div>
</template>

<style scoped>
.sp {
  --accent: var(--vp-c-brand-1);
  container: playground / inline-size;
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: 13px/1.6 var(--vp-font-family-base);
  overflow: hidden;
}
.sp.sp h2, .sp.sp h3, .sp.sp p { margin: 0; padding: 0; border: 0; letter-spacing: normal; }
.sp.sp h2 { font-size: 24px; line-height: 1.3; margin: 8px 0; }
.sp.sp h3 { font-size: 13px; line-height: 1.5; font-weight: 500; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 16px; }
.sp.sp p { font-size: 12px; line-height: 1.65; }
.sp-hero { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px; background: var(--vp-c-bg); border-bottom: 1px solid var(--vp-c-divider); }
.sp-hero p, .sp-muted, .sp-auth small { color: var(--vp-c-text-2); }
.sp-kicker { font: 11px var(--vp-font-family-mono); letter-spacing: 1.5px; color: var(--accent); }
.sp-badge { flex-shrink: 0; border: 1px solid var(--vp-c-divider); border-radius: 0; padding: 3px 10px; font-size: 11px; }
.sp-auth { padding: 20px 24px; display: grid; gap: 10px; }
.sp-auth-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 8px 20px; flex-wrap: wrap; }
.sp .sp-auth-heading label { margin: 0; }
.sp-auth-heading span { font-size: 12px; color: var(--vp-c-text-2); }
.sp .sp-auth-heading a { color: var(--accent); font-size: inherit; }
.sp-auth-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: stretch; gap: 10px; }
.sp .sp-auth-row input:not([type=checkbox]) { margin: 0; height: 40px; }
.sp .sp-auth-row button { height: 40px; white-space: nowrap; }
.sp-auth small { font-size: 11px; }
.sp label { display: block; margin: 10px 0; color: var(--vp-c-text-2); font-size: 12px; }
.sp input:not([type=checkbox]), .sp textarea, .sp select { width: 100%; min-width: 0; display: block; margin-top: 6px; padding: 8px 10px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); border-radius: 0; color: var(--vp-c-text-1); font: inherit; }
.sp textarea { font: 12px/1.7 var(--vp-font-family-mono); resize: vertical; }
.sp button { border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); padding: 6px 10px; border-radius: 0; font: inherit; font-size: 12px; cursor: pointer; }
.sp button:disabled { opacity: .4; cursor: not-allowed; }
.sp button:focus-visible, .sp input:focus-visible, .sp select:focus-visible, .sp textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.sp .sp-primary { background: var(--accent); color: var(--vp-c-white); border-color: var(--accent); }
.sp.sp .sp-notice { padding: 10px 24px; border-block: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); overflow-wrap: anywhere; }
.sp-layout { display: grid; grid-template-columns: 210px minmax(300px, 1fr) minmax(230px, .7fr); align-items: stretch; }
.sp-resources, .sp-work, .sp-events { padding: 20px; min-width: 0; }
.sp-resources { border-right: 1px solid var(--vp-c-divider); }
.sp h3 small { font-size: 11px; font-weight: 400; }
.sp h3 button { font-size: 11px; padding: 3px 7px; }
.sp-check { font-size: 11px !important; }
.sp-check input { margin-right: 6px; }
.sp .sp-instance { display: block; text-align: left; width: 100%; margin-top: 8px; overflow-wrap: anywhere; font: 11px/1.5 var(--vp-font-family-mono); }
.sp-instance small { display: block; margin-top: 6px; color: var(--vp-c-text-2); font: 10px var(--vp-font-family-base); }
.sp .sp-instance:hover:not(:disabled) { border-color: var(--accent); }
.sp-instance-id { display: block; }
.sp-selected { display: block; margin-top: 6px; color: var(--accent); font: 11px var(--vp-font-family-base); }
.sp-instance.chosen { border-color: var(--accent); background: var(--vp-c-brand-soft); }
.sp.sp .sp-resources > h3:not(:first-child) { margin-top: 24px; }
.sp-current { display: flex; justify-content: space-between; gap: 10px; overflow-wrap: anywhere; margin-bottom: 16px; }
.sp-current strong { font: 12px/1.5 var(--vp-font-family-mono); min-width: 0; }
.sp-current span { font-size: 11px; color: var(--accent); }
.sp-actions { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }
.sp-tabs { display: flex; gap: 20px; border-bottom: 1px solid var(--vp-c-divider); margin: 18px 0; }
.sp-tabs button { background: none; border: 0; border-radius: 0; padding: 10px 0; }
.sp-tabs .active { border-bottom: 2px solid var(--accent); color: var(--accent); }
.sp.sp pre { white-space: pre-wrap; overflow-wrap: anywhere; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 0; padding: 12px; font: 11px/1.75 var(--vp-font-family-mono); max-height: 280px; overflow: auto; margin: 14px 0; }
.sp-events { border-left: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); max-height: 680px; overflow: auto; }
.sp-events article { border-left: 2px solid var(--vp-c-divider); padding: 4px 12px; margin: 16px 0; overflow-wrap: anywhere; }
.sp-events article strong { display: block; font: 11px/1.6 var(--vp-font-family-mono); margin: 5px 0; }
.sp-events small { font-size: 11px; color: var(--vp-c-text-2); }
.sp summary { cursor: pointer; font-size: 11px; color: var(--vp-c-text-2); }
.sp.sp .sp-foot { padding: 14px 24px; border-top: 1px solid var(--vp-c-divider); font-size: 11px; color: var(--vp-c-text-2); }
.sp.sp .sp-warn { font-size: 11px; color: var(--vp-c-warning-1); overflow-wrap: anywhere; }
.sp-request { margin-top: 24px; }
@container playground (max-width: 850px) {
  .sp-layout { grid-template-columns: minmax(0, 1fr) minmax(210px, .65fr); }
  .sp-resources { grid-column: 1 / -1; border-right: 0; border-bottom: 1px solid var(--vp-c-divider); display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; align-items: start; }
  .sp.sp .sp-resources h3, .sp-resources .sp-warn, .sp-resources .sp-muted { grid-column: 1 / -1; margin: 0; }
  .sp-work, .sp-events { padding: 16px; }
}
@container playground (max-width: 520px) {
  .sp-auth-row { grid-template-columns: 1fr 1fr; }
  .sp-auth-row input { grid-column: 1 / -1; }
  .sp-layout { grid-template-columns: minmax(0, 1fr); }
  .sp-resources { display: block; }
  .sp-events { border-left: 0; border-top: 1px solid var(--vp-c-divider); max-height: 360px; }
  .sp-hero { padding: 18px; align-items: start; }
  .sp.sp h2 { font-size: 20px; }
  .sp-current { flex-wrap: wrap; }
}
</style>
