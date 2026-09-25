<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import BrandMark from './BrandMark.vue'

/**
 * Faithful replica of the sandbase.ai site header (logged-out variant).
 * Markup and behaviour mirror sandbase-fe/src/components/site-header.tsx;
 * styling below is ported from site-header.module.css. Product links point at
 * the main site; "Docs" stays on this docs site.
 */
const SITE = 'https://www.sandbase.ai'
const loginHref = `${SITE}/login`

const exploreGroups = [
  {
    label: 'Models',
    items: [
      { label: 'Language Models', description: 'Explore text, reasoning and coding models', href: `${SITE}/models` },
      { label: 'Image/Video Models', description: 'Discover visual generation and vision models', href: `${SITE}/models/image-video` },
    ],
  },
  {
    label: 'Building Blocks',
    items: [
      { label: 'APIs', description: 'Connect search, data and SaaS capabilities', href: `${SITE}/apis` },
      { label: 'Skills', description: 'Add reusable instructions to your Agents', href: `${SITE}/skills` },
    ],
  },
]

const solutionGroups = [
  {
    label: '01 · EXPLORE CAPABILITIES',
    items: [
      { label: 'Language Models', description: 'Reasoning, coding, chat, and multimodal language intelligence.', href: `${SITE}/solutions/language-models` },
      { label: 'Image & Video Models', description: 'Generate, understand, and transform visual content.', href: `${SITE}/solutions/image-video-models` },
      { label: 'APIs & Services', description: 'Connect search, data, SaaS, and specialized capabilities.', href: `${SITE}/solutions/apis-services` },
    ],
  },
  {
    label: '02 · CONNECT & BUILD',
    items: [
      { label: 'Use in Your AI Tools', description: 'Connect SandBase to the tools already in your workflow.', href: `${SITE}/solutions/use-in-ai-tools` },
      { label: 'Build Agent', description: 'Define an Agent’s job, instructions, and runtime configuration.', href: `${SITE}/solutions/build-agent` },
    ],
  },
  {
    label: '03 · RUN & IMPROVE',
    items: [
      { label: 'Schedule Agent Work', description: 'Run recurring research, monitoring, and reporting work.', href: `${SITE}/solutions/schedule-agent-work` },
      { label: 'Monitor Agent Runs', description: 'Inspect sessions, activity, and the work your Agents deliver.', href: `${SITE}/solutions/monitor-agent-runs` },
    ],
  },
]

const route = useRoute()

const exploreOpen = ref(false)
const solutionOpen = ref(false)
const drawerOpen = ref(false)
const mobileExploreOpen = ref(false)
const mobileSolutionOpen = ref(false)

let exploreTimer: ReturnType<typeof setTimeout> | null = null
let solutionTimer: ReturnType<typeof setTimeout> | null = null

function openExplore() {
  if (exploreTimer) clearTimeout(exploreTimer)
  solutionOpen.value = false
  exploreOpen.value = true
}
function scheduleExploreClose() {
  if (exploreTimer) clearTimeout(exploreTimer)
  exploreTimer = setTimeout(() => (exploreOpen.value = false), 200)
}
function openSolution() {
  if (solutionTimer) clearTimeout(solutionTimer)
  exploreOpen.value = false
  solutionOpen.value = true
}
function scheduleSolutionClose() {
  if (solutionTimer) clearTimeout(solutionTimer)
  solutionTimer = setTimeout(() => (solutionOpen.value = false), 200)
}
function closeMenus() {
  exploreOpen.value = false
  solutionOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenus()
    drawerOpen.value = false
  }
}

watch(
  () => route.path,
  () => {
    closeMenus()
    drawerOpen.value = false
  },
)

