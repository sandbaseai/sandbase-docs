<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { useI18n } from './i18n'

// Shown on localized URLs whose translation does not exist yet, where the
// English source is rendered instead (see .vitepress/i18n/pages.mjs).
const { frontmatter, page } = useData()
const { tx, current, locale } = useI18n()
const englishHref = computed(() => {
  const file = page.value.relativePath.slice(locale.value.length + 1)
  return withBase(`/${file.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`)
})
</script>

<template>
  <p v-if="frontmatter.i18nFallback" class="translation-fallback" role="note">
    {{ tx('This page is not available in {language} yet, so it is shown in English.', { language: current.label }) }}
    <a :href="englishHref" hreflang="en" lang="en">{{ tx('Open the English page') }}</a>
  </p>
</template>

<style scoped>
.translation-fallback {
  margin: 0 0 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
}
.translation-fallback a {
  margin-left: 0.25rem;
  color: var(--vp-c-brand-1);
}
</style>
