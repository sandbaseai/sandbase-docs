<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { generatedApiReferenceSpecs } from './generatedApiReferenceSpecs'

type ApiField = {
  name: string
  type: string
  required?: boolean
  description: string
  default?: string
  constraints?: string
}

type ApiFieldGroup = {
  title: string
  description?: string
  schema?: string
  fields: ApiField[]
}

type ApiExample = {
  label: string
  language: string
  code: string
}

type ApiError = {
  status: number | string
  type: string
  description: string
}

type ApiReference = {
  title: string
  method: string
  path: string
  description: string
  operation?: string
  signature?: string
  groups?: ApiFieldGroup[]
  examples: ApiExample[]
  response?: {
    status: string
    code: string
  }
  notes?: Array<{ title: string; description: string }>
  errors?: ApiError[]
}

// Environment resources are internal implementation details. Older generated
// references may still contain environment_id in examples or response samples;
// strip those fields at render time so public docs never advertise the retired
// Environment API.
function sanitizePublicReference(reference: ApiReference): ApiReference {
  const clone = JSON.parse(JSON.stringify(reference)) as ApiReference
  const stripInternalFields = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(stripInternalFields)
    if (!value || typeof value !== 'object') return value
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'environment_id' && key !== 'environment_binding')
        .map(([key, entry]) => [key, stripInternalFields(entry)]),
    )
  }
  clone.groups = clone.groups?.map((group) => ({
    ...group,
    fields: group.fields.filter((field) => field.name !== 'environment_id'),
  }))
  clone.examples = (clone.examples ?? []).map((example) => ({
    ...example,
    code: example.code
      .replace(/\s*\\n\s*\\?\s*"environment_id"\s*:\s*"[^"]+",?/g, '')
      .replace(/\s*"environment_id"\s*:\s*"[^"]+",?/g, ''),
  }))
  if (clone.response?.code) {
    try {
      const body = JSON.parse(clone.response.code)
      clone.response.code = JSON.stringify(stripInternalFields(body), null, 2)
    } catch {
      clone.response.code = clone.response.code.replace(/\s*\\n\s*\\?\s*"environment_id"\s*:\s*"[^"]+",?/g, '')
    }
  }
  return clone
}

const { frontmatter } = useData()
const spec = computed<ApiReference>(() => {
  if (frontmatter.value.apiReference) return sanitizePublicReference(frontmatter.value.apiReference)
  if (frontmatter.value.apiReferenceJson) return sanitizePublicReference(JSON.parse(frontmatter.value.apiReferenceJson))
  return sanitizePublicReference(generatedApiReferenceSpecs[frontmatter.value.apiReferenceKey])
})
const activeLanguage = ref(0)
const copied = ref(false)
const pageActionsOpen = ref(false)
const pageCopied = ref(false)

