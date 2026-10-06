import './assets/main.css'
import './assets/refinements.css'
import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
// Retain the existing site's analytics ID without tracking local development/tests.
if (import.meta.env.PROD && window.location.hostname === 'idkwhodatis.github.io') {
  app.use(VueGtag, { config: { id: 'G-0R69SN07PF' } }, router)
}
app.mount('#app')
