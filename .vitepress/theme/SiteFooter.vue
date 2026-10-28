<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import BrandMark from './BrandMark.vue'
import SocialIcon from './SocialIcon.vue'

/**
 * Faithful replica of the sandbase.ai site footer. Markup and styling mirror
 * sandbase-fe/src/components/site-footer.tsx + site-footer.module.css. Product
 * links point at the main site; "Docs" stays on this docs site. The inline
 * colour-theme switch replaces the appearance toggle that lived in the nav.
 */
const SITE = 'https://www.sandbase.ai'
const statusPageUrl = 'https://status.sandbase.ai/'
const contactSalesHref = `${SITE}/contact-sales?source=footer`
const tagline =
  'Models, APIs and Runtimes on one account. Build your personal Agent and call it through the OpenAI Agents API.'

type FooterLink = { href: string; label: string; external?: boolean; separate?: boolean }

/* Mirrors the header: Store and Build menus, the Solutions landing pages, then Docs/Pricing/Lab. */
const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Store',
    links: [
      { href: `${SITE}/models`, label: 'Language Models' },
      { href: `${SITE}/models/image-video`, label: 'Image & Video Models' },
      { href: `${SITE}/apis`, label: 'APIs' },
      { href: `${SITE}/skills`, label: 'Skills' },
    ],
  },
  {
    title: 'Build',
    links: [
      { href: `${SITE}/solutions/use-in-ai-tools`, label: 'Use in AI Tools' },
      { href: `${SITE}/agents`, label: 'Agents' },
      { href: `${SITE}/landing/sandbox`, label: 'Sandbox' },
      { href: `${SITE}/console`, label: 'Console' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: `${SITE}/solutions/language-models`, label: 'Language Models' },
      { href: `${SITE}/solutions/image-video-models`, label: 'Image & Video Models' },
      { href: `${SITE}/solutions/apis-services`, label: 'APIs & Services' },
      { href: `${SITE}/solutions/build-agent`, label: 'Build Agent' },
      { href: `${SITE}/solutions/monitor-agent-runs`, label: 'Monitor Agent Runs' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/docs/', label: 'Docs' },
      { href: `${SITE}/pricing`, label: 'Pricing' },
      { href: `${SITE}/models/compare`, label: 'Compare Models' },
      { href: `${SITE}/lab/`, label: 'Lab', separate: true },
      { href: 'https://blog.sandbase.ai/', label: 'Blog', external: true },
    ],
  },
]

const socialLinks = [
  { href: 'https://github.com/sandbaseai', label: 'GitHub', icon: 'github' },
  { href: 'https://discord.com/invite/4hXv2f5Q9f', label: 'Discord', icon: 'discord' },
  { href: 'https://x.com/sandbaseai', label: 'X.com', icon: 'x' },
  { href: 'https://www.linkedin.com/company/sandbaseai', label: 'LinkedIn', icon: 'linkedin' },
] as const

type Theme = 'system' | 'light' | 'dark'