function curlRequestParts(reference: ApiReference) {
  const curl = reference.examples?.find((example) => /curl/i.test(example.label))?.code ?? ''
  const url = curl.match(/https:\/\/[^\s"'\\]+/)?.[0] ?? `https://api.sandbase.ai${reference.path}`
  const body = curl.match(/-d\s+'([\s\S]*?)'\s*$/)?.[1]
  return { method: reference.method.toUpperCase(), url, body }
}

function pythonExample(reference: ApiReference): ApiExample {
  const { method, url, body } = curlRequestParts(reference)
  const payload = body
    ? `\nimport json\n\npayload = json.loads(r'''${body}''')\n`
    : ''
  const payloadArg = body ? ',\n    json=payload' : ''
  return {
    label: 'Python',
    language: 'python',
    code: `import os\nimport requests\n${payload}\nresponse = requests.request(\n    "${method}",\n    "${url}",\n    headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"}${payloadArg},\n)\nresponse.raise_for_status()\nprint(response.json())`,
  }
}

function typeScriptExample(reference: ApiReference): ApiExample {
  const { method, url, body } = curlRequestParts(reference)
  const bodyOption = body ? `,\n  body: JSON.stringify(${body})` : ''
  return {
    label: 'TypeScript',
    language: 'typescript',
    code: `const response = await fetch('${url}', {\n  method: '${method}',\n  headers: {\n    Authorization: \`Bearer \${process.env.SANDBASE_API_KEY}\`,\n    'Content-Type': 'application/json',\n  }${bodyOption},\n});\n\nif (!response.ok) throw new Error(await response.text());\nconsole.log(await response.json());`,
  }
}

const examples = computed<ApiExample[]>(() => {
  const existing = spec.value.examples ?? []
  const result = [...existing]
  if (!existing.some((example) => example.language === 'python')) result.push(pythonExample(spec.value))
  if (!existing.some((example) => ['typescript', 'javascript'].includes(example.language))) {
    result.push(typeScriptExample(spec.value))
  }
  return result
})

const activeExample = computed(() => examples.value[activeLanguage.value] ?? examples.value[0])
const highlightedExampleCode = computed(() => highlightCode(activeExample.value?.code ?? '', activeExample.value?.language))
const highlightedResponseCode = computed(() => highlightCode(spec.value.response?.code ?? '', 'json'))
const modelIdentifier = computed(() => spec.value.groups
  ?.flatMap((group) => group.fields)
  .find((field) => field.name === 'model')
  ?.default)
const modelDetailUrl = computed(() => {
  if (!modelIdentifier.value?.includes('/')) return 'https://www.sandbase.ai/models'
  const [vendor, ...modelSlugParts] = modelIdentifier.value.split('/')
  return `https://www.sandbase.ai/model/${encodeURIComponent(vendor)}/${modelSlugParts.map(encodeURIComponent).join('/')}`
})
const pageMarkdown = computed(() => apiReferenceMarkdown(spec.value, examples.value))

async function copyCode() {
  if (!activeExample.value?.code || typeof navigator === 'undefined') return
  await navigator.clipboard.writeText(activeExample.value.code)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1400)
}

async function copyPageMarkdown() {
  if (typeof navigator === 'undefined') return
  await navigator.clipboard.writeText(pageMarkdown.value)
  pageCopied.value = true
  pageActionsOpen.value = false
  window.setTimeout(() => (pageCopied.value = false), 1400)
}

function openMarkdownSource() {
  if (typeof window === 'undefined') return
  const markdownBlob = new Blob([pageMarkdown.value], { type: 'text/markdown;charset=utf-8' })
  const markdownUrl = URL.createObjectURL(markdownBlob)
  window.open(markdownUrl, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(markdownUrl), 60_000)
  pageActionsOpen.value = false
}

function openModelDetail() {
  if (typeof window === 'undefined') return
  window.open(modelDetailUrl.value, '_blank', 'noopener,noreferrer')
  pageActionsOpen.value = false
}

function apiReferenceMarkdown(reference: ApiReference, apiExamples: ApiExample[]) {
  const parts: string[] = [
    `# ${reference.title}`,
    '',
  ]
  if (reference.signature) {
    parts.push(`\`${reference.signature}\``, '')
  }
  parts.push(`\`${reference.method.toUpperCase()} ${reference.path}\``, '', reference.description, '')

  reference.groups?.forEach((group) => {
    parts.push(`## ${group.title}`, '')
    if (group.description) parts.push(group.description, '')
    if (group.schema) parts.push(`Schema: \`${group.schema}\``, '')
    group.fields.forEach((field) => {
      const required = field.required ? 'required' : 'optional'
      parts.push(`- \`${field.name}\` (${field.type}, ${required}): ${field.description}`)
      if (field.constraints) parts.push(`  ${field.constraints}`)
      if (field.default !== undefined) parts.push(`  Default: \`${field.default}\``)
    })
    parts.push('')
  })

  if (apiExamples.length) {
    parts.push('## Examples', '')
    apiExamples.forEach((example) => {
      parts.push(`### ${example.label}`, '', `\`\`\`${example.language}`, example.code, '```', '')
    })
  }

  if (reference.response) {
    parts.push('## Response', '', `Status: \`${reference.response.status}\``, '', '```json', reference.response.code, '```', '')
  }

  if (reference.notes?.length) {
    parts.push('## Response states', '')
    reference.notes.forEach((note) => {
      parts.push(`### ${note.title}`, '')
      try {
        JSON.parse(note.description)
        parts.push('```json', note.description, '```', '')
      } catch {
        parts.push(note.description, '')
      }
    })
  }

  return parts.join('\n').trimEnd()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlightJson(code: string) {
  const escaped = escapeHtml(code)
  return escaped.replace(
    /("(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)/gi,
    (token, _match, offset, source) => {
      let tokenClass = 'syntax-number'
      if (token.startsWith('"')) tokenClass = /^\s*:/.test(source.slice(offset + token.length)) ? 'syntax-key' : 'syntax-string'
      if (/^(true|false|null)$/i.test(token)) tokenClass = 'syntax-literal'
      return `<span class="${tokenClass}">${token}</span>`
    },
  )
}

function highlightScript(code: string) {
  const escaped = escapeHtml(code)
  return escaped.replace(
    /(https?:\/\/[^\s'"\\]+)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\$[A-Z0-9_]+|process\.env\.[A-Z0-9_]+)|\b(curl|const|await|fetch|method|headers|body|JSON|stringify|if|throw|new|Error|console|log|import|from|print|response|requests|request|raise_for_status|os|json)\b|(-{1,2}[A-Za-z0-9-]+)/g,
    (token, url, stringValue, variable, keyword, flag) => {
      const tokenClass = url
        ? 'syntax-url'
        : stringValue
          ? 'syntax-string'
          : variable
            ? 'syntax-variable'
            : keyword
              ? 'syntax-keyword'
              : flag
                ? 'syntax-flag'
                : ''
      return tokenClass ? `<span class="${tokenClass}">${token}</span>` : token
    },
  )
}

function highlightCode(code: string, language = '') {
  if (language === 'json') return highlightJson(code)
  return highlightScript(code)
}
</script>

<template>
  <article v-if="spec" class="api-reference-page">
    <div class="api-page-actions">
      <div class="api-page-actions-menu">
        <button class="api-page-copy-primary" type="button" @click="copyPageMarkdown">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 8h10v12H8z" />
            <path d="M6 16H4V4h12v2" />
          </svg>
          {{ pageCopied ? 'Copied' : 'Copy page' }}
        </button>
        <button
          class="api-page-copy-toggle"
          type="button"
          :aria-expanded="pageActionsOpen"
          aria-label="Open page actions"
          @click="pageActionsOpen = !pageActionsOpen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div v-if="pageActionsOpen" class="api-page-actions-dropdown">
        <button type="button" @click="copyPageMarkdown">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 8h10v12H8z" />
            <path d="M6 16H4V4h12v2" />
          </svg>
          Copy page as Markdown
        </button>
        <button type="button" @click="openMarkdownSource">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
          Open Markdown
        </button>
        <button type="button" @click="openModelDetail">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
          View model details
        </button>
      </div>
    </div>

    <header class="api-reference-hero">
      <h1>{{ spec.title }}</h1>
      <code v-if="spec.signature" class="api-reference-signature">{{ spec.signature }}</code>
      <div class="api-reference-endpoint">
        <span :class="['api-method', `is-${spec.method.toLowerCase()}`]">{{ spec.method }}</span>
        <code>{{ spec.path }}</code>
      </div>
      <p class="api-reference-description">{{ spec.description }}</p>
    </header>

    <div class="api-reference-layout">
      <main class="api-reference-fields">
        <section v-for="group in spec.groups" :key="group.title" class="api-field-group">
          <div class="api-section-heading">
            <h2>{{ group.title }}</h2>
            <p v-if="group.description">{{ group.description }}</p>
          </div>

          <div v-if="group.schema" class="api-schema-heading">
            <span aria-hidden="true">⌄</span>
            <code>{{ group.schema }}</code>
          </div>

          <div :class="['api-field-list', { 'has-schema': group.schema }]">
            <article v-for="field in group.fields" :key="field.name" class="api-field-row">
              <div class="api-field-meta">
                <span class="api-field-type">
                  <template v-if="!field.required">Optional&lt;</template>{{ field.type }}<template v-if="!field.required">&gt;</template>
                </span>
                <code class="api-field-name">{{ field.name }}</code>
                <span v-if="field.required" class="api-field-required">required</span>
              </div>
              <p>{{ field.description }}</p>
              <p v-if="field.constraints" class="api-field-constraints">{{ field.constraints }}</p>
              <p v-if="field.default !== undefined" class="api-field-default">Default: <code>{{ field.default }}</code></p>
            </article>
          </div>
        </section>

        <section v-if="spec.notes?.length" class="api-notes">
          <article v-for="note in spec.notes" :key="note.title">
            <h3>{{ note.title }}</h3>
            <p>{{ note.description }}</p>
          </article>
        </section>

        <section v-if="spec.errors?.length" class="api-errors">
          <h2>Errors</h2>
          <div v-for="error in spec.errors" :key="`${error.status}-${error.type}`" class="api-error-row">
            <span>{{ error.status }}</span>
            <code>{{ error.type }}</code>
            <p>{{ error.description }}</p>
          </div>
        </section>
      </main>

      <aside class="api-reference-examples" aria-label="Code examples">
        <div class="api-examples-sticky">
          <div class="api-example-card">
            <div class="api-example-toolbar">
              <div class="api-language-tabs" role="tablist" aria-label="Example language">
                <button
                  v-for="(example, index) in examples"
                  :key="example.label"
                  :class="{ active: activeLanguage === index }"
                  type="button"
                  role="tab"
                  :aria-selected="activeLanguage === index"
                  @click="activeLanguage = index"
                >
                  {{ example.label }}
                </button>
              </div>
              <button class="api-copy-button" type="button" @click="copyCode">
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre><code :class="`language-${activeExample?.language ?? 'text'}`" v-html="highlightedExampleCode"></code></pre>
          </div>

          <div v-if="spec.response" class="api-example-card api-response-card">
            <div class="api-response-heading">
              <span>Response</span>
              <code>{{ spec.response.status }}</code>
            </div>
            <pre><code class="language-json" v-html="highlightedResponseCode"></code></pre>
          </div>

        </div>
      </aside>
    </div>
  </article>
</template>

<style scoped>
.api-reference-page {
  --api-border: var(--vp-c-divider);
  --api-soft: #f7f8f8;
  --api-muted: #667085;
  --api-green: #356451;
  position: relative;
  color: var(--vp-c-text-1);
  min-width: 0;
  overflow: hidden;
}

.api-page-actions {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  display: grid;
  justify-items: end;
  gap: 8px;
}

.api-page-actions-menu {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--api-border);
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
}

.api-page-copy-primary,
.api-page-copy-toggle,
.api-page-actions-dropdown button {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font: inherit;
}

.api-page-copy-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 520;
}

.api-page-copy-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  min-height: 34px;
  border-left: 1px solid var(--api-border);
  color: var(--vp-c-text-2);
}

.api-page-copy-primary:hover,
.api-page-copy-toggle:hover,
.api-page-actions-dropdown button:hover {
  background: var(--api-soft);
}

.api-page-actions svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.api-page-actions-dropdown {
  min-width: 220px;
  padding: 8px;
  border: 1px solid var(--api-border);
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.16);
}

.api-page-actions-dropdown button {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 38px;
  padding: 0 10px;
  border-radius: 7px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  text-align: left;
}

.api-reference-hero {
  max-width: 820px;
  padding-bottom: 42px;
}

.api-reference-hero h1 {
  margin: 0 0 24px;
  border: 0;
  font-size: clamp(30px, 2.6vw, 38px);
  font-weight: 650;
  letter-spacing: -.025em;
  line-height: 1.04;
}

.api-reference-signature {
  display: block;
  margin: 0 0 15px;
  padding: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  white-space: normal;
}

.api-reference-endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
}

