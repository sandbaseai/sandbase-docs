<script setup lang="ts">
import { computed } from 'vue'
import { platformApiReferencePlatforms } from '../modelApiReferenceSidebar.generated'

const operationCount = computed(() => platformApiReferencePlatforms.reduce((total, platform) => total + platform.operationCount, 0))
</script>

<template>
  <article class="platform-api-landing" aria-labelledby="apis-title">
    <header class="landing-hero">
      <p class="eyebrow">Model API Reference</p>
      <h1 id="apis-title">APIs</h1>
      <p class="landing-summary">
        Call data, automation, search, and platform operations through SandBase using each operation's exact public request schema.
      </p>
      <dl class="landing-counts" aria-label="API catalog totals">
        <div>
          <dt>Operations</dt>
          <dd>{{ operationCount }}</dd>
        </div>
        <div>
          <dt>Platforms</dt>
          <dd>{{ platformApiReferencePlatforms.length }}</dd>
        </div>
      </dl>
    </header>

    <section class="platform-directory" aria-labelledby="platform-directory-title">
      <h2 id="platform-directory-title">Platforms</h2>
      <ul>
        <li v-for="platform in platformApiReferencePlatforms" :key="platform.slug">
          <span>{{ platform.text }}</span>
          <span>{{ platform.operationCount }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.platform-api-landing {
  color: var(--vp-c-text-1);
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.landing-hero {
  max-width: 820px;
  padding-bottom: 42px;
}

.eyebrow {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  margin: 0 0 10px;
  text-transform: uppercase;
}

h1 {
  border: 0;
  font-size: clamp(30px, 2.6vw, 38px);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.04;
  margin: 0 0 20px;
}

.landing-summary {
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.65;
  margin: 0;
  max-width: 700px;
}

.landing-counts {
  display: flex;
  gap: 36px;
  margin: 28px 0 0;
}

.landing-counts div {
  display: grid;
  gap: 2px;
}

.landing-counts dt {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.landing-counts dd {
  font-size: 24px;
  font-weight: 650;
  margin: 0;
}

.platform-directory {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 28px;
}

.platform-directory h2 {
  border: 0;
  font-size: 21px;
  margin: 0 0 18px;
  padding: 0;
}

.platform-directory ul {
  display: grid;
  gap: 8px 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.platform-directory li {
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 72%, transparent);
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  line-height: 22px;
  min-width: 0;
  padding: 6px 0;
}

.platform-directory li span:last-child {
  color: var(--vp-c-text-3);
  font-size: 12px;
  margin-left: 12px;
}

@media (max-width: 920px) {
  .platform-directory ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .landing-hero {
    padding-bottom: 28px;
  }

  .platform-directory ul {
    grid-template-columns: 1fr;
  }
}
</style>
