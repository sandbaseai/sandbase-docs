<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { templateLabel, redact, readCommandStream } from './sandbox-client.mjs'
const key = ref(''), connected = ref(false), busy = ref(false), accepted = ref(false)
const catalogLoaded = ref(false)
const templates = ref([]), template = ref(''), instances = ref([]), selected = ref(null)
const tab = ref('command'), command = ref('uname -a'), output = ref(''), events = ref([]), notice = ref('')
const filePath = ref('/tmp/sandbase-playground.txt'), content = ref('Hello from Sandbox Playground'), fileStatus = ref('')
const evidence = ref('Not loaded'), observation = ref('metrics'), ttl = ref(120), requestExample = ref('Connect to view a request example.')
const pendingCreate = ref(''), observedPause = new Set(), restored = new Set(), saved = new Map(), tokens = new Map()
const connectionID = ref(''); let controller
const idOf = x => x?.sandboxID || x?.sandboxId || x?.id
const id = computed(() => idOf(selected.value))
const owned = computed(() => selected.value?.metadata?.docsPlayground === connectionID.value)
const runnable = computed(() => owned.value && selected.value?.state === 'running' && tokens.has(id.value))
const counts = computed(() => !catalogLoaded.value ? 'Not loaded' : `${templates.value.filter(t => t.public === true).length} public · ${templates.value.filter(t => t.public === false).length} private`)
const secrets = () => [key.value, ...tokens.values()]
const safe = value => redact(value, secrets())
function record(type, source, data) { events.value.unshift({ id: crypto.randomUUID(), type, source, time: new Date().toLocaleTimeString(), data: safe(data) }); events.value = events.value.slice(0, 100) }
async function api(path, method = 'GET', body, dataToken) {
  const headers = { 'X-API-Key': key.value, 'X-Sandbox-Playground': '1' }
  if (dataToken) headers['X-Access-Token'] = dataToken
  if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body) }
  const response = await fetch(`/docs/_sandbox${path}`, { method, headers, body, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller?.signal })
  if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.error?.code || `http_${response.status}`) }
  return response
}
async function control(path, method = 'GET', body) {
  requestExample.value = `${method} https://sandbox.sandbase.ai${path}\nX-API-Key: <YOUR_API_KEY>${body ? '\n\n' + JSON.stringify(body, null, 2) : ''}`
  const response = await api('/control' + path, method, body)
  return response.status === 204 ? null : response.json()
}
async function act(label, fn) {
  if (busy.value) return
  busy.value = true; controller = new AbortController(); notice.value = label + '…'
  try { await fn(); if (notice.value === label + '…') notice.value = label + ' completed.' }
  catch (e) { notice.value = `Not completed: ${safe(e.message)}. The result may be unknown. Refresh to reconcile before retrying.`; record('request.failed', 'Playground', { action: label, code: e.message }) }
  finally { busy.value = false; controller = null }
}
async function list() {
  const rows = []; let next = '', pages = 0
  do {
    const query = new URLSearchParams({ limit: '100', state: 'running,paused' }); if (next) query.set('nextToken', next)
    const response = await api('/control/v2/sandboxes?' + query)
    const page = await response.json(); if (!Array.isArray(page)) throw new Error('invalid_list')
    rows.push(...page); next = response.headers.get('X-Next-Token') || ''
  } while (next && ++pages < 10)
  instances.value = rows
  if (next) notice.value = 'Showing the first 1,000 instances. An instance missing from this list may still exist.'
  if (pendingCreate.value && rows.some(x => x.metadata?.docsCreate === pendingCreate.value && x.metadata?.docsPlayground === connectionID.value)) pendingCreate.value = ''
  if (selected.value) selected.value = rows.find(x => idOf(x) === id.value) || null
}
async function connect() { await act('Load templates and instances', async () => {
  connectionID.value = crypto.randomUUID(); connected.value = true
  const [first, available] = await Promise.all([api('/control/v2/templates?limit=100'), control('/templates')])
  const catalog = await first.json(); let next = first.headers.get('X-Next-Token'), pages = 1
  while (next && pages++ < 10) {
    const page = await api('/control/v2/templates?' + new URLSearchParams({ limit: '100', nextToken: next }))
    catalog.push(...await page.json()); next = page.headers.get('X-Next-Token')
  }
  if (next) notice.value = 'Showing the first 1,000 templates, not the full organization total.'
  if (!Array.isArray(catalog) || !Array.isArray(available)) throw new Error('invalid_templates')
  const enabled = new Map(available.map(t => [idOf(t) || t.templateID, t]))
  templates.value = catalog.map(t => ({ ...enabled.get(t.templateID), ...t, label: templateLabel({ ...enabled.get(t.templateID), ...t }), runnable: enabled.has(t.templateID) }))
  catalogLoaded.value = true
  template.value = templates.value.find(t => t.runnable)?.templateID || ''
  await list()
}) }
function forget() {
  if (busy.value) return
  tokens.clear(); catalogLoaded.value = false; key.value = ''; connected.value = false; selected.value = null; instances.value = []; templates.value = []; events.value = []; output.value = ''; evidence.value = ''; saved.clear(); observedPause.clear(); restored.clear(); pendingCreate.value = ''; notice.value = 'Page credentials cleared. Leaving this page does not delete sandboxes. Clean up your resources.'
}
async function select(value) { await act('Load instance', async () => {
  selected.value = await control(`/sandboxes/${idOf(value)}`); output.value = ''; fileStatus.value = ''; evidence.value = 'Not loaded'; await loadEvents()
}) }
async function create() { if (!accepted.value || pendingCreate.value) return
  await act('Create sandbox', async () => {
    const attempt = crypto.randomUUID(); pendingCreate.value = attempt
    const result = await control('/v2/sandboxes', 'POST', { templateID: template.value, timeout: Number(ttl.value), metadata: { docsPlayground: connectionID.value, docsCreate: attempt } })
    const currentID = idOf(result); if (!currentID) throw new Error('create_result_unknown')
    if (result.envdAccessToken) tokens.set(currentID, result.envdAccessToken)
    selected.value = result; pendingCreate.value = ''; await list(); await loadEvents(); record('create.completed', 'Playground', { sandboxId: currentID })
  })
}
async function lifecycle(action) {
  if (!owned.value) return
  if (action === 'delete' && !window.confirm(`Delete ${id.value}? Files in this instance will be permanently lost.`)) return
  await act(action, async () => {
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
    let stdout = '', stderr = '', exit
    const stdoutDecoder = new TextDecoder(), stderrDecoder = new TextDecoder()
    const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0))
    output.value = ''; record('command.started', 'Playground', { sandboxId: id.value })
    requestExample.value = 'POST https://49983-<sandboxID>.sandbox.sandbase.ai/process.Process/Start\nX-Access-Token: <SESSION_TOKEN>\nContent-Type: application/connect+json\n\nConnect streaming protocol; commands have a 25-second limit.'
    const response = await api(`/data/${id.value}/command`, 'POST', { command: command.value }, tokens.get(id.value))
    await readCommandStream(response.body, event => {
      if (event.data?.stdout) stdout += stdoutDecoder.decode(bytes(event.data.stdout), { stream: true })
      if (event.data?.stderr) stderr += stderrDecoder.decode(bytes(event.data.stderr), { stream: true })
      // Hold a trailing credential-length window so split tokens never flash in the DOM.
      const hold = Math.max(1, ...secrets().map(s => s.length))
      output.value = safe(stdout).slice(0, Math.max(0, safe(stdout).length - hold)) + safe(stderr).slice(0, Math.max(0, safe(stderr).length - hold))
      if (event.start) record('process.started', 'Sandbox process', { pid: event.start.pid })
      if (event.data) record('process.output', 'Sandbox process', { stdoutBytes: stdout.length, stderrBytes: stderr.length })
      if (event.end) { exit = event.end.exitCode ?? 0; stdout += stdoutDecoder.decode(); stderr += stderrDecoder.decode() }
    })
    output.value = safe(stdout + (stderr ? '\n[stderr]\n' + stderr : '') + `\n[exit ${exit}]`)
    record('command.completed', 'Playground', { exitCode: exit }); notice.value = `Command finished with exit code ${exit}.`
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
    const result = await api(path, 'GET', undefined, tokens.get(id.value)); const text = await result.text()
    if (text.length > 65536) throw new Error('file_too_large')
    if (write && text !== content.value) throw new Error('readback_mismatch')
    if (write) { saved.set(slot, text); restored.delete(id.value); fileStatus.value = 'Write and readback match ✓' }
    else fileStatus.value = restored.has(id.value) && saved.has(slot) ? (saved.get(slot) === text ? 'File preserved after pause → resume ✓' : 'Content changed after resume') : 'Read complete; pause/resume verification is not yet complete'
    content.value = safe(text); record(write ? 'file.verified' : 'file.read', 'Playground', { path: filePath.value })
  })
}
async function loadEvents() {
  const rows = await control(`/events/sandboxes/${id.value}?limit=100`)
  for (const event of Array.isArray(rows) ? rows : []) if (!events.value.some(x => x.id === event.id && x.source === 'Gateway lifecycle')) events.value.unshift({ id: event.id, type: event.type, source: 'Gateway lifecycle', time: event.timestamp, data: safe(event) })
  events.value = events.value.slice(0, 100)
}
async function observe() { if (!id.value) return
  await act('Load observations', async () => {
    const paths = { metrics: `/sandboxes/${id.value}/metrics`, logs: `/v2/sandboxes/${id.value}/logs?limit=100`, usage: `/sandbox-gateway/sandboxes/${id.value}/usage` }
    evidence.value = 'Loading…'
    try { evidence.value = safe(await control(paths[observation.value])) } catch (e) { evidence.value = 'Unavailable · No observation evidence received'; throw e }
  })
}
onBeforeUnmount(() => { controller?.abort(); tokens.clear(); key.value = '' })
</script>

