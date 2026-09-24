<script setup lang="ts">
import { useData } from 'vitepress'
import BrandMark from './BrandMark.vue'

/**
 * Faithful replica of the sandbase.ai site footer. Markup and styling mirror
 * sandbase-fe/src/components/site-footer.tsx + site-footer.module.css. Product
 * links point at the main site; "Docs" stays on this docs site. The inline
 * colour-theme switch replaces the appearance toggle that lived in the nav.
 */
const SITE = 'https://www.sandbase.ai'
const statusPageUrl = 'https://status.sandbase.ai/'
const tagline =
  'Build your Agent, give it real-world tools, and run it inside your AI app, product, or schedule.'

const footerSections = [
  {
    title: 'Store',
    links: [
      { href: `${SITE}/agents`, label: 'Agents' },
      { href: `${SITE}/models`, label: 'Models' },
      { href: `${SITE}/apis`, label: 'APIs' },
      { href: `${SITE}/skills`, label: 'Skills' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: `${SITE}/solutions`, label: 'All Solutions' },
      { href: `${SITE}/solutions/build-agent`, label: 'Build Agent' },
      { href: `${SITE}/solutions/service`, label: 'Service' },
      { href: `${SITE}/solutions/schedule`, label: 'Schedule' },
    ],
  },
  {
    title: 'Build',
    links: [
      { href: `${SITE}/console/agents`, label: 'Build Agent' },
      { href: `${SITE}/console/endpoints`, label: 'Published Agents' },
      { href: `${SITE}/console/deployments`, label: 'Schedules' },
      { href: `${SITE}/console/sessions`, label: 'Runs' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/docs/', label: 'Docs' },
      { href: `${SITE}/pricing`, label: 'Pricing' },
      { href: `${SITE}/blog/`, label: 'Blog' },
    ],
  },
]

const socialLinks = [
  { href: 'https://github.com/sandbaseai', label: 'GitHub' },
  { href: 'https://discord.com/invite/4hXv2f5Q9f', label: 'Discord' },
  { href: 'https://x.com/sandbaseai', label: 'X.com' },
  { href: 'https://www.linkedin.com/company/sandbaseai', label: 'LinkedIn' },
]

const { isDark } = useData()
function toggleTheme() {
  isDark.value = !isDark.value
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
              <a :href="item.href" target="_blank" rel="noopener noreferrer" class="sf-link">{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" class="sf-nav">
          <div class="sf-nav-grid">
            <div v-for="section in footerSections" :key="section.title" class="sf-group">
              <h2>{{ section.title }}</h2>
              <ul>
                <li v-for="item in section.links" :key="item.href">
                  <a
                    :href="item.href"
                    :target="item.href.startsWith('http') ? '_blank' : undefined"
                    :rel="item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                    class="sf-link"
                  >{{ item.label }}</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div class="sf-bottom">
        <p>© 2026 SandBase</p>
        <div class="sf-status">
          <a :href="statusPageUrl" target="_blank" rel="noopener noreferrer" aria-label="View SandBase uptime status" class="sf-status-link">
            <span aria-hidden="true" class="sf-status-dot" />
            All systems operational
          </a>
          <button type="button" class="sf-theme" :aria-pressed="isDark" @click="toggleTheme">
            <span class="sf-theme-label">Colour theme</span>
            <span class="sf-theme-value">{{ isDark ? 'Dark' : 'Light' }}</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.sf-footer {
  position: relative;
  z-index: 20;
  width: 100%;
  background: var(--color-canvas);
  color: var(--color-ink);
  line-height: 1.5rem;
  border-top: 1px solid var(--color-line);
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
.sf-group h2 {
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
  flex-direction: column;
  gap: 1rem;
  color: var(--color-ink-muted);
  font-size: 0.90625rem;
  line-height: 1.375rem;
}
.sf-bottom p {
  margin: 0;
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
  border-radius: 999px;
  background: var(--color-positive);
}
.sf-theme {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-line);
  padding: 0.375rem 0.75rem;
  background: transparent;
  color: var(--color-ink-muted);
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.sf-theme:hover {
  color: var(--color-ink);
  border-color: var(--color-ink-muted);
}
.sf-theme-value {
  color: var(--color-accent);
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

/* The docs keep a persistent fixed sidebar on the left. A full-width footer at
   the bottom of the layout would sit partly behind it, so from >=960px inset
   the footer content to clear the sidebar and align with the content column
   (mirrors the .VPContent.has-sidebar padding math in custom.css). */
@media (min-width: 960px) {
  .sf-container {
    margin-inline: 0;
    padding-left: calc(var(--vp-sidebar-width, 272px) + var(--sb-layout-gutter, 0px) + 32px);
    padding-right: max(48px, var(--sb-layout-gutter, 0px));
  }
}
@media (prefers-reduced-motion: reduce) {
  .sf-link,
  .sf-theme {
    transition: none;
  }
}
</style>
