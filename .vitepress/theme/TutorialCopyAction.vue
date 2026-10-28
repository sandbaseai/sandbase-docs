<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import localEn from './tutorial-prompts/local-use-agent-en.md?raw'
import localZh from './tutorial-prompts/local-use-agent-zh.md?raw'
import contestEn from './tutorial-prompts/ai-city-remix-agent-en.md?raw'
import contestZh from './tutorial-prompts/ai-city-remix-agent-zh.md?raw'

const { frontmatter } = useData()
const prompts: Record<string, string> = {
  'local-use-agent-en': localEn, 'local-use-agent-zh': localZh,
  'ai-city-remix-agent-en': contestEn, 'ai-city-remix-agent-zh': contestZh,
}
const key = computed(() => String(frontmatter.value.agentDoc || ''))
const text = computed(() => prompts[key.value])
const chinese = computed(() => key.value.endsWith('-zh'))
const state = ref<'idle' | 'copied' | 'failed'>('idle')
watch(key, () => { state.value = 'idle' })
async function copy() {
  try {
    await navigator.clipboard.writeText(text.value)
    state.value = 'copied'
  } catch {
    state.value = 'failed'
  }
}
const label = computed(() => state.value === 'copied'
  ? (chinese.value ? '已复制' : 'Copied')
  : state.value === 'failed'
    ? (chinese.value ? '复制失败，点击重试' : 'Copy failed — retry')
    : (chinese.value ? '复制给 Agent' : 'Copy for Agent'))
</script>

<template>
  <div v-if="text" class="tutorial-actions">
    <button type="button" @click="copy" :aria-label="label">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h10v12H8z"/><path d="M6 16H4V4h12v2"/></svg>
      <span aria-live="polite">{{ label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tutorial-actions { display: flex; justify-content: flex-end; margin-bottom: 16px; }
button { display: inline-flex; align-items: center; gap: 8px; min-height: 34px; padding: 0 12px; border: 1px solid var(--vp-c-divider); border-radius: 0; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; font-size: 13px; font-weight: 500; }
button:hover { background: var(--vp-c-bg-soft); }
button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.5; }
</style>
