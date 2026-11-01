<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const visible = ref(false)
const baseUrl = import.meta.env.VITE_CHATWOOT_BASE_URL || ''
const websiteToken = import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN || ''
function openChat() { visible.value = false; window.$chatwoot?.toggle('open') }
function onReady() { window.$chatwoot?.setLocale('en'); visible.value = true }
function onOpened() { visible.value = false }
function onClosed() { visible.value = true }
onMounted(() => {
  let origin: string
  try {
    const url = new URL(baseUrl); const local = ['localhost', '127.0.0.1'].includes(url.hostname)
    if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) return
    origin = url.origin
  } catch { return }
  if (!websiteToken) return
  window.addEventListener('chatwoot:ready', onReady); window.addEventListener('chatwoot:opened', onOpened); window.addEventListener('chatwoot:closed', onClosed)
  if (document.getElementById('chatwoot-sdk')) return
  window.chatwootSettings = { position: 'right', type: 'standard', darkMode: 'auto', locale: 'en', useBrowserLanguage: false, hideMessageBubble: true }
  const script = document.createElement('script')
  script.id = 'chatwoot-sdk'; script.src = `${origin}/packs/js/sdk.js`; script.async = true; script.defer = true
  script.onload = () => window.chatwootSDK?.run({ websiteToken, baseUrl: origin }); document.body.appendChild(script)
})
onUnmounted(() => {
  window.removeEventListener('chatwoot:ready', onReady); window.removeEventListener('chatwoot:opened', onOpened); window.removeEventListener('chatwoot:closed', onClosed)
})
</script>
<template>
  <button v-if="visible" class="chatwoot-launcher" type="button" aria-label="Chat with SandBase support" title="Chat with us" @click="openChat">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>
  </button>
</template>
<style scoped>
.chatwoot-launcher { position: fixed; z-index: 70; right: 0; bottom: 2rem; display: flex; align-items: center; justify-content: center; width: 3rem; height: 3.25rem; padding: 0 .25rem 0 .375rem; border: 1px solid rgb(0 0 0 / 8%); border-right: 0; border-radius: 999px 0 0 999px; background: #fff; color: #111; box-shadow: 0 6px 24px rgb(0 0 0 / 28%); cursor: pointer; transform: translateX(.375rem); transition: transform 160ms ease, box-shadow 160ms ease; }
.chatwoot-launcher:hover, .chatwoot-launcher:focus-visible { transform: translateX(0); }
.chatwoot-launcher:focus-visible { outline: 2px solid #7c5cff; outline-offset: 2px; }
.chatwoot-launcher svg { width: 1.375rem; height: 1.375rem; }
@media (prefers-reduced-motion: reduce) { .chatwoot-launcher { transition: none; } }
</style>
<script lang="ts">
declare global {
  interface Window {
    $chatwoot?: { toggle(state?: 'open' | 'close'): void; setLocale(locale: string): void }
    chatwootSDK?: { run(options: { websiteToken: string; baseUrl: string }): void }
    chatwootSettings?: Record<string, unknown>
  }
}
export default {}
</script>
