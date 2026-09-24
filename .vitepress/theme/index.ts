import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './HomePage.vue'
import ApiReferencePage from './ApiReferencePage.vue'
import QuickstartOnboard from './QuickstartOnboard.vue'
import QuickstartResources from './QuickstartResources.vue'
import PlatformApiSidebar from './PlatformApiSidebar.vue'
import OfficialNativeApiSidebar from './OfficialNativeApiSidebar.vue'
import PlatformApiLanding from './PlatformApiLanding.vue'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Replace VitePress's default top nav with a 1:1 replica of the
      // sandbase.ai site header, and render the site footer full-width at the
      // bottom. The default nav is hidden via custom.css but stays mounted so
      // its search hotkey and mobile sidebar plumbing keep working.
      'sidebar-nav-after': () => [h(PlatformApiSidebar), h(OfficialNativeApiSidebar)],
      'layout-top': () => h(SiteHeader),
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ApiReferencePage', ApiReferencePage)
    app.component('PlatformApiLanding', PlatformApiLanding)
    app.component('QuickstartOnboard', QuickstartOnboard)
    app.component('QuickstartResources', QuickstartResources)

    // Sync theme with main site: read localStorage 'theme' key set by SandBase-dashboard
    if (typeof window !== 'undefined') {
      const siteTheme = localStorage.getItem('theme')
      if (siteTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
}
