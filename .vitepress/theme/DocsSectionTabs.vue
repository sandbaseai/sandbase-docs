<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()

const activeSection = computed(() => {
  if (route.path.includes('/model-api-reference/')) return 'models'
  if (route.path.includes('/api-reference/')) return 'platform'
  return 'docs'
})

const tabs = [
  { id: 'docs', label: 'Docs', href: '/' },
  { id: 'models', label: 'Model API', href: '/model-api-reference/' },
  { id: 'platform', label: 'Platform API', href: '/api-reference/' },
]
</script>

<template>
  <nav class="docs-section-tabs" aria-label="Documentation sections">
    <a
      v-for="tab in tabs"
      :key="tab.id"
      class="docs-section-tab"
      :class="{ active: activeSection === tab.id }"
      :href="withBase(tab.href)"
      :aria-current="activeSection === tab.id ? 'page' : undefined"
    >
      {{ tab.label }}
    </a>
  </nav>
</template>

<style scoped>
.docs-section-tabs {
  display: grid;
  grid-template-columns: 0.72fr 1.2fr 1fr;
  gap: 2px;
  margin: 0 0 2rem;
  padding: 3px;
  border: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 72%, transparent);
}

.docs-section-tab {
  display: flex;
  min-width: 0;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  color: var(--color-ink-muted);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.15;
  text-align: center;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
}

.docs-section-tab:hover {
  background: var(--sb-sidebar-hover-bg);
  color: var(--color-ink);
}

.docs-section-tab.active {
  background: var(--color-ink);
  color: var(--vp-c-bg);
}

.docs-section-tab:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
</style>
