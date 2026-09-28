<template>
  <aside class="sandbox-promo" aria-label="Sandbox offer">
    <span class="promo-label">LIMITED OFFER</span>
    <span class="promo-message">Free for a limited time</span>
  </aside>
</template>

<style scoped>
.sandbox-promo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin: 24px 0;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.promo-label {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.08em;
}
.promo-message {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
}
</style>