.api-reference-endpoint code {
  padding: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.api-method {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 9px;
  border-radius: 6px;
  border: 1px solid #d5ddd9;
  background: #f1f4f2;
  color: #35594a;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: .04em;
}

.api-method.is-post { background: #eef1f4; color: #465466; }
.api-method.is-delete { background: #f7eeee; color: #9b4141; }

.api-reference-description {
  margin: 0;
  color: var(--vp-c-text-2);
  max-width: 700px;
  font-size: 14px;
  line-height: 1.55;
}

.api-reference-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr);
  gap: 32px;
  align-items: start;
}

.api-reference-fields,
.api-reference-examples {
  min-width: 0;
}

.api-field-group,
.api-errors {
  margin: 0 0 38px;
}

.api-section-heading,
.api-errors > h2 {
  margin: 0 0 20px;
}

.api-section-heading h2,
.api-errors > h2 {
  margin: 0 0 6px;
  border: 0;
  font-size: 18px;
  font-weight: 620;
  letter-spacing: -.015em;
}

.api-section-heading p {
  margin: 0;
  color: var(--api-muted);
  font-size: 14px;
}

.api-field-list {
  border-top: 1px solid var(--api-border);
}

.api-schema-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 46px;
  padding: 0 2px;
  border-top: 1px solid var(--api-border);
  border-bottom: 1px solid var(--api-border);
  color: var(--vp-c-text-2);
}

