<script setup lang="ts">
/**
 * "Search docs" button at the top of the sidebar, matching the sandbase /docs
 * reference design. VitePress's local-search hotkey listener stays mounted
 * (the default nav is only hidden, not removed), so dispatching Cmd/Ctrl+K
 * opens the built-in local search modal.
 */
function openSearch() {
  const fire = (target: Window | Document) =>
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
  fire(window)
  fire(document)
}
</script>

<template>
  <button type="button" class="docs-search" aria-label="Search docs" aria-keyshortcuts="Meta+K Control+K" @click="openSearch">
    <svg class="docs-search-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span class="docs-search-label">Search docs</span>
    <kbd class="docs-search-kbd">⌘K</kbd>
  </button>
</template>

<style scoped>
.docs-search {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 8px;
  background: var(--color-surface-alt);
  color: var(--color-ink-subtle);
  font-family: var(--font-family-body);
  font-size: 0.9375rem;
  line-height: 1.4375rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}
.docs-search:hover {
  background: color-mix(in srgb, var(--color-surface-alt) 82%, var(--color-ink));
  color: var(--color-ink);
}
.docs-search:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.docs-search-icon {
  flex: none;
}
.docs-search-label {
  flex: 1 1 auto;
}
.docs-search-kbd {
  margin-left: auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-ink-subtle);
  font-family: var(--font-family-mono);
  font-size: 0.625rem;
  line-height: 1;
}
</style>
