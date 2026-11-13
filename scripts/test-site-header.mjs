import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const header = await readFile(new URL('../.vitepress/theme/SiteHeader.vue', import.meta.url), 'utf8')

// VitePress intercepts same-origin anchors unless they declare a target. In
// production, www.sandbase.ai/docs and the main site share an origin, so every
// main-site link must explicitly opt into a full-page navigation.
const mainSiteAnchors = [...header.matchAll(/<a\b[^>]*:href="(?:SITE|`\$\{SITE\}\/[^`]+`|item\.href|card\.href|link\.href|loginHref|consoleHref)"[^>]*>/g)]
assert.ok(mainSiteAnchors.length > 10, 'expected to find the desktop and mobile main-site links')
for (const [anchor] of mainSiteAnchors) {
  assert.match(anchor, /\btarget="_self"/, `main-site link must use hard navigation: ${anchor}`)
}

// The menu mirrors sandbase-fe site-header.tsx: Models ▾ / APIs / Skills /
// Agents / Docs / Pricing / Resources ▾. Update both sites together.
const desktopNav = header.match(/<nav class="sh-desktop-nav"[\s\S]*?<\/nav>/)?.[0] ?? ''
const order = ['>Models<', "label: 'APIs'", "label: 'Skills'", "label: 'Agents'", '>Docs<', '>Pricing<', 'Resources']
let cursor = -1
for (const marker of order) {
  const source = marker.startsWith('label:') ? header : desktopNav
  const at = source.indexOf(marker)
  assert.ok(at >= 0, `header is missing ${marker}`)
  if (source === desktopNav) {
    assert.ok(at > cursor, `${marker} is out of order in the desktop navigation`)
    cursor = at
  }
}
for (const stale of ['>Store<', 'Build\n', 'Sign in']) {
  assert.ok(!desktopNav.includes(stale), `stale main-site navigation item: ${stale.trim()}`)
}
for (const label of ['Use in AI Tools', 'Open source', 'Influence', "label: 'Lab'"]) {
  assert.ok(header.includes(label), `Resources menu is missing ${label}`)
}

assert.match(header, /localStorage\.getItem\('token'\)/, 'header should read the shared dashboard session')
assert.match(header, /v-if="loggedIn"[^>]*[\s\S]*?>Console<\/a>/, 'authenticated users should see Console')
assert.match(header, /window\.addEventListener\('storage', syncAuthState\)/, 'header should follow session changes from other tabs')
assert.match(header, /window\.addEventListener\('focus', syncAuthState\)/, 'header should refresh session state when users return')

console.log('Site header navigation and auth bridge: ok')