.api-schema-heading span {
  font-size: 15px;
}

.api-schema-heading code {
  padding: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 650;
}

.api-field-list.has-schema {
  margin-left: 11px;
  padding-left: 20px;
  border-top: 0;
  border-left: 1px solid var(--api-border);
}

.api-field-row {
  padding: 16px 0 17px;
  border-bottom: 1px solid var(--api-border);
}

.api-field-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}

.api-field-name {
  padding: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 700;
}

.api-field-type {
  color: #345d77;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 600;
}

.api-field-required {
  padding: 0;
  border-radius: 0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .03em;
  text-transform: uppercase;
}

.api-field-required { background: transparent; color: #9b4141; }

.api-field-row p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.55;
}

.api-field-row .api-field-default {
  margin-top: 7px;
  color: var(--api-muted);
  font-size: 12px;
}

.api-field-row .api-field-constraints {
  margin-top: 6px;
  color: var(--api-muted);
  font-size: 12px;
}

.api-notes {
  margin: 2px 0 38px;
  border-top: 1px solid var(--api-border);
}

.api-notes article {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 16px;
  padding: 15px 0;
  border-bottom: 1px solid var(--api-border);
}

.api-notes h3 { margin: 0; font-size: 13px; }
.api-notes p { margin: 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.6; }

