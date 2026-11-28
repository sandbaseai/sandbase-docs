<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { LOCALES, SOURCE_LOCALE, useI18n, withLocale } from './i18n'
import { isSingleLanguageFile } from '../i18n/locales.mjs'

/**
 * Language menu. Each entry links to the same page in another locale; every
 * English page exists in every locale (untranslated ones show English), so
 * the link is always valid. Pages written for one language only, and the
 * 404 page, link to the other locale's home page instead.
 */
const props = withDefaults(defineProps<{ variant?: 'menu' | 'list' }>(), { variant: 'menu' })
const emit = defineEmits<{ navigate: [] }>()

const { page } = useData()
const { tx, locale, current } = useI18n()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

/** The page's path without locale and base, e.g. `/guides/streaming`. */
const sourcePath = computed(() => {
  if (page.value.isNotFound) return null
  let file = page.value.relativePath
  if (locale.value !== SOURCE_LOCALE) file = file.slice(locale.value.length + 1)
  if (!file || isSingleLanguageFile(file)) return null
  return `/${file.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
})

const options = computed(() => LOCALES.map((entry) => ({
  ...entry,
  href: withBase(withLocale(sourcePath.value ?? '/', entry.code)),
  active: entry.code === locale.value,
})))

function hrefWithHash(href: string) {
  return typeof window === 'undefined' || !sourcePath.value ? href : href + window.location.hash
}

function choose(event: MouseEvent, href: string) {
  // Keep the reader's position on the page when the target has the same anchors.
  const target = hrefWithHash(href)
  if (target !== href) (event.currentTarget as HTMLAnchorElement).href = target
  open.value = false
  emit('navigate')
}

function onPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" :class="['ls', `ls-${props.variant}`]">
    <button
      type="button"
      class="ls-trigger"
      :aria-label="tx('Change language')"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg class="ls-globe" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      <span>{{ current.label }}</span>
      <svg class="ls-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <ul v-show="open" class="ls-options" :aria-label="tx('Language')">
      <li v-for="option in options" :key="option.code">
        <a
          :href="option.href"
          :hreflang="option.code"
          :lang="option.code"
          :aria-current="option.active ? 'true' : undefined"
          :class="{ active: option.active }"
          @click="choose($event, option.href)"
        >{{ option.label }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ls {
  position: relative;
}
.ls-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.75rem;
  padding: 0 0.25rem;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-family-body);
  font-size: 0.9375rem;
  line-height: 1.5rem;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms ease;
}
.ls-trigger:hover,
.ls-trigger[aria-expanded='true'] {
  color: var(--color-accent);
}
.ls-trigger svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
}
.ls-globe {
  width: 1.125rem;
  height: 1.125rem;
}
.ls-chevron {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-ink-muted);
  transition: transform 150ms ease;
}
.ls-trigger[aria-expanded='true'] .ls-chevron {
  transform: rotate(180deg);
}
.ls-options {
  margin: 0;
  padding: 0.375rem;
  list-style: none;
}
.ls-menu .ls-options {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 45;
  display: grid;
  grid-template-columns: repeat(2, minmax(8.5rem, 1fr));
  gap: 2px;
  border: 1px solid var(--color-line);
  border-radius: 10px;
  background: var(--color-sheet);
  box-shadow: 0 14px 36px #00000012;
}
.ls-list .ls-trigger {
  width: 100%;
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
}
.ls-list .ls-chevron {
  margin-left: auto;
}
.ls-list .ls-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0.25rem 1.25rem 0.75rem 1.75rem;
}
.ls-options a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: var(--color-ink);
  font-family: var(--font-family-body);
  font-size: 0.875rem;
  line-height: 1.4;
  text-decoration: none;
}
.ls-options a:hover,
.ls-options a:focus-visible {
  background: var(--color-canvas);
  outline: none;
}
.ls-options a.active {
  color: var(--color-accent);
  font-weight: 500;
}
@media (prefers-reduced-motion: reduce) {
  .ls-chevron {
    transition: none;
  }
}
</style>
