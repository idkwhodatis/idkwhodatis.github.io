import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import {Quasar} from 'quasar'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import 'quasar/src/css/index.sass'

import VueGtag from 'vue-gtag';

const app=createApp(App)

app.config.globalProperties.offset=60

app.use(router)

app.use(Quasar,{
    plugins:{},// import Quasar plugins and add here
    /*
    config: {
      brand: {
        // primary: '#e46262',
        // ... or all other brand colors
      },
      notify: {...}, // default set of options for Notify Quasar plugin
      loading: {...}, // default set of options for Loading Quasar plugin
      loadingBar: { ... }, // settings for LoadingBar Quasar plugin
      // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
    */
  }
)

app.use(VueGtag,{
  config:{id:'G-0R69SN07PF'}
})

app.mount('#app')
