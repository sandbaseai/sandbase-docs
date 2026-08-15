<script setup lang="ts">
type SocialLink = {
  href: string
  label: string
  icon: 'github' | 'discord' | 'x' | 'linkedin'
}

type FooterColumn = {
  title: string
  links: Array<{
    href: string
    label: string
  }>
}

const socialLinks: SocialLink[] = [
  { href: 'https://github.com/sandbaseai', label: 'GitHub', icon: 'github' },
  { href: 'https://discord.com/invite/4hXv2f5Q9f', label: 'Discord', icon: 'discord' },
  { href: 'https://x.com/SandbaseAI', label: 'X', icon: 'x' },
  { href: 'https://www.linkedin.com/company/sandbaseai/', label: 'LinkedIn', icon: 'linkedin' },
]

const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { href: '/docs/store/', label: 'Store' },
      { href: '/docs/models/', label: 'Models' },
      { href: '/docs/model-api-reference/', label: 'Model API Reference' },
      { href: '/docs/api-reference/', label: 'Platform API' },
      { href: 'https://www.sandbase.ai/console', label: 'Console' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/docs/', label: 'Docs' },
      { href: '/docs/getting-started/quickstart', label: 'Quickstart' },
      { href: '/docs/getting-started/first-call', label: 'First API call' },
      { href: 'https://www.sandbase.ai/blog', label: 'Blog' },
      { href: 'https://status.sandbase.ai', label: 'Status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: 'https://www.sandbase.ai/about', label: 'About' },
      { href: 'https://www.sandbase.ai/pricing', label: 'Pricing' },
      { href: 'https://www.sandbase.ai/contact', label: 'Contact' },
      { href: 'https://github.com/sandbaseai', label: 'GitHub' },
      { href: 'https://x.com/SandbaseAI', label: 'X' },
    ],
  },
  {
    title: 'Help and security',
    links: [
      { href: 'mailto:support@sandbase.ai', label: 'Support' },
      { href: 'https://discord.com/invite/4hXv2f5Q9f', label: 'Discord' },
      { href: '/docs/api-reference/errors', label: 'Errors' },
      { href: '/docs/admin/rate-limits', label: 'Rate limits' },
      { href: 'https://www.sandbase.ai/privacy', label: 'Privacy policy' },
    ],
  },
]
</script>

<template>
  <footer class="sb-contact-footer" aria-label="SandBase footer">
    <div class="sb-contact-brand">
      <a class="sb-contact-logo" href="https://www.sandbase.ai" aria-label="SandBase home">
        <img class="sb-logo-light" src="/logo-horizontal-light.png" alt="SandBase" />
        <img class="sb-logo-dark" src="/logo-horizontal-dark.png" alt="SandBase" />
      </a>

      <div class="sb-contact-links">
        <a
          v-for="item in socialLinks"
          :key="item.href"
          class="sb-contact-link"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="item.label"
          :title="item.label"
        >
          <svg v-if="item.icon === 'github'" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            />
          </svg>

          <svg v-else-if="item.icon === 'discord'" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.08.08 0 0 0-.08.04c-.21.38-.44.86-.61 1.25a18.27 18.27 0 0 0-5.48 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.88-.89.08.08 0 0 1-.01-.13l.38-.29a.07.07 0 0 1 .07-.01 14.18 14.18 0 0 0 12.07 0 .07.07 0 0 1 .08.01l.37.29a.08.08 0 0 1-.01.13 12.3 12.3 0 0 1-1.87.89.08.08 0 0 0-.04.11c.36.7.77 1.36 1.23 1.99a.08.08 0 0 0 .08.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.04ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42Zm7.98 0c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Z"
            />
          </svg>

          <svg v-else-if="item.icon === 'x'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.9 2h3.3L15 10.2 23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.8 4H5.9l11.8 15.9Z" />
          </svg>

          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v10.75H3V9.75Zm6.25 0h3.83v1.47h.05c.53-1 1.84-1.72 3.79-1.72 4.05 0 4.8 2.66 4.8 6.13v4.87h-4v-4.32c0-1.03-.02-2.36-1.44-2.36-1.44 0-1.66 1.12-1.66 2.28v4.4h-4V9.75Z" />
          </svg>
        </a>
      </div>
    </div>

    <nav class="sb-footer-columns" aria-label="Footer navigation">
      <div v-for="column in footerColumns" :key="column.title" class="sb-footer-column">
        <h2>{{ column.title }}</h2>
        <a v-for="link in column.links" :key="link.href" :href="link.href">
          {{ link.label }}
        </a>
      </div>
    </nav>
  </footer>
</template>
