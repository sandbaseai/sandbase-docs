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

    if (typeof window !== 'undefined') {
      // Default landing page is the Official Native API reference. Redirect the
      // docs root (and its /docs/index alias) there before the homepage renders.
      const landing = '/docs/model-api-reference/official-native-api/'
      const path = window.location.pathname
      if (path === '/docs' || path === '/docs/' || path === '/docs/index' || path === '/') {
        window.location.replace(landing)
        return
      }
    }

    // Sync theme with main site: read localStorage 'theme' key set by AGRouter-dashboard
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