watch(drawerOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <header class="sh-header">
    <div class="sh-bar">
      <a class="sh-logo" :href="SITE" aria-label="SandBase home">
        <span class="sh-logo-mark" aria-hidden="true"><BrandMark /></span>
        <span class="sh-wordmark">SandBase</span>
      </a>

      <nav class="sh-desktop-nav" aria-label="Primary navigation">
        <div class="sh-explore" @mouseenter="openExplore" @mouseleave="scheduleExploreClose">
          <a class="sh-nav-link" :href="`${SITE}/models`">Explore</a>
          <button
            type="button"
            class="sh-explore-trigger"
            aria-label="Toggle Explore menu"
            aria-haspopup="menu"
            :aria-expanded="exploreOpen"
            @click="exploreOpen ? closeMenus() : openExplore()"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="exploreOpen" class="sh-explore-menu" role="menu" aria-label="Explore" @mouseenter="openExplore" @mouseleave="scheduleExploreClose">
            <section v-for="group in exploreGroups" :key="group.label">
              <p>{{ group.label }}</p>
              <a v-for="item in group.items" :key="item.href" :href="item.href" role="menuitem">
                <strong>{{ item.label }}</strong>
                <span>{{ item.description }}</span>
              </a>
            </section>
            <footer>Everything your Agent needs, in one place.</footer>
          </div>
        </div>

        <a class="sh-nav-link" :href="`${SITE}/agents`">Agents</a>

        <div class="sh-solution" @mouseenter="openSolution" @mouseleave="scheduleSolutionClose">
          <button
            type="button"
            class="sh-solution-trigger"
            aria-haspopup="menu"
            :aria-expanded="solutionOpen"
            @click="solutionOpen ? closeMenus() : openSolution()"
          >
            Solutions
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="solutionOpen" class="sh-solution-menu" role="menu" aria-label="Solutions" @mouseenter="openSolution" @mouseleave="scheduleSolutionClose">
            <section v-for="group in solutionGroups" :key="group.label">
              <p>{{ group.label }}</p>
              <a v-for="item in group.items" :key="item.href" :href="item.href" role="menuitem">
                <strong>{{ item.label }}</strong>
                <span>{{ item.description }}</span>
              </a>
            </section>
            <footer>Composable Models, APIs, and services for any workflow.</footer>
          </div>
        </div>

        <a class="sh-nav-link" href="/docs/">Docs</a>
        <a class="sh-nav-link" :href="`${SITE}/pricing`">Pricing</a>
      </nav>

      <div class="sh-actions">
        <a class="sh-github" :href="`https://github.com/sandbaseai`" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
        </a>
        <a class="sh-signin" :href="loginHref">Sign in</a>
        <a class="sh-start" :href="loginHref">Start building</a>
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
      <button type="button" class="sh-backdrop" aria-label="Close menu" @click="drawerOpen = false" />
      <div class="sh-drawer">
        <nav class="sh-mobile-nav" aria-label="Mobile navigation">
          <button type="button" class="sh-mobile-expand" :aria-expanded="mobileExploreOpen" @click="mobileExploreOpen = !mobileExploreOpen">
            Explore
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-if="mobileExploreOpen" class="sh-mobile-sublinks">
            <template v-for="group in exploreGroups" :key="group.label">
              <a v-for="item in group.items" :key="item.href" :href="item.href" @click="drawerOpen = false">{{ item.label }}</a>
            </template>
          </div>

          <a class="sh-mobile-link" :href="`${SITE}/agents`" @click="drawerOpen = false">Agents</a>

          <button type="button" class="sh-mobile-expand" :aria-expanded="mobileSolutionOpen" @click="mobileSolutionOpen = !mobileSolutionOpen">
            Solutions
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-if="mobileSolutionOpen" class="sh-mobile-solution">
            <section v-for="group in solutionGroups" :key="group.label">
              <p>{{ group.label }}</p>
              <a v-for="item in group.items" :key="item.href" :href="item.href" @click="drawerOpen = false">{{ item.label }}</a>
            </section>
          </div>

          <a class="sh-mobile-link" href="/docs/" @click="drawerOpen = false">Docs</a>
          <a class="sh-mobile-link" :href="`${SITE}/pricing`" @click="drawerOpen = false">Pricing</a>
        </nav>
        <div class="sh-drawer-actions">
          <a class="sh-signin" href="https://github.com/sandbaseai" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="sh-signin" :href="loginHref" @click="drawerOpen = false">Sign in</a>
          <a class="sh-start" :href="loginHref" @click="drawerOpen = false">Start building</a>
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

.sh-logo {
  display: inline-flex;
  grid-column: 1;
  align-items: center;
  gap: 0.6rem;
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
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 550;
  letter-spacing: -0.018em;
  line-height: 1.1;
}

.sh-desktop-nav {
  display: flex;
  grid-column: 2;
  align-items: center;
  gap: 1.75rem;
}

.sh-nav-link,
.sh-solution-trigger {
  color: var(--color-ink);
  font-family: var(--font-family-body);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5rem;
  text-decoration: none;
  transition: color 150ms ease;
}
.sh-nav-link:hover,
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
.sh-explore-trigger[aria-expanded='true'] svg,
.sh-solution-trigger[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

.sh-explore-menu,
.sh-solution-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  display: grid;
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 4px;
  box-shadow: var(--shadow-lg);
}
.sh-explore-menu {
  left: -1.25rem;
  width: min(38rem, calc(100vw - 2rem));
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.sh-solution-menu {
  left: 50%;
  width: min(52rem, calc(100vw - 2rem));
  grid-template-columns: repeat(3, minmax(13rem, 1fr));
  transform: translateX(-50%);
}
.sh-explore-menu::before,
.sh-solution-menu::before {
  position: absolute;
  right: 0;
  bottom: 100%;
  left: 0;
  height: 0.75rem;
  content: '';
}
.sh-explore-menu section + section,
.sh-solution-menu section + section {
  padding-left: 0.75rem;
  margin-left: 0.75rem;
  border-left: 1px solid var(--color-line);
}
.sh-explore-menu section > p,
.sh-solution-menu section > p {
  margin: 0 0 0.25rem;
  padding: 0.25rem 0.75rem 0.5rem;
  color: var(--color-ink-subtle);
  font-family: var(--font-family-mono);
  font-size: 0.625rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.sh-explore-menu a,
.sh-solution-menu a {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
  align-content: center;
  padding: 0.75rem;
  border-radius: 4px;
  color: var(--color-ink);
  text-decoration: none;
  transition: background-color 150ms ease;
}
.sh-explore-menu a:hover,
.sh-explore-menu a:focus-visible,
.sh-solution-menu a:hover,
.sh-solution-menu a:focus-visible {
  outline: none;
  background: var(--color-canvas);
}
.sh-explore-menu strong,
.sh-solution-menu strong {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-ink);
}
.sh-explore-menu span,
.sh-solution-menu span {
  min-width: 0;
  color: var(--color-ink-muted);
  font-size: 0.90625rem;
  line-height: 1.375rem;
  white-space: normal;
  overflow-wrap: anywhere;
}
.sh-explore-menu footer,
.sh-solution-menu footer {
  grid-column: 1 / -1;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-line);
  color: var(--color-ink-subtle);
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
}

.sh-actions {
  display: flex;
  grid-column: 3;
  align-items: center;
  gap: 1.25rem;
  justify-self: end;
}
.sh-github {
  display: flex;
  align-items: center;
  color: var(--color-ink);
  transition: color 150ms ease;
}
.sh-github:hover {
  color: var(--color-accent);
}
.sh-signin {
  color: var(--color-ink-muted);
  font-size: 1rem;
  text-decoration: none;
  transition: color 150ms ease;
}
.sh-signin:hover {
  color: var(--color-ink);
}
.sh-start {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.625rem 1.125rem 0.625rem 1.25rem;
  background: var(--color-ink);
  color: var(--color-canvas);
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
  color: var(--color-ink);
}

.sh-mobile-button {
  display: none;
  grid-column: 3;
  height: 2.5rem;
  align-items: center;
  justify-self: end;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.sh-drawer-root {
  position: absolute;
  z-index: 60;
  top: var(--vp-nav-height);
  right: 1rem;
  left: 1rem;
}
.sh-backdrop {
  position: fixed;
  inset: 0;
  border: 0;
  background: transparent;
}
.sh-drawer {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  box-shadow: var(--shadow-lg);
}
.sh-mobile-nav {
  display: flex;
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
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
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
  border-left: 1px solid var(--color-line);
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
}
.sh-mobile-solution {
  display: grid;
  gap: 0.75rem;
  padding: 0.25rem 1.25rem 0.75rem 1.75rem;
}
.sh-mobile-solution section > p {
  margin: 0.4rem 0;
  color: var(--color-ink-subtle);
  font-family: var(--font-family-mono);
  font-size: 0.625rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.sh-mobile-solution a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-left: 1px solid var(--color-line);
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
}
.sh-drawer-actions {
  display: grid;
  gap: 0.75rem;
  margin-top: auto;
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--color-line);
}
.sh-drawer-actions a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
}
.sh-drawer-actions .sh-signin {
  border: 1px solid var(--color-line);
  padding: 0.625rem 1rem;
  color: var(--color-ink);
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
    grid-column: 2;
    justify-self: end;
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
