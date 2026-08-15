import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePage from './HomePage.vue'
import ApiReferencePage from './ApiReferencePage.vue'
import ContactFooter from './ContactFooter.vue'
import PlatformApiSidebar from './PlatformApiSidebar.vue'
import PlatformApiLanding from './PlatformApiLanding.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-after': () => h(PlatformApiSidebar),
      'doc-footer-after': () => h(ContactFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ApiReferencePage', ApiReferencePage)
    app.component('PlatformApiLanding', PlatformApiLanding)

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