<template>
  <div class="sp">
    <header class="sp-hero"><div><span class="sp-kicker">SANDBOX / DEVELOPER LAB</span><h2>Run once. See every step.</h2><p>Create, execute, pause, and resume. See the results as you go.</p></div><span class="sp-badge">Experimental</span></header>
    <div class="sp-auth">
      <label>Your API key<input v-model="key" :disabled="connected || busy" type="password" autocomplete="off" placeholder="API key with Sandbox access" /></label>
      <button :disabled="!key.trim() || busy || connected" @click="connect">Connect</button><button :disabled="busy || !connected" @click="forget">Clear credentials</button>
      <small>sandbox.sandbase.ai · Your key stays in page memory and is forwarded by the docs proxy. Re-enter it after a refresh.</small>
    </div>
    <p class="sp-notice" role="status">{{ notice || 'Connect your organization to begin. Operations use real resources and your own API key.' }}</p>
    <div class="sp-layout">
      <aside class="sp-resources">
        <h3>Environment <small>{{ counts }}</small></h3>
        <label>Template<select v-model="template" :disabled="busy || !connected"><option value="">Choose a template</option><option v-for="t in templates" :key="t.templateID" :value="t.templateID" :disabled="!t.runnable">{{ t.public ? 'Public' : 'Private' }} · {{ t.label }}{{ t.runnable ? '' : ' (unavailable)' }}</option></select></label>
        <label>Timeout (30–600 seconds)<input v-model="ttl" type="number" min="30" max="600" :disabled="busy" /></label>
        <label class="sp-check"><input v-model="accepted" type="checkbox" /> I understand that real resources may incur charges. I will delete them after use.</label>
        <button class="sp-primary" :disabled="busy || !connected || !template || !accepted || !!pendingCreate || Number(ttl) < 30 || Number(ttl) > 600" @click="create">＋ Create sandbox</button>
        <p v-if="pendingCreate" class="sp-warn">Creation result is unknown. Refresh and reconcile this marker before creating again: {{ pendingCreate }}</p>
        <h3>Instances <button :disabled="busy || !connected" @click="act('Refresh', list)">Refresh</button></h3>
        <p v-if="!instances.length" class="sp-muted">No instances loaded</p>
        <button v-for="s in instances" :key="idOf(s)" class="sp-instance" :class="{ chosen: idOf(s) === id }" :disabled="busy" @click="select(s)">{{ idOf(s) }}<small>{{ s.state }} · {{ s.metadata?.docsPlayground === connectionID ? 'Created here' : 'Read-only' }}</small></button>
      </aside>
      <section class="sp-work">
        <div class="sp-current"><strong>{{ id || 'Select an instance' }}</strong><span>{{ selected?.state || 'Disconnected' }}</span></div>
        <div class="sp-actions"><button :disabled="busy || !owned || selected?.state !== 'running'" @click="lifecycle('pause')">Pause</button><button :disabled="busy || !owned" @click="lifecycle('connect')">Resume / Connect</button><button :disabled="busy || !owned" @click="lifecycle('timeout')">Extend timeout</button><button :disabled="busy || !owned" @click="lifecycle('delete')">Delete</button></div>
        <nav class="sp-tabs" aria-label="Playground tools"><button v-for="[value,label] in [['command','Commands'],['files','Files'],['observe','Observe']]" :key="value" :class="{ active: tab === value }" @click="tab = value">{{ label }}</button></nav>
        <div v-if="tab === 'command'"><p class="sp-muted">Shell commands, not AI chat. Each command can run for up to 25 seconds.</p><div class="sp-actions"><button :disabled="busy" @click="command = 'uname -a'">System info</button><button :disabled="busy" @click="command = `python3 -c 'print(2 ** 20)'`">Try Python</button><button :disabled="busy" @click="command = 'cat /tmp/sandbase-playground.txt'">Verify file</button></div><label>Command<textarea v-model="command" :disabled="busy" rows="3" spellcheck="false" /></label><button class="sp-primary" :disabled="busy || !runnable || !command.trim()" @click="run">Run command ↗</button><pre aria-live="polite">{{ output || 'stdout / stderr will appear here.' }}</pre></div>
        <div v-if="tab === 'files'"><p class="sp-muted">Write → pause → resume → read back to verify file persistence.</p><label>Text file path under /tmp/<input v-model="filePath" :disabled="busy" /></label><label>Contents<textarea v-model="content" :disabled="busy" rows="6" /></label><div class="sp-actions"><button :disabled="busy || !runnable" @click="file(true)">Write & verify</button><button :disabled="busy || !runnable" @click="file(false)">Read back file</button></div><p role="status">{{ fileStatus }}</p></div>
        <div v-if="tab === 'observe'"><p class="sp-muted">Missing evidence does not mean zero usage. Machine-time records are not final billing.</p><label>Observation type<select v-model="observation" :disabled="busy"><option value="metrics">CPU / memory metrics</option><option value="logs">Instance logs</option><option value="usage">Machine-time evidence</option></select></label><button :disabled="busy || !id" @click="observe">Load</button><pre>{{ evidence }}</pre></div>
        <details class="sp-request"><summary>Request example (credentials omitted)</summary><pre>{{ requestExample }}</pre></details>
      </section>
      <aside class="sp-events"><h3>Events <button :disabled="busy || !id" @click="act('Refresh events', loadEvents)">Refresh</button></h3><p class="sp-muted">Refresh gateway events manually. Process output arrives as a live stream. Each event is labeled by source.</p><p v-if="!events.length" class="sp-muted">Events appear here as you work.</p><article v-for="event in events" :key="event.source + event.id"><small>{{ event.source }} · {{ event.time }}</small><strong>{{ event.type }}</strong><details><summary>Event data</summary><pre>{{ event.data }}</pre></details></article></aside>
    </div>
    <p class="sp-foot">Leaving this page does not delete sandboxes. Delete instances created here, including paused ones. After a refresh, use your organization tools to clean up.</p>
  </div>
