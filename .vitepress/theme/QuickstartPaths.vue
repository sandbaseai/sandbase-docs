<template>
  <nav class="quickstart-paths" :aria-label="tx('Choose a Quick Start path')">
    <a v-for="path in paths" :key="path.href" :href="path.href">
      <span class="path-heading"><strong>{{ tx(path.title) }}</strong><span aria-hidden="true">→</span></span>
      <span class="path-description">{{ tx(path.description) }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from './i18n'

const { tx } = useI18n()
const paths = [
  { title: 'On the platform', description: 'Try a model or API in your browser. No code required.', href: '#use-on-website' },
  { title: 'Through the API', description: 'Use your workspace key to call an endpoint from your app.', href: '#call-api' },
  { title: 'With your Agent', description: 'Connect your AI tool to discover and use SandBase capabilities.', href: '#use-in-ai-tool' },
]
</script>

<style scoped>
.quickstart-paths { display: grid; gap: 0; margin: 24px 0; border-top: 1px solid var(--vp-c-divider); }
.quickstart-paths a { display: grid; gap: 6px; padding: 20px 16px; border-bottom: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); text-decoration: none; }
.path-heading { display: flex; justify-content: space-between; gap: 16px; font-size: 18px; line-height: 1.5; }
.path-heading > span { color: var(--vp-c-brand-1); }
.path-description { color: var(--vp-c-text-2); font-size: 15px; line-height: 1.6; }
.quickstart-paths a:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
.quickstart-paths a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: -2px; }
@media (max-width: 640px) { .quickstart-paths a { padding: 16px 8px; } }
</style>
