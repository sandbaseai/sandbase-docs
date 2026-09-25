import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const header = await readFile(new URL('../.vitepress/theme/SiteHeader.vue', import.meta.url), 'utf8')

// VitePress intercepts same-origin anchors unless they declare a target. In
// production, www.sandbase.ai/docs and the main site share an origin, so every
// main-site link must explicitly opt into a full-page navigation.
const mainSiteAnchors = [...header.matchAll(/<a\b[^>]*:href="(?:SITE|`\$\{SITE\}\/[^`]+`|item\.href|loginHref|consoleHref)"[^>]*>/g)]
assert.ok(mainSiteAnchors.length > 10, 'expected to find the desktop and mobile main-site links')
for (const [anchor] of mainSiteAnchors) {
  assert.match(anchor, /\btarget="_self"/, `main-site link must use hard navigation: ${anchor}`)
}

assert.match(header, /localStorage\.getItem\('token'\)/, 'header should read the shared dashboard session')
assert.match(header, /v-if="loggedIn"[^>]*[\s\S]*?>Console<\/a>/, 'authenticated users should see Console')
assert.match(header, /window\.addEventListener\('storage', syncAuthState\)/, 'header should follow session changes from other tabs')
assert.match(header, /window\.addEventListener\('focus', syncAuthState\)/, 'header should refresh session state when users return')

console.log('Site header navigation and auth bridge: ok')
