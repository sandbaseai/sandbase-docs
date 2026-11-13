<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import BrandMark from './BrandMark.vue'

/**
 * Replica of the sandbase.ai site header:
 * Models ▾ / APIs / Skills / Agents / Docs / Pricing / Resources ▾.
 * Markup, menu content and behaviour mirror sandbase-fe
 * src/components/site-header.tsx and src/content/site-navigation.ts; styling
 * below is ported from site-header.module.css. Keep the three in sync when the
 * main-site navigation changes. Product links point at the main site; "Docs"
 * stays on this docs site. The first-top-up strip and the signed-in balance and
 * account menu are omitted because they need main-site APIs; signed-in visitors
 * get a Console link instead.
 */
const SITE = 'https://www.sandbase.ai'
const loginHref = `${SITE}/login`
const consoleHref = `${SITE}/console`

/** Header Models menu: the two kinds of model side by side. */
const modelMenu = [
  {
    key: 'llm',
    eyebrow: 'Language models',
    label: 'LLMs',
    href: `${SITE}/models`,
    cta: 'Browse LLMs',
    description: 'Chat, reasoning and coding. Claude, GPT, Gemini, DeepSeek and Qwen on one OpenAI-compatible API.',
    logos: ['openai.svg', 'anthropic.svg', 'google.svg', 'deepseek.svg', 'qwen.svg', 'moonshotai.ico'].map(
      (file) => `${SITE}/images/provider-logos/${file}`,
    ),
    thumbs: [] as string[],
  },
  {
    key: 'media',
    eyebrow: 'Generative media',
    label: 'Image & video',
    href: `${SITE}/models/image-video`,
    cta: 'Browse image & video',
    description: 'Text to image, image editing, text and image to video. Seedance, Kling, Wan, GPT Image and Nano Banana.',
    logos: [] as string[],
    thumbs: ['thumb-lanterns.webp', 'poster-golden-tree.webp', 'poster-fox.webp'].map(
      (file) => `${SITE}/images/home/${file}`,
    ),
  },
]

/** Top-level links between Models and Docs. */
const productLinks = [
  { label: 'APIs', href: `${SITE}/apis` },
  { label: 'Skills', href: `${SITE}/skills` },
  { label: 'Agents', href: `${SITE}/agents` },
]

const resourceLinks = [
  { label: 'Use in AI Tools', description: 'Give Claude Code, Codex or Cursor the whole catalog', href: `${SITE}/solutions/use-in-ai-tools`, external: false },
  { label: 'Open source', description: 'SDKs, CLI and working examples', href: `${SITE}/open-source`, external: false },
  { label: 'Influence', description: 'Creator and partner program', href: `${SITE}/affiliate`, external: false },
  // Lab is a separate app on this origin; the arrow says it leaves the main site.
  { label: 'Lab', description: 'Trending AI use cases, ready to run', href: `${SITE}/lab/`, external: true },
]

const route = useRoute()
const modelsOpen = ref(false)
const resourcesOpen = ref(false)
const drawerOpen = ref(false)
const mobileModelsOpen = ref(false)
const mobileResourcesOpen = ref(false)
const loggedIn = ref(false)
let modelsTimer: ReturnType<typeof setTimeout> | null = null

function openModels() {
  if (modelsTimer) clearTimeout(modelsTimer)
  resourcesOpen.value = false
  modelsOpen.value = true
}
function scheduleModelsClose() {
  if (modelsTimer) clearTimeout(modelsTimer)
  modelsTimer = setTimeout(() => (modelsOpen.value = false), 240)
}
function toggleResources() {
  modelsOpen.value = false
  resourcesOpen.value = !resourcesOpen.value
}
function closeMenus() {
  modelsOpen.value = false
  resourcesOpen.value = false
}
function closeDrawer() {
  drawerOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenus()
    closeDrawer()
  }
}
function onPointerDown(event: PointerEvent) {
  const target = event.target as Element | null
  if (!target?.closest('.sh-explore, .sh-solution')) closeMenus()
}

function syncAuthState() {
  try {
    // The docs and dashboard are served from the same origin, so the token the
    // dashboard stores is also the most direct source of truth here. We only
    // inspect its presence; the credential is never parsed, copied, or sent.
    loggedIn.value = Boolean(window.localStorage.getItem('token'))
  } catch {
    loggedIn.value = false
  }
}
function onVisibilityChange() {
  if (document.visibilityState === 'visible') syncAuthState()
}

