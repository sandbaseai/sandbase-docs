<template>
  <div class="resources">
    <div class="resource-grid" :class="'count-' + copy.items.length">
      <a
        v-for="item in copy.items"
        :key="item.href"
        class="resource-card"
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener noreferrer' : undefined"
      >
        <span class="resource-tag">{{ item.tag }}</span>
        <strong>{{ item.title }}</strong>
        <p>{{ item.body }}</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ locale?: 'en' | 'zh'; group?: 'all' | 'catalog' | 'ops' }>(), {
  locale: 'en',
  group: 'all',
})

const copyByLocale = {
  en: {
    items: [
      { tag: 'Models', title: 'Language models', body: 'Filter the LLM catalog by provider, capability, context, and price.', href: 'https://www.sandbase.ai/models', external: true },
      { tag: 'Multimodal', title: 'Image and video', body: 'Filter text-to-image, image-to-video, and other visual models.', href: 'https://www.sandbase.ai/models/image-video', external: true },
      { tag: 'APIs', title: 'API resources', body: 'Filter search, social, and data APIs by platform.', href: 'https://www.sandbase.ai/apis', external: true },
      { tag: 'Billing', title: 'Billing and credits', body: 'Check balance, top up, and review billing records.', href: 'https://www.sandbase.ai/console/billing', external: true },
      { tag: 'Usage', title: 'Usage analytics', body: 'See recent call volume and cost for the active organization.', href: 'https://www.sandbase.ai/console/analytics?tab=overview&range=7d&type=all', external: true },
    ],
  },
  zh: {
    items: [
      { tag: 'Models', title: '大语言模型', body: '按提供商、能力、上下文和价格筛选语言模型。', href: 'https://www.sandbase.ai/models', external: true },
      { tag: 'Multimodal', title: '图像 / 视频模型', body: '筛选文生图、图生视频等多模态模型。', href: 'https://www.sandbase.ai/models/image-video', external: true },
      { tag: 'APIs', title: 'API 资源', body: '按平台和数据源筛选可用 API。', href: 'https://www.sandbase.ai/apis', external: true },
      { tag: 'Billing', title: '账单和充值', body: '查看余额、充值和账单记录。', href: 'https://www.sandbase.ai/console/billing', external: true },
      { tag: 'Usage', title: '用量', body: '查看当前组织的近期调用量和成本。', href: 'https://www.sandbase.ai/console/analytics?tab=overview&range=7d&type=all', external: true },
    ],
  },
} as const

const allItems = copyByLocale[props.locale].items
const copy = {
  items:
    props.group === 'catalog'
      ? allItems.slice(0, 3)
      : props.group === 'ops'
        ? allItems.slice(3)
        : allItems,
}
</script>

<style scoped>
.resources {
  --qs-lime: #d9ff43;
  --qs-ink: #11110f;
  margin: 24px 0 8px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 32px;
}

.resource-grid.count-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.resource-card {
  display: grid;
  align-content: start;
  gap: 12px;
  min-height: 168px;
  padding: 24px 0 16px;
  border-top: 2px solid var(--vp-c-divider);
  border-radius: 0;
  background: transparent;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.16s;
}

.resource-card:hover {
  border-top-color: var(--qs-lime);
  background: transparent;
}

.dark .resource-card:hover {
  border-color: var(--qs-lime);
}

.resource-tag {
  width: fit-content;
  padding: 0;
  border-radius: 0;
  background: none;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.dark .resource-tag {
  background: none;
  color: var(--vp-c-text-3);
}

.resource-card strong {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.038em;
  line-height: 1.25;
}

.resource-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .resource-grid,
  .resource-grid.count-2 {
    grid-template-columns: 1fr;
    gap: 8px 0;
  }

  .resource-card {
    min-height: 0;
  }
}
</style>
