<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()
const isCategoryExpanded = ref(false)
const isByteDanceExpanded = ref(false)
const isGoogleExpanded = ref(false)
const isModelApiReferenceRoute = computed(() => /\/model-api-reference(?:\/|$)/.test(route.path))

const models = [
  {
    text: 'Seedance 2.5 Official',
    link: '/model-api-reference/seedance-native-api/bytedance/seedance-2.5-official',
  },
  {
    text: 'Seedance 2.0 Official',
    link: '/model-api-reference/seedance-native-api/bytedance/seedance-2.0-official',
  },
]

const googleModels = [
  {
    text: 'Gemini Omni Flash Preview',
    link: '/model-api-reference/llm-models/google/gemini-omni-flash-preview',
  },
  {
    text: 'Gemini Omni 1.1 Flash Preview',
    link: '/model-api-reference/seedance-native-api/google/gemini-omni-1.1-flash-preview',
  },
  {
    text: 'Gemini 3.1 Pro Preview',
    link: '/model-api-reference/llm-models/google/gemini-3.1-pro-preview',
  },
  {
    text: 'Gemini 3.1 Flash Lite',
    link: '/model-api-reference/llm-models/google/gemini-3.1-flash-lite',
  },
  {
    text: 'Gemini 3.1 Flash Lite Preview',
    link: '/model-api-reference/llm-models/google/gemini-3.1-flash-lite-preview',
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
    if (/\/model-api-reference\/seedance-native-api(?:\/|$)/.test(path)) {
      isCategoryExpanded.value = true
      if (path.includes('/seedance-native-api/bytedance/')) isByteDanceExpanded.value = true
      if (path.includes('/seedance-native-api/google/')) isGoogleExpanded.value = true
    }
    if (path.includes('/model-api-reference/llm-models/google/')) {
      isCategoryExpanded.value = true
      isGoogleExpanded.value = true
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
        :class="{ active: isActive('/model-api-reference/seedance-native-api') }"
        :aria-current="isActive('/model-api-reference/seedance-native-api') ? 'page' : undefined"
        :href="withBase('/model-api-reference/seedance-native-api')"
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
        :class="{ active: isActive('/model-api-reference/seedance-native-api') }"
        :aria-current="isActive('/model-api-reference/seedance-native-api') ? 'page' : undefined"
        :href="withBase('/model-api-reference/seedance-native-api')"
      >Overview</a>
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
