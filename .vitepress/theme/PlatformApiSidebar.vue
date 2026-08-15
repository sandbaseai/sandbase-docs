<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { platformApiReferencePlatforms } from '../modelApiReferenceSidebar.generated'

interface PlatformOperation {
  readonly text: string
  readonly link: string
}

interface PlatformDomain {
  readonly key: string
  readonly label: string
  readonly operations: readonly PlatformOperation[]
}

interface PlatformSidebarData {
  readonly platform: string
  readonly slug: string
  readonly operationCount: number
  readonly groups: readonly PlatformDomain[]
}

type PlatformSidebarModule = { default: PlatformSidebarData }

const route = useRoute()
const modules = import.meta.glob<PlatformSidebarModule>('./platform-api-sidebars/*.ts')
const data = ref<PlatformSidebarData>()
const isCategoryExpanded = ref(false)
const expandedPlatform = ref('')
const expandedDomains = ref<ReadonlySet<string>>(new Set())
const loadingPlatform = ref('')
const isModelApiReferenceRoute = computed(() => /\/model-api-reference(?:\/|$)/.test(route.path))
let loadSequence = 0

function isPlatformApiRoute(routePath: string) {
  return /\/model-api-reference\/platform-apis(?:\/|$)/.test(routePath)
}

function routePlatform(routePath: string) {
  return routePath.match(/\/model-api-reference\/platform-apis\/([^/]+)\//)?.[1] ?? ''
}

function isActive(link: string) {
  return route.path.replace(/\/$/, '').endsWith(link)
}

function activeDomain(sidebarData: PlatformSidebarData) {
  return sidebarData.groups.find((group) => group.operations.some((operation) => isActive(operation.link)))?.key
}

function platformPanelId(slug: string) {
  return `platform-api-panel-${slug}`
}

function domainPanelId(platformSlug: string, domainKey: string) {
  return `platform-api-domain-${platformSlug}-${domainKey}`
}

async function openPlatform(slug: string, fromRoute = false) {
  const sequence = ++loadSequence
  expandedPlatform.value = slug
  loadingPlatform.value = slug
  data.value = undefined
  expandedDomains.value = new Set()

  const load = modules[`./platform-api-sidebars/${slug}.ts`]
  if (!load) {
    if (sequence === loadSequence) loadingPlatform.value = ''
    return
  }
  const loaded = await load()
  if (sequence !== loadSequence || expandedPlatform.value !== slug) return

  data.value = loaded.default
  loadingPlatform.value = ''
  const routeDomain = fromRoute ? activeDomain(loaded.default) : undefined
  expandedDomains.value = new Set(routeDomain ? [routeDomain] : loaded.default.groups.map((group) => group.key))
}

function togglePlatform(slug: string) {
  if (expandedPlatform.value === slug) {
    loadSequence += 1
    expandedPlatform.value = ''
    loadingPlatform.value = ''
    data.value = undefined
    expandedDomains.value = new Set()
    return
  }
  void openPlatform(slug)
}

function toggleCategory() {
  isCategoryExpanded.value = !isCategoryExpanded.value
}

function toggleDomain(key: string) {
  const next = new Set(expandedDomains.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedDomains.value = next
}

watch(
  () => route.path,
  (routePath) => {
    if (!isPlatformApiRoute(routePath)) {
      loadSequence += 1
      expandedPlatform.value = ''
      loadingPlatform.value = ''
      data.value = undefined
      expandedDomains.value = new Set()
      return
    }

    isCategoryExpanded.value = true
    const slug = routePlatform(routePath)
    if (!slug) return
    if (data.value?.slug === slug) {
      const domain = activeDomain(data.value)
      if (domain && !expandedDomains.value.has(domain)) expandedDomains.value = new Set([...expandedDomains.value, domain])
      expandedPlatform.value = slug
      return
    }
    void openPlatform(slug, true)
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="isModelApiReferenceRoute" class="platform-api-sidebar" aria-label="APIs navigation">
    <div class="category-row">
      <a
        class="category-link"
        :class="{ active: isActive('/model-api-reference/platform-apis') }"
        :aria-current="isActive('/model-api-reference/platform-apis') ? 'page' : undefined"
        :href="withBase('/model-api-reference/platform-apis')"
      >APIs</a>
      <button
        class="category-disclosure"
        type="button"
        :aria-expanded="isCategoryExpanded"
        aria-controls="platform-api-category-panel"
        aria-label="Toggle APIs navigation"
        @click="toggleCategory"
      ><span aria-hidden="true">›</span></button>
    </div>
    <div v-if="isCategoryExpanded" id="platform-api-category-panel" class="category-panel">
      <ul class="platform-list">
        <li v-for="platform in platformApiReferencePlatforms" :key="platform.slug" class="platform-item">
          <button
            class="disclosure platform-button"
            type="button"
            :aria-expanded="expandedPlatform === platform.slug"
            :aria-controls="platformPanelId(platform.slug)"
            @click="togglePlatform(platform.slug)"
          >
            <span>{{ platform.text }}</span>
            <span class="operation-count">{{ platform.operationCount }}</span>
          </button>
          <div
            v-if="expandedPlatform === platform.slug"
            :id="platformPanelId(platform.slug)"
            class="platform-panel"
            role="region"
            :aria-label="`${platform.text} operations`"
            :aria-busy="loadingPlatform === platform.slug"
          >
            <p v-if="loadingPlatform === platform.slug" class="loading-text" role="status">Loading operations…</p>
            <ul v-else-if="data" class="domain-list">
              <li v-for="group in data.groups" :key="group.key" class="domain-item">
                <button
                  class="disclosure domain-button"
                  type="button"
                  :aria-expanded="expandedDomains.has(group.key)"
                  :aria-controls="domainPanelId(data.slug, group.key)"
                  @click="toggleDomain(group.key)"
                >
                  <span>{{ group.label }}</span>
                  <span class="operation-count">{{ group.operations.length }}</span>
                </button>
                <ul
                  v-if="expandedDomains.has(group.key)"
                  :id="domainPanelId(data.slug, group.key)"
                  class="operation-list"
                >
                  <li v-for="operation in group.operations" :key="operation.link">
                    <a
                      :class="{ active: isActive(operation.link) }"
                      :aria-current="isActive(operation.link) ? 'page' : undefined"
                      :href="withBase(operation.link)"
                    >{{ operation.text }}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.platform-api-sidebar {
  /* The VitePress slot sits after the whole Model API Reference group. Pull
     this continuation over that group's trailing padding so it reads as the
     final sibling item instead of a separate navigation section. */
  margin-top: -24px;
  padding: 0 0 7px;
}

.category-row {
  align-items: center;
  display: flex;
  min-height: 34px;
  padding-left: 14px;
}

.category-link {
  border-radius: 6px;
  color: var(--vp-c-text-2);
  flex: 1 1 auto;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  padding: 4px 6px 4px 0;
  transition: color 0.25s;
}

.category-disclosure {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  height: 30px;
  margin-right: 3px;
  padding: 0;
  width: 30px;
}

.category-disclosure span {
  display: inline-block;
  transform: rotate(0deg);
  transition: transform 0.15s ease;
}

.category-disclosure[aria-expanded='true'] span {
  transform: rotate(90deg);
}

.category-panel {
  border-left: 1px solid var(--vp-c-divider);
  margin-left: 14px;
  padding-left: 16px;
}

.platform-list,
.domain-list,
.operation-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.disclosure {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  font: inherit;
  justify-content: space-between;
  min-height: 32px;
  text-align: left;
  transition: color 0.25s;
  width: 100%;
}

.disclosure::before {
  content: '›';
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-size: 18px;
  height: 32px;
  justify-content: center;
  margin-right: -7px;
  order: 3;
  transform: rotate(0deg);
  transition: transform 0.25s;
  width: 32px;
}

.disclosure[aria-expanded='true']::before {
  transform: rotate(90deg);
}

.platform-button {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  padding: 4px 0;
}

.platform-panel {
  border-left: 1px solid var(--vp-c-divider);
  margin-left: 8px;
  padding-left: 16px;
}

.domain-button {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  padding: 4px 0;
}

.disclosure > span:first-child {
  min-width: 0;
  overflow-wrap: anywhere;
}

.operation-count {
  color: var(--vp-c-text-3);
  flex: 0 0 auto;
  font-size: 11px;
  margin-left: auto;
  order: 2;
  padding-left: 8px;
}

.operation-list {
  border-left: 1px solid var(--vp-c-divider);
  margin-left: 8px;
  padding-left: 16px;
}

.operation-list li {
  position: relative;
}

.operation-list a,
.loading-text {
  color: var(--vp-c-text-2);
  display: block;
  font-size: 14px;
  line-height: 24px;
  margin: 0;
  overflow-wrap: anywhere;
  padding: 4px 0;
  transition: color 0.25s;
}

.operation-list a.active::before {
  background-color: var(--vp-c-brand-1);
  border-radius: 2px;
  bottom: 6px;
  content: '';
  left: -17px;
  position: absolute;
  top: 6px;
  width: 2px;
}

.category-link:hover,
.category-link.active,
.category-disclosure:hover,
.operation-list a:hover,
.operation-list a.active,
.disclosure:hover {
  color: var(--vp-c-brand-1);
}

.operation-list a.active {
  font-weight: 600;
}

.category-link.active {
  background: var(--sb-sidebar-active-bg);
  color: var(--sb-sidebar-active-text);
  font-weight: 600;
}

.disclosure:focus-visible,
.category-link:focus-visible,
.category-disclosure:focus-visible,
.operation-list a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (min-width: 960px) {
  .platform-api-sidebar {
    width: calc(var(--vp-sidebar-width) - 64px);
  }
}
</style>