watch(
  () => route.path,
  () => {
    closeMenus()
    closeDrawer()
  },
)
watch(drawerOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  syncAuthState()
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('focus', syncAuthState)
  window.addEventListener('pageshow', syncAuthState)
  window.addEventListener('storage', syncAuthState)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('focus', syncAuthState)
  window.removeEventListener('pageshow', syncAuthState)
  window.removeEventListener('storage', syncAuthState)
  if (modelsTimer) clearTimeout(modelsTimer)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <header class="sh-header">
    <div class="sh-bar">
      <a class="sh-logo" :href="SITE" target="_self" aria-label="SandBase home">
        <span class="sh-logo-mark" aria-hidden="true"><BrandMark /></span>
        <span class="sh-wordmark">SandBase</span>
      </a>

      <nav class="sh-desktop-nav" aria-label="Primary navigation">
        <div class="sh-explore" @mouseenter="openModels" @mouseleave="scheduleModelsClose">
          <a class="sh-nav-link" :href="`${SITE}/models`" target="_self">Models</a>
          <button
            type="button"
            class="sh-explore-trigger"
            aria-label="Toggle Models menu"
            aria-haspopup="menu"
            aria-controls="sh-models-menu"
            :aria-expanded="modelsOpen"
            @click="modelsOpen ? closeMenus() : openModels()"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="modelsOpen" id="sh-models-menu" class="sh-models-menu" role="menu" aria-label="Models">
            <a v-for="card in modelMenu" :key="card.key" class="sh-model-card" :href="card.href" target="_self" role="menuitem">
              <span class="sh-model-eyebrow">{{ card.eyebrow }}</span>
              <strong>{{ card.label }}</strong>
              <span class="sh-model-description">{{ card.description }}</span>
              <span v-if="card.logos.length" class="sh-model-logos" aria-hidden="true">
                <img v-for="src in card.logos" :key="src" :src="src" alt="" width="18" height="18" decoding="async" />
              </span>
              <span v-else class="sh-model-thumbs" aria-hidden="true">
                <img v-for="src in card.thumbs" :key="src" :src="src" alt="" decoding="async" />
              </span>
              <span class="sh-model-cta">{{ card.cta }} <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </div>
        <a v-for="link in productLinks" :key="link.href" class="sh-nav-link" :href="link.href" target="_self">{{ link.label }}</a>
        <a class="sh-nav-link" href="/docs/" data-active>Docs</a>
        <a class="sh-nav-link" :href="`${SITE}/pricing`" target="_self">Pricing</a>
        <div class="sh-solution">
          <button
            type="button"
            class="sh-solution-trigger"
            aria-controls="sh-resources-menu"
            :aria-expanded="resourcesOpen"
            @click="toggleResources"
          >
            Resources
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="resourcesOpen" id="sh-resources-menu" class="sh-resources-menu">
            <a v-for="item in resourceLinks" :key="item.href" :href="item.href" target="_self" @click="closeMenus">
              <strong>{{ item.label }}<span v-if="item.external" aria-hidden="true"> ↗</span></strong>
              <span>{{ item.description }}</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="sh-actions">
        <a v-if="loggedIn" class="sh-console" :href="consoleHref" target="_self">Console</a>
        <a v-else class="sh-start" :href="loginHref" target="_self">Start building</a>
      </div>

      <button
        type="button"
        class="sh-mobile-button"
        :aria-label="drawerOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="drawerOpen"
        @click="drawerOpen = !drawerOpen"
      >
        {{ drawerOpen ? 'Close' : 'Menu' }}
      </button>
    </div>

    <div v-if="drawerOpen" class="sh-drawer-root" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button type="button" class="sh-backdrop" aria-label="Dismiss navigation" tabindex="-1" @click="closeDrawer" />
      <div class="sh-drawer">
        <div class="sh-drawer-close-row">
          <button type="button" class="sh-drawer-close" aria-label="Close navigation panel" @click="closeDrawer">×</button>
        </div>
        <nav class="sh-mobile-nav" aria-label="Mobile navigation">
          <button type="button" class="sh-mobile-expand" :aria-expanded="mobileModelsOpen" @click="mobileModelsOpen = !mobileModelsOpen">
            Models
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-if="mobileModelsOpen" class="sh-mobile-sublinks">
            <a v-for="card in modelMenu" :key="card.key" :href="card.href" target="_self" @click="closeDrawer">{{ card.label }}</a>
          </div>
          <a v-for="link in productLinks" :key="link.href" class="sh-mobile-link" :href="link.href" target="_self" @click="closeDrawer">{{ link.label }}</a>
          <a class="sh-mobile-link" href="/docs/" data-active @click="closeDrawer">Docs</a>
          <a class="sh-mobile-link" :href="`${SITE}/pricing`" target="_self" @click="closeDrawer">Pricing</a>
          <button type="button" class="sh-mobile-expand" :aria-expanded="mobileResourcesOpen" @click="mobileResourcesOpen = !mobileResourcesOpen">
            Resources
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-if="mobileResourcesOpen" class="sh-mobile-sublinks">
            <a v-for="item in resourceLinks" :key="item.href" :href="item.href" target="_self" @click="closeDrawer">
              {{ item.label }}<span v-if="item.external" aria-hidden="true">&nbsp;↗</span>
            </a>
          </div>
        </nav>
        <div class="sh-drawer-actions">
          <a v-if="loggedIn" class="sh-console" :href="consoleHref" target="_self" @click="closeDrawer">Console</a>
          <a v-else class="sh-start" :href="loginHref" target="_self" @click="closeDrawer">Start building</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.sh-header {
  position: fixed;
  z-index: 55;
  inset: 0 0 auto;
  width: 100%;
  background: var(--color-canvas);
}
.sh-bar {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  align-items: center;
  gap: 1.5rem;
  height: var(--vp-nav-height);
  padding: 0 1.25rem;
}

/* Logo. */
.sh-logo {
  display: inline-flex;
  grid-column: 1;
  align-items: center;
  gap: 0.625rem;
  justify-self: start;
  color: var(--color-ink);
  text-decoration: none;
}
.sh-logo-mark {
  display: block;
  width: 21.11px;
  height: 26px;
  color: inherit;
}
.sh-logo-mark :deep(svg) {
  width: 100%;
  height: 100%;
}
.sh-wordmark {
  font-family: var(--font-family-brand);
  font-size: 1.5rem;
  font-weight: 550;
  letter-spacing: -0.018em;
  line-height: 1.1;
}

/* Primary navigation. */
.sh-desktop-nav {
  display: flex;
  grid-column: 2;
  align-items: center;
  gap: 1.75rem;
  font-family: var(--font-family-brand);
}
.sh-nav-link,
.sh-solution-trigger {
  color: var(--color-ink);
  font-family: var(--font-family-brand);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5rem;
  text-decoration: none;
  transition: color 150ms ease;
}
.sh-nav-link:hover,
.sh-nav-link[data-active],
.sh-solution-trigger:hover,
.sh-solution-trigger[aria-expanded='true'] {
  color: var(--color-accent);
}
.sh-explore {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.sh-explore:has(.sh-explore-trigger[aria-expanded='true']) > .sh-nav-link {
  color: var(--color-accent);
}
.sh-solution {
  position: relative;
  display: flex;
  align-items: center;
}
.sh-explore-trigger {
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: color 150ms ease;
}
.sh-solution-trigger {
  display: inline-flex;
  height: 1.5rem;
  align-items: center;
  gap: 0.5625rem;
  padding: 0 0.3125rem 0 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.sh-explore-trigger:hover,
.sh-explore-trigger[aria-expanded='true'] {
  color: var(--color-accent);
}
.sh-explore-trigger svg,
.sh-solution-trigger svg {
  width: 0.875rem;
  height: 0.875rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 150ms ease;
}
.sh-solution-trigger svg {
  color: var(--color-ink-muted);
  transition: transform 150ms ease, color 150ms ease;
}
.sh-solution-trigger:hover svg,
.sh-solution-trigger[aria-expanded='true'] svg {
  color: var(--color-accent);
}
.sh-explore-trigger[aria-expanded='true'] svg,
.sh-solution-trigger[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

/* Models menu: LLMs and image & video side by side. */
.sh-models-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: -1.5rem;
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(40rem, calc(100vw - 2rem));
  padding: 0.75rem;
  border: 1px solid var(--color-line);
  background: var(--color-sheet);
  box-shadow: var(--shadow-float);
}
/* An invisible bridge so the pointer can cross the gap to the panel. */
.sh-models-menu::before {
  position: absolute;
  right: 0;
  bottom: 100%;
  left: 0;
  height: 0.75rem;
  content: '';
}
.sh-model-card {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  padding: 1rem;
  color: var(--color-ink);
  font-family: var(--font-family-body);
  text-decoration: none;
  transition: background-color 150ms ease;
}
.sh-model-card:hover,
.sh-model-card:focus-visible {
  outline: none;
  background: var(--color-canvas);
}
.sh-model-card:focus-visible {
  box-shadow: inset 0 0 0 2px var(--color-accent);
}
.sh-model-eyebrow {
  color: var(--color-accent);
  font: 500 0.6875rem/1.4 var(--font-family-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.sh-model-card strong {
  font-family: var(--font-family-brand);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.sh-model-description {
  color: var(--color-ink-muted);
  font-size: 0.84375rem;
  line-height: 1.45;
}
.sh-model-logos {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.375rem;
}
.sh-model-logos img {
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  padding: 6px;
  border: 1px solid var(--color-line);
  background: #fff;
  object-fit: contain;
}
.sh-model-thumbs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.3125rem;
  margin-top: 0.375rem;
}
.sh-model-thumbs img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
.sh-model-cta {
  margin-top: auto;
  padding-top: 0.5rem;
  color: var(--color-ink);
  font-size: 0.875rem;
  font-weight: 500;
}
.sh-model-card:hover .sh-model-cta {
  color: var(--color-accent);
}

/* Resources menu. */
.sh-resources-menu {
  position: absolute;
  top: calc(100% + 18px);
  right: 0;
  z-index: 40;
  width: 290px;
  padding: 10px;
  border: 1px solid var(--color-line);
  border-radius: 10px;
  background: var(--color-sheet);
  box-shadow: 0 14px 36px #00000012;
}
.sh-resources-menu a {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 6px;
  color: var(--color-ink);
  font-family: var(--font-family-body);
  text-decoration: none;
}
.sh-resources-menu a:hover,
.sh-resources-menu a:focus-visible {
  background: var(--color-canvas);
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
.sh-resources-menu strong {
  font-size: 16px;
  font-weight: 500;
}
.sh-resources-menu span {
  color: var(--color-ink-muted);
  font-size: 13px;
  line-height: 1.5;
}
.sh-resources-menu strong span {
  color: inherit;
  font-size: inherit;
}

/* Right-hand actions. */
.sh-actions {
  display: flex;
  grid-column: 3;
  align-items: center;
  gap: 1.25rem;
  justify-self: end;
}
.sh-start {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.625rem 1.125rem 0.625rem 1.25rem;
  background: var(--color-ink);
  color: var(--color-canvas);
  font-family: var(--font-family-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.5rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 150ms ease, color 150ms ease;
}
.sh-start:hover {
  background: var(--color-tint-cyan);
  color: var(--color-tint-fg);
}
.sh-console {
  padding: 0.5rem 0.875rem;
  background: var(--color-surface-alt);
  color: var(--color-accent);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4375rem;
  text-decoration: none;
  transition: background-color 150ms ease;
}
.sh-console:hover {
  background: var(--color-surface);
}

/* Mobile trigger + drawer. */
.sh-mobile-button {
  display: none;
  grid-column: 3;
  min-width: 2.75rem;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  justify-self: end;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-family-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}
.sh-drawer-root {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: max(1rem, env(safe-area-inset-top)) 1rem max(1rem, env(safe-area-inset-bottom));
}
.sh-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(0 0 0 / 0.35);
}
.sh-drawer {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 28rem;
  max-height: calc(100dvh - max(1rem, env(safe-area-inset-top)) - max(1rem, env(safe-area-inset-bottom)));
  overflow-y: auto;
  overscroll-behavior: contain;
  flex-direction: column;
  padding: 0.5rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-float);
}
.sh-drawer-close-row {
  position: sticky;
  top: -0.5rem;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  background: var(--color-surface);
}
.sh-drawer-close {
  display: grid;
  min-width: 2.75rem;
  min-height: 2.75rem;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-size: 1.75rem;
  cursor: pointer;
}
.sh-mobile-nav {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
}
.sh-mobile-link,
.sh-mobile-expand {
  display: flex;
  width: 100%;
  min-height: 2.75rem;
  align-items: center;
  padding: 0.65rem 1.25rem;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.sh-mobile-link[data-active] {
  color: var(--color-accent);
}
.sh-mobile-expand {
  justify-content: space-between;
}
.sh-mobile-expand svg {
  width: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  transition: transform 150ms ease;
}
.sh-mobile-expand[aria-expanded='true'] svg {
  transform: rotate(180deg);
}
.sh-mobile-sublinks {
  display: grid;
  padding: 0.25rem 1.25rem 0.75rem 1.75rem;
}
.sh-mobile-sublinks a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.4375rem;
  text-decoration: none;
}
.sh-drawer-actions {
  flex: 0 0 auto;
  display: grid;
  gap: 0.75rem;
  margin-top: auto;
  padding: 1.5rem 1rem;
}
.sh-drawer-actions a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
}

*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .sh-bar {
    padding-inline: 2.5rem;
  }
}
@media (max-width: 1023px) {
  .sh-desktop-nav,
  .sh-actions {
    display: none;
  }
  .sh-mobile-button {
    display: flex;
  }
}
@media (min-width: 1024px) and (max-width: 1535px) {
  .sh-desktop-nav {
    gap: 1rem;
  }
  .sh-bar {
    gap: 1rem;
    padding-inline: 1.25rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sh-explore-trigger svg,
  .sh-solution-trigger svg,
  .sh-mobile-expand svg {
    transition: none;
  }
}
</style>
