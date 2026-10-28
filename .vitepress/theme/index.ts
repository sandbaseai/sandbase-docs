import DefaultTheme from 'vitepress/theme'
import { h, defineAsyncComponent } from 'vue'
import HomePage from './HomePage.vue'
import ApiReferencePage from './ApiReferencePage.vue'
import QuickstartOnboard from './QuickstartOnboard.vue'
import QuickstartResources from './QuickstartResources.vue'
import PlatformApiSidebar from './PlatformApiSidebar.vue'
import OfficialNativeApiSidebar from './OfficialNativeApiSidebar.vue'
import PlatformApiLanding from './PlatformApiLanding.vue'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import DocsSearch from './DocsSearch.vue'
import DocsSectionTabs from './DocsSectionTabs.vue'
import TutorialCopyAction from './TutorialCopyAction.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Replace VitePress's default top nav with a 1:1 replica of the
      // sandbase.ai site header, and render the site footer full-width at the
      // bottom. The default nav is hidden via custom.css but stays mounted so
      // its search hotkey and mobile sidebar plumbing keep working.
      // The docs sidebar leads with a "Search docs" button (matching the
      // reference design) that triggers VitePress's local search.
      'sidebar-nav-before': () => [h(DocsSearch), h(DocsSectionTabs)],
      'sidebar-nav-after': () => [h(PlatformApiSidebar), h(OfficialNativeApiSidebar)],
      'layout-top': () => h(SiteHeader),
      'doc-before': () => h(TutorialCopyAction),
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('SandboxPlayground', defineAsyncComponent(() => import('./SandboxPlayground.vue')))
    app.component('HomePage', HomePage)
    app.component('ApiReferencePage', ApiReferencePage)
    app.component('PlatformApiLanding', PlatformApiLanding)
    app.component('QuickstartOnboard', QuickstartOnboard)
    app.component('QuickstartResources', QuickstartResources)

    // Sync theme with the main site. sandbase-fe stores 'system' | 'light' | 'dark'
    // under localStorage 'theme' (src/theme/theme.ts); 'system' or no value follows the OS.
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('theme')
        const preference = stored === 'light' || stored === 'dark' ? stored : 'system'
        const dark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.classList.toggle('dark', dark)
        // Keep VitePress's pre-paint script in agreement on the next load.
        localStorage.setItem('vitepress-theme-appearance', preference === 'system' ? 'auto' : preference)
      } catch {
        /* privacy mode */
      }
    }
  }
}
