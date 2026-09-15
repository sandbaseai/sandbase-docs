import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './HomePage.vue'
import ApiReferencePage from './ApiReferencePage.vue'
import ContactFooter from './ContactFooter.vue'
import QuickstartOnboard from './QuickstartOnboard.vue'
import QuickstartResources from './QuickstartResources.vue'
import PlatformApiSidebar from './PlatformApiSidebar.vue'
import OfficialNativeApiSidebar from './OfficialNativeApiSidebar.vue'
import PlatformApiLanding from './PlatformApiLanding.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-after': () => [h(PlatformApiSidebar), h(OfficialNativeApiSidebar)],
      'doc-after': () => h(ContactFooter),
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