</template>

<style scoped>
.sp {
  --accent: var(--vp-c-brand-1);
  container: playground / inline-size;
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: 13px/1.6 var(--vp-font-family-base);
  overflow: hidden;
}
.sp.sp h2, .sp.sp h3, .sp.sp p { margin: 0; padding: 0; border: 0; letter-spacing: normal; }
.sp.sp h2 { font-size: 24px; line-height: 1.3; margin: 8px 0; }
.sp.sp h3 { font-size: 13px; line-height: 1.5; font-weight: 600; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 16px; }
.sp.sp p { font-size: 12px; line-height: 1.65; }
.sp-hero { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px; background: var(--vp-c-bg-soft); }
.sp-hero p, .sp-muted, .sp-auth small { color: var(--vp-c-text-2); }
.sp-kicker { font: 10px var(--vp-font-family-mono); letter-spacing: 1.5px; color: var(--accent); }
.sp-badge { flex-shrink: 0; border: 1px solid var(--vp-c-divider); border-radius: 20px; padding: 3px 10px; font-size: 11px; }
.sp-auth { padding: 16px 24px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sp-auth label { flex: 1; min-width: 200px; }
.sp-auth small { flex-basis: 100%; font-size: 11px; }
.sp label { display: block; margin: 10px 0; color: var(--vp-c-text-2); font-size: 12px; }
.sp input:not([type=checkbox]), .sp textarea, .sp select { width: 100%; min-width: 0; display: block; margin-top: 6px; padding: 8px 10px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); border-radius: 6px; color: var(--vp-c-text-1); font: inherit; }
.sp textarea { font: 12px/1.7 var(--vp-font-family-mono); resize: vertical; }
.sp button { border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); padding: 6px 10px; border-radius: 6px; font: inherit; font-size: 12px; cursor: pointer; }
.sp button:disabled { opacity: .4; cursor: not-allowed; }
.sp button:focus-visible, .sp input:focus-visible, .sp select:focus-visible, .sp textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.sp .sp-primary { background: var(--accent); color: var(--vp-c-white); border-color: var(--accent); }
.sp.sp .sp-notice { padding: 10px 24px; border-block: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); overflow-wrap: anywhere; }
.sp-layout { display: grid; grid-template-columns: 210px minmax(300px, 1fr) minmax(230px, .7fr); align-items: stretch; }
.sp-resources, .sp-work, .sp-events { padding: 20px; min-width: 0; }
.sp-resources { border-right: 1px solid var(--vp-c-divider); }
.sp h3 small { font-size: 10px; font-weight: 400; }
.sp h3 button { font-size: 10px; padding: 3px 7px; }
.sp-check { font-size: 11px !important; }
.sp-check input { margin-right: 6px; }
.sp .sp-instance { display: block; text-align: left; width: 100%; margin-top: 8px; overflow-wrap: anywhere; font: 11px/1.5 var(--vp-font-family-mono); }
.sp-instance small { display: block; margin-top: 6px; color: var(--vp-c-text-2); font: 10px var(--vp-font-family-base); }
.sp-instance.chosen { border-color: var(--accent); background: var(--vp-c-brand-soft); }
.sp.sp .sp-resources > h3:not(:first-child) { margin-top: 24px; }
.sp-current { display: flex; justify-content: space-between; gap: 10px; overflow-wrap: anywhere; margin-bottom: 16px; }
.sp-current strong { font: 12px/1.5 var(--vp-font-family-mono); min-width: 0; }
.sp-current span { font-size: 10px; color: var(--accent); }
.sp-actions { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }
.sp-tabs { display: flex; gap: 20px; border-bottom: 1px solid var(--vp-c-divider); margin: 18px 0; }
.sp-tabs button { background: none; border: 0; border-radius: 0; padding: 10px 0; }
.sp-tabs .active { border-bottom: 2px solid var(--accent); color: var(--accent); }
.sp.sp pre { white-space: pre-wrap; overflow-wrap: anywhere; background: var(--vp-c-bg-soft); border-radius: 6px; padding: 12px; font: 11px/1.75 var(--vp-font-family-mono); max-height: 280px; overflow: auto; margin: 14px 0; }
.sp-events { border-left: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); max-height: 680px; overflow: auto; }
.sp-events article { border-left: 2px solid var(--vp-c-divider); padding: 4px 12px; margin: 16px 0; overflow-wrap: anywhere; }
.sp-events article strong { display: block; font: 11px/1.6 var(--vp-font-family-mono); margin: 5px 0; }
.sp-events small { font-size: 10px; color: var(--vp-c-text-2); }
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
  .sp-layout { grid-template-columns: minmax(0, 1fr); }
  .sp-resources { display: block; }
  .sp-events { border-left: 0; border-top: 1px solid var(--vp-c-divider); max-height: 360px; }
  .sp-hero { padding: 18px; align-items: start; }
  .sp.sp h2 { font-size: 20px; }
  .sp-current { flex-wrap: wrap; }
}
</style>
