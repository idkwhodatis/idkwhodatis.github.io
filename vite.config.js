import {fileURLToPath,URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar,transformAssetUrls} from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins:[
    vue({
      template:{transformAssetUrls}
    }),
    quasar({
      sassVariables: 'src/assets/quasar-variables.sass'
    })
  ],
  resolve:{
    alias:{
      '@':fileURLToPath(new URL('./src',import.meta.url))
    }
  }
})
