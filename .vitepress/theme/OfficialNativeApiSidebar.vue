<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()
const isCategoryExpanded = ref(false)
const isByteDanceExpanded = ref(false)
const isGoogleExpanded = ref(false)
const isOpenAIExpanded = ref(false)
const isAnthropicExpanded = ref(false)
const isModelApiReferenceRoute = computed(() => /\/model-api-reference(?:\/|$)/.test(route.path))

const models = [
  {
    text: 'Seedance 2.5 Official',
    link: '/model-api-reference/official-native-api/bytedance/seedance-2.5-official',
  },
  {
    text: 'Seedance 2.0 Official',
    link: '/model-api-reference/official-native-api/bytedance/seedance-2.0-official',
  },
  {
    text: 'Media Assets for Seedance',
    link: '/model-api-reference/official-native-api/bytedance/media-assets',
  },
]

const openaiModels = [
  { text: 'GPT Image 2.5 Flare', link: '/model-api-reference/official-native-api/openai/gpt-image-2.5-flare' },
  { text: 'GPT Image 2.5 Sunburst', link: '/model-api-reference/official-native-api/openai/gpt-image-2.5-sunburst' },
  { text: 'GPT Image 2', link: '/model-api-reference/official-native-api/openai/gpt-image-2' },
  { text: 'GPT-5.6 Luna Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-luna-pro' },
  { text: 'GPT-5.6 Luna', link: '/model-api-reference/llm-models/openai/gpt-5.6-luna' },
  { text: 'GPT-5.6 Terra Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-terra-pro' },
  { text: 'GPT-5.6 Terra', link: '/model-api-reference/llm-models/openai/gpt-5.6-terra' },
  { text: 'GPT-5.6 Sol Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-sol-pro' },
  { text: 'GPT-5.6 Sol', link: '/model-api-reference/llm-models/openai/gpt-5.6-sol' },
  { text: 'GPT Chat Latest', link: '/model-api-reference/llm-models/openai/gpt-chat-latest' },
  { text: 'GPT-5.5 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.5-pro' },
  { text: 'GPT-5.5', link: '/model-api-reference/llm-models/openai/gpt-5.5' },
  { text: 'GPT-5.4 Image 2', link: '/model-api-reference/llm-models/openai/gpt-5.4-image-2' },
  { text: 'GPT-5.4 Nano', link: '/model-api-reference/llm-models/openai/gpt-5.4-nano' },
  { text: 'GPT-5.4 Mini', link: '/model-api-reference/llm-models/openai/gpt-5.4-mini' },
  { text: 'GPT-5.4 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.4-pro' },
  { text: 'GPT-5.4', link: '/model-api-reference/llm-models/openai/gpt-5.4' },
  { text: 'GPT-5.3 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.3-chat' },
  { text: 'GPT-5.3-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.3-codex' },
  { text: 'GPT Audio', link: '/model-api-reference/llm-models/openai/gpt-audio' },
  { text: 'GPT Audio Mini', link: '/model-api-reference/llm-models/openai/gpt-audio-mini' },
  { text: 'GPT-5.2-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.2-codex' },
  { text: 'GPT-5.2 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.2-chat' },
  { text: 'GPT-5.2 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.2-pro' },
  { text: 'GPT-5.2', link: '/model-api-reference/llm-models/openai/gpt-5.2' },
  { text: 'GPT-5.1-Codex-Max', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex-max' },
  { text: 'GPT-5.1', link: '/model-api-reference/llm-models/openai/gpt-5.1' },
  { text: 'GPT-5.1 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.1-chat' },
  { text: 'GPT-5.1-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex' },
  { text: 'GPT-5.1-Codex-Mini', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex-mini' },
  { text: 'gpt-oss-safeguard-20b', link: '/model-api-reference/llm-models/openai/gpt-oss-safeguard-20b' },
  { text: 'GPT-5 Image Mini', link: '/model-api-reference/llm-models/openai/gpt-5-image-mini' },
  { text: 'GPT-5 Image', link: '/model-api-reference/llm-models/openai/gpt-5-image' },
  { text: 'o3 Deep Research', link: '/model-api-reference/llm-models/openai/o3-deep-research' },
  { text: 'o4 Mini Deep Research', link: '/model-api-reference/llm-models/openai/o4-mini-deep-research' },
  { text: 'GPT-5 Pro', link: '/model-api-reference/llm-models/openai/gpt-5-pro' },
  { text: 'GPT-5 Codex', link: '/model-api-reference/llm-models/openai/gpt-5-codex' },
  { text: 'GPT-4o Audio', link: '/model-api-reference/llm-models/openai/gpt-4o-audio-preview' },
  { text: 'GPT-5 Chat', link: '/model-api-reference/llm-models/openai/gpt-5-chat' },
  { text: 'GPT-5', link: '/model-api-reference/llm-models/openai/gpt-5' },
  { text: 'GPT-5 Mini', link: '/model-api-reference/llm-models/openai/gpt-5-mini' },
  { text: 'GPT-5 Nano', link: '/model-api-reference/llm-models/openai/gpt-5-nano' },
  { text: 'gpt-oss-120b', link: '/model-api-reference/llm-models/openai/gpt-oss-120b' },
  { text: 'gpt-oss-20b', link: '/model-api-reference/llm-models/openai/gpt-oss-20b' },
  { text: 'o3 Pro', link: '/model-api-reference/llm-models/openai/o3-pro' },
  { text: 'o4 Mini High', link: '/model-api-reference/llm-models/openai/o4-mini-high' },
  { text: 'o3', link: '/model-api-reference/llm-models/openai/o3' },
  { text: 'o4 Mini', link: '/model-api-reference/llm-models/openai/o4-mini' },
  { text: 'GPT-4.1', link: '/model-api-reference/llm-models/openai/gpt-4.1' },
  { text: 'GPT-4.1 Mini', link: '/model-api-reference/llm-models/openai/gpt-4.1-mini' },
  { text: 'GPT-4.1 Nano', link: '/model-api-reference/llm-models/openai/gpt-4.1-nano' },
  { text: 'o1-pro', link: '/model-api-reference/llm-models/openai/o1-pro' },
  { text: 'GPT-4o-mini Search Preview', link: '/model-api-reference/llm-models/openai/gpt-4o-mini-search-preview' },
  { text: 'GPT-4o Search Preview', link: '/model-api-reference/llm-models/openai/gpt-4o-search-preview' },
  { text: 'o3 Mini High', link: '/model-api-reference/llm-models/openai/o3-mini-high' },
  { text: 'o3 Mini', link: '/model-api-reference/llm-models/openai/o3-mini' },
  { text: 'o1', link: '/model-api-reference/llm-models/openai/o1' },
  { text: 'GPT-4o (2024-11-20)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-11-20' },
  { text: 'GPT-4o (2024-08-06)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-08-06' },
  { text: 'GPT-4o-mini', link: '/model-api-reference/llm-models/openai/gpt-4o-mini' },
  { text: 'GPT-4o-mini (2024-07-18)', link: '/model-api-reference/llm-models/openai/gpt-4o-mini-2024-07-18' },
  { text: 'GPT-4o', link: '/model-api-reference/llm-models/openai/gpt-4o' },
  { text: 'GPT-4o (2024-05-13)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-05-13' },
  { text: 'GPT-4 Turbo', link: '/model-api-reference/llm-models/openai/gpt-4-turbo' },
  { text: 'GPT-3.5 Turbo (older v0613)', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-0613' },
  { text: 'GPT-4 Turbo Preview', link: '/model-api-reference/llm-models/openai/gpt-4-turbo-preview' },
  { text: 'GPT-4 Turbo (older v1106)', link: '/model-api-reference/llm-models/openai/gpt-4-1106-preview' },
  { text: 'GPT-3.5 Turbo Instruct', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-instruct' },
  { text: 'GPT-3.5 Turbo 16k', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-16k' },
  { text: 'GPT-3.5 Turbo', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo' },
  { text: 'GPT-4', link: '/model-api-reference/llm-models/openai/gpt-4' },
  { text: 'GPT-4 (older v0314)', link: '/model-api-reference/llm-models/openai/gpt-4-0314' },
]

const anthropicModels = [
  { text: 'Claude Opus 5', link: '/model-api-reference/llm-models/anthropic/claude-opus-5' },
  { text: 'Claude Sonnet 5', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-5' },
  { text: 'Claude Fable 5', link: '/model-api-reference/llm-models/anthropic/claude-fable-5' },
  { text: 'Claude Opus 4.8 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.8-fast' },
  { text: 'Claude Opus 4.8', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.8' },
  { text: 'Claude Opus 4.7 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.7-fast' },
  { text: 'Claude Opus 4.7', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.7' },
  { text: 'Claude Opus 4.6 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.6-fast' },
  { text: 'Claude Sonnet 4.6', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4.6' },
  { text: 'Claude Opus 4.6', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.6' },
  { text: 'Claude Opus 4.5', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.5' },
  { text: 'Claude Haiku 4.5', link: '/model-api-reference/llm-models/anthropic/claude-haiku-4.5' },
  { text: 'Claude Sonnet 4.5', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4.5' },
  { text: 'Claude Opus 4.1', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.1' },
  { text: 'Claude Opus 4', link: '/model-api-reference/llm-models/anthropic/claude-opus-4' },
  { text: 'Claude Sonnet 4', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4' },
  { text: 'Claude 3.7 Sonnet', link: '/model-api-reference/llm-models/anthropic/claude-3.7-sonnet' },
  { text: 'Claude 3.7 Sonnet (thinking)', link: '/model-api-reference/llm-models/anthropic/claude-3.7-sonnet-thinking' },
  { text: 'Claude 3.5 Haiku', link: '/model-api-reference/llm-models/anthropic/claude-3.5-haiku' },
  { text: 'Claude 3 Haiku', link: '/model-api-reference/llm-models/anthropic/claude-3-haiku' },
]

const googleModels = [
  {
    text: 'Gemini Omni Flash Preview',
    link: '/model-api-reference/official-native-api/google/gemini-omni-flash-preview',
  },
  {
    text: 'Gemini Omni 1.1 Flash Preview',
    link: '/model-api-reference/official-native-api/google/gemini-omni-1.1-flash-preview',
  },
  {
    text: 'Gemini 3 Pro Image（Nano Banana Pro）',
    link: '/model-api-reference/official-native-api/google/gemini-3-pro-image',
  },
  {
    text: 'Gemini 3.1 Flash Image（Nano Banana 2）',
    link: '/model-api-reference/official-native-api/google/gemini-3.1-flash-image',
  },
]

function normalize(path: string) {
  return path.replace(/\/$/, '')
}

function isActive(link: string) {
  return normalize(route.path) === normalize(link)
}

watch(
  () => route.path,
  (path) => {
    if (/\/model-api-reference\/official-native-api(?:\/|$)/.test(path)) {
      isCategoryExpanded.value = true
      if (path.includes('/official-native-api/bytedance/')) isByteDanceExpanded.value = true
      if (path.includes('/official-native-api/google/')) isGoogleExpanded.value = true
      if (path.includes('/official-native-api/openai/')) isOpenAIExpanded.value = true
    }
    if (path.includes('/model-api-reference/llm-models/openai/')) {
      isCategoryExpanded.value = true
      isOpenAIExpanded.value = true
    }
    if (path.includes('/model-api-reference/llm-models/anthropic/')) {
      isCategoryExpanded.value = true
      isAnthropicExpanded.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="isModelApiReferenceRoute" class="official-native-sidebar" aria-label="Official Native API navigation">
    <div class="sidebar-row category-row">
      <a
        class="sidebar-link category-link"
        :class="{ active: isActive('/model-api-reference/official-native-api') }"
        :aria-current="isActive('/model-api-reference/official-native-api') ? 'page' : undefined"
        :href="withBase('/model-api-reference/official-native-api')"
      >Official Native API</a>
      <button
        class="disclosure"
        type="button"
        :aria-expanded="isCategoryExpanded"
        aria-controls="official-native-api-panel"
        aria-label="Toggle Official Native API navigation"
        @click="isCategoryExpanded = !isCategoryExpanded"
      ><span aria-hidden="true">›</span></button>
    </div>

    <div v-if="isCategoryExpanded" id="official-native-api-panel" class="nested-panel">
      <a
        class="sidebar-link overview-link"
        :class="{ active: isActive('/model-api-reference/official-native-api') }"
        :aria-current="isActive('/model-api-reference/official-native-api') ? 'page' : undefined"
        :href="withBase('/model-api-reference/official-native-api')"
      >Overview</a>
      <div class="sidebar-row provider-row">
        <button
          class="provider-button"
          type="button"
          :aria-expanded="isOpenAIExpanded"
          aria-controls="official-native-openai-panel"
          @click="isOpenAIExpanded = !isOpenAIExpanded"
        >
          <span>OpenAI</span>
          <span class="provider-chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <ul v-if="isOpenAIExpanded" id="official-native-openai-panel" class="model-list">
        <li v-for="model in openaiModels" :key="model.link">
          <a
            class="sidebar-link model-link"
            :class="{ active: isActive(model.link) }"
            :aria-current="isActive(model.link) ? 'page' : undefined"
            :href="withBase(model.link)"
          >{{ model.text }}</a>
        </li>
      </ul>
      <div class="sidebar-row provider-row">
        <button
          class="provider-button"
          type="button"
          :aria-expanded="isAnthropicExpanded"
          aria-controls="official-native-anthropic-panel"
          @click="isAnthropicExpanded = !isAnthropicExpanded"
        >
          <span>Anthropic</span>
          <span class="provider-chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <ul v-if="isAnthropicExpanded" id="official-native-anthropic-panel" class="model-list">
        <li v-for="model in anthropicModels" :key="model.link">
          <a
            class="sidebar-link model-link"
            :class="{ active: isActive(model.link) }"
            :aria-current="isActive(model.link) ? 'page' : undefined"
            :href="withBase(model.link)"
          >{{ model.text }}</a>
        </li>
      </ul>
      <div class="sidebar-row provider-row">
        <button
          class="provider-button"
          type="button"
          :aria-expanded="isByteDanceExpanded"
          aria-controls="official-native-bytedance-panel"
          @click="isByteDanceExpanded = !isByteDanceExpanded"
        >
          <span>ByteDance</span>
          <span class="provider-chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <ul v-if="isByteDanceExpanded" id="official-native-bytedance-panel" class="model-list">
        <li v-for="model in models" :key="model.link">
          <a
            class="sidebar-link model-link"
            :class="{ active: isActive(model.link) }"
            :aria-current="isActive(model.link) ? 'page' : undefined"
            :href="withBase(model.link)"
          >{{ model.text }}</a>
        </li>
      </ul>
      <div class="sidebar-row provider-row">
        <button
          class="provider-button"
          type="button"
          :aria-expanded="isGoogleExpanded"
          aria-controls="official-native-google-panel"
          @click="isGoogleExpanded = !isGoogleExpanded"
        >
          <span>Google</span>
          <span class="provider-chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <ul v-if="isGoogleExpanded" id="official-native-google-panel" class="model-list">
        <li v-for="model in googleModels" :key="model.link">
          <a
            class="sidebar-link model-link"
            :class="{ active: isActive(model.link) }"
            :aria-current="isActive(model.link) ? 'page' : undefined"
            :href="withBase(model.link)"
          >{{ model.text }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.official-native-sidebar {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 10px;
  padding: 12px 0 7px;
}

.sidebar-row {
  align-items: center;
  display: flex;
  min-height: 34px;
}

.category-row { padding-left: 14px; }

.sidebar-link {
  border-radius: 6px;
  color: var(--vp-c-text-2);
  display: block;
  font-size: 14px;
  line-height: 24px;
  transition: color 0.25s;
}

.sidebar-link:hover,
.provider-button:hover { color: var(--vp-c-text-1); }

.sidebar-link.active { color: var(--vp-c-brand-1); }

.category-link {
  flex: 1 1 auto;
  font-weight: 600;
  padding: 4px 6px 4px 0;
}

.disclosure {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  height: 30px;
  margin-right: 3px;
  padding: 0;
  width: 30px;
}

.disclosure span,
.provider-chevron {
  display: inline-block;
  transition: transform 0.15s ease;
}

.disclosure[aria-expanded='true'] span,
.provider-button[aria-expanded='true'] .provider-chevron { transform: rotate(90deg); }

.nested-panel {
  border-left: 1px solid var(--vp-c-divider);
  margin-left: 14px;
  padding-left: 16px;
}

.overview-link { padding: 4px 8px; }

.provider-row { padding: 2px 0; }

.provider-button {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  justify-content: space-between;
  min-height: 32px;
  padding: 4px 8px;
  text-align: left;
  width: 100%;
}

.provider-chevron { font-size: 18px; }

.model-list {
  border-left: 1px solid var(--vp-c-divider);
  list-style: none;
  margin: 0 0 4px 8px;
  padding: 0 0 0 10px;
}

.model-link { padding: 4px 8px; }
</style>