.api-error-row {
  display: grid;
  grid-template-columns: 46px 142px 1fr;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--api-border);
  align-items: baseline;
  font-size: 13px;
}

.api-error-row code { padding: 0; background: transparent; }
.api-error-row p { margin: 0; color: var(--vp-c-text-2); }

.api-examples-sticky {
  position: sticky;
  top: 90px;
  display: grid;
  gap: 16px;
}

.api-example-card {
  overflow: hidden;
  border: 1px solid var(--api-border);
  border-radius: 7px;
  background: #fff;
}

.api-example-toolbar,
.api-response-heading {
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid var(--api-border);
}

.api-language-tabs {
  display: flex;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
}

.api-language-tabs button,
.api-copy-button {
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font: inherit;
}

.api-language-tabs button {
  padding: 8px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
}

.api-language-tabs button.active {
  background: #f0f2f1;
  color: #3c5148;
}

.api-copy-button {
  flex: none;
  padding: 6px 8px;
  font-size: 11px;
}

.api-example-card pre {
  max-height: 460px;
  margin: 0;
  padding: 18px 20px;
  border-radius: 0;
  background: transparent;
  overflow: auto;
}

.api-example-card pre code {
  color: #243046;
  font-size: 11.5px;
  line-height: 1.62;
}

.api-example-card pre code :deep(.syntax-key) {
  color: #1b6d9b;
}

.api-example-card pre code :deep(.syntax-string) {
  color: #0f766e;
}

.api-example-card pre code :deep(.syntax-number),
.api-example-card pre code :deep(.syntax-literal) {
  color: #8a4baf;
}

.api-example-card pre code :deep(.syntax-keyword),
.api-example-card pre code :deep(.syntax-flag) {
  color: #6d4aff;
  font-weight: 650;
}

.api-example-card pre code :deep(.syntax-url),
.api-example-card pre code :deep(.syntax-variable) {
  color: #075985;
}

.api-response-heading {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 650;
}

.api-response-heading code {
  padding: 2px 7px;
  border: 1px solid #d8ddda;
  background: #f2f4f3;
  color: #3c5148;
}

:global(.dark) .api-reference-page {
  --api-soft: #202326;
}

:global(.dark) .api-page-actions-menu,
:global(.dark) .api-page-actions-dropdown {
  background: #16181a;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);
}
:global(.dark) .api-example-card { background: #16181a; }
:global(.dark) .api-example-card pre code { color: #d8dee9; }
:global(.dark) .api-example-card pre code .syntax-key { color: #7dd3fc; }
:global(.dark) .api-example-card pre code .syntax-string { color: #5eead4; }
:global(.dark) .api-example-card pre code .syntax-number,
:global(.dark) .api-example-card pre code .syntax-literal { color: #c4b5fd; }
:global(.dark) .api-example-card pre code .syntax-keyword,
:global(.dark) .api-example-card pre code .syntax-flag { color: #a78bfa; }
:global(.dark) .api-example-card pre code .syntax-url,
:global(.dark) .api-example-card pre code .syntax-variable { color: #93c5fd; }

@media (max-width: 1180px) {
  .api-reference-layout {
    grid-template-columns: minmax(0, 1fr) minmax(300px, .9fr);
    gap: 24px;
  }
}

@media (max-width: 920px) {
  .api-page-actions {
    position: static;
    justify-items: start;
    margin-bottom: 24px;
  }

  .api-reference-layout { grid-template-columns: 1fr; }
  .api-examples-sticky { position: static; }
  .api-reference-examples { order: -1; }
}

@media (max-width: 640px) {
  .api-reference-hero { padding-bottom: 28px; }
  .api-reference-endpoint { align-items: flex-start; }
  .api-reference-endpoint code { overflow-wrap: anywhere; }
  .api-error-row { grid-template-columns: 42px 1fr; }
  .api-error-row p { grid-column: 2; }
  .api-notes article { grid-template-columns: 1fr; gap: 4px; }
}
</style>