const themeOptions: readonly { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const { isDark } = useData()
const theme = ref<Theme>('system')
let systemTheme: MediaQueryList | undefined

function applyTheme(next: Theme) {
  theme.value = next
  isDark.value = next === 'system' ? (systemTheme?.matches ?? false) : next === 'dark'
  try {
    localStorage.setItem('theme', next)
    localStorage.setItem('vitepress-theme-appearance', next === 'system' ? 'auto' : next)
  } catch {
    /* privacy mode */
  }
}

function followSystemTheme(event: MediaQueryListEvent) {
  if (theme.value === 'system') isDark.value = event.matches
}

onMounted(() => {
  systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  const storedTheme = localStorage.getItem('theme')
  applyTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system')
  systemTheme.addEventListener('change', followSystemTheme)
})

onBeforeUnmount(() => {
  systemTheme?.removeEventListener('change', followSystemTheme)
})

function chooseTheme(next: Theme) {
  if (next !== theme.value) applyTheme(next)
}
</script>

<template>
  <footer class="sf-footer">
    <div class="sf-container">
      <div class="sf-main">
        <div class="sf-brand">
          <a class="sf-logo" :href="SITE" aria-label="SandBase home">
            <span class="sf-logo-mark" aria-hidden="true"><BrandMark /></span>
            <span class="sf-wordmark">SandBase</span>
          </a>
          <p>{{ tagline }}</p>
          <ul class="sf-socials">
            <li v-for="item in socialLinks" :key="item.href">
              <a :href="item.href" target="_blank" rel="noopener noreferrer" class="sf-link sf-social-link">
                <SocialIcon :name="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
          <a :href="contactSalesHref" target="_self" class="sf-link sf-contact-sales">Contact Sales<span aria-hidden="true"> →</span></a>
        </div>

        <nav aria-label="Footer" class="sf-nav">
          <div class="sf-nav-grid">
            <div v-for="section in footerSections" :key="section.title" class="sf-group">
              <p class="sf-group-title">{{ section.title }}</p>
              <ul>
                <li v-for="item in section.links" :key="item.href + item.label">
                  <a
                    :href="item.href"
                    :target="item.external ? '_blank' : item.href.startsWith('http') ? '_self' : undefined"
                    :rel="item.external ? 'noopener noreferrer' : undefined"
                    class="sf-link"
                  >{{ item.label }}<span v-if="item.external || item.separate" aria-hidden="true"> ↗</span></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div class="sf-bottom">
        <div class="sf-legal">
          <p>© 2026 SandBase</p>
          <a :href="`${SITE}/terms`" target="_self">Terms</a>
          <a :href="`${SITE}/privacy`" target="_self">Privacy</a>
        </div>
        <div class="sf-status">
          <a :href="statusPageUrl" target="_blank" rel="noopener noreferrer" aria-label="View SandBase uptime status" class="sf-status-link">
            <span aria-hidden="true" class="sf-status-dot" />
            All systems operational
          </a>
          <div class="sf-theme" role="radiogroup" aria-label="Colour theme">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              role="radio"
              :aria-checked="theme === option.value"
              :class="['sf-theme-option', { 'is-active': theme === option.value }]"
              @click="chooseTheme(option.value)"
            >
              <span class="sf-theme-marker" aria-hidden="true" />
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.sf-footer {
  position: relative;
  /* Sit above the fixed docs sidebar (desktop z-index 25) so the full-width
     footer paints edge-to-edge over the sidebar's lower portion at the bottom
     of the page, instead of being clipped by it. Stays below the mobile
     sidebar drawer (60) and its backdrop (50). */
  z-index: 45;
  width: 100%;
  border-top: 1px solid var(--color-line);
  background: var(--color-canvas);
  color: var(--color-ink);
  line-height: 1.5rem;
}
.sf-container {
  margin-inline: var(--page-inset);
  padding-block: 3rem 2.25rem;
}
.sf-main {
  display: grid;
  gap: 3rem;
}
.sf-brand {
  display: flex;
  max-width: 22rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}
.sf-brand p {
  margin: 0;
  color: var(--color-ink-muted);
  font-size: 0.9375rem;
  line-height: 1.4375rem;
}
.sf-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-ink);
  text-decoration: none;
}
.sf-logo-mark {
  display: block;
  width: 21.11px;
  height: 26px;
  color: inherit;
}
.sf-logo-mark :deep(svg) {
  width: 100%;
  height: 100%;
}
.sf-wordmark {
  font-family: var(--font-family-heading);
  font-size: 1.4rem;
  font-weight: 550;
  letter-spacing: -0.018em;
  line-height: 1;
}
.sf-socials,
.sf-group ul {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sf-socials {
  flex-wrap: wrap;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
}
.sf-social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
}
.sf-social-link :deep(svg) {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  fill: currentColor;
}
.sf-contact-sales {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}
.sf-link {
  color: var(--color-ink);
  font-size: 0.9375rem;
  line-height: 1.4375rem;
  text-decoration: none;
  transition: color 0.15s ease;
}
.sf-link:hover {
  color: var(--color-accent);
}
.sf-nav-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2.5rem;
  row-gap: 2.25rem;
}
.sf-group {
  display: flex;
  width: 9.375rem;
  max-width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 0.75rem;
}
.sf-group .sf-group-title {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--color-ink-muted);
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1.5;
  text-transform: uppercase;
}
.sf-group ul {
  margin-top: 3px;
  flex-direction: column;
  gap: 0.75rem;
}
.sf-bottom {
  display: flex;
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-line);
  flex-direction: column;
  gap: 1rem;
  color: var(--color-ink-muted);
  font-size: 0.90625rem;
  line-height: 1.375rem;
}
.sf-bottom p {
  margin: 0;
}
.sf-legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.sf-legal a {
  color: var(--color-ink-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}
.sf-legal a:hover {
  color: var(--color-accent);
}
.sf-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
}
.sf-status-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-ink);
  text-decoration: none;
}
.sf-status-link:hover {
  color: var(--color-accent);
}
.sf-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 0;
  background: var(--color-positive);
}
.sf-theme {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
.sf-theme-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-ink-muted);
  font: inherit;
  cursor: pointer;
  transition: color 0.15s ease;
}
.sf-theme-option:hover,
.sf-theme-option.is-active {
  color: var(--color-ink);
}
.sf-theme-option:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.sf-theme-marker {
  width: 7px;
  height: 7px;
  background: var(--color-line);
  transition: background-color 0.15s ease;
}
.sf-theme-option.is-active .sf-theme-marker {
  background: var(--color-accent);
}

@media (min-width: 640px) {
  .sf-nav-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .sf-bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
@media (min-width: 768px) {
  .sf-container {
    padding-top: 4rem;
  }
  .sf-nav-grid {
    column-gap: 4rem;
  }
}
@media (min-width: 1024px) {
  .sf-main {
    grid-template-columns: 1fr auto;
    gap: 4rem;
  }
  .sf-nav {
    justify-self: end;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sf-link,
  .sf-theme-option,
  .sf-theme-marker {
    transition: none;
  }
}
</style>
