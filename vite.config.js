import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { readCatalogue } from './scripts/catalogue.js'

const projectDirectory = fileURLToPath(new URL('./public/projects', import.meta.url))
const moduleId = '\0virtual:portfolio-projects'

// Keep the existing public JSON catalogue editable, but load it once at build time.
// No runtime request waterfall or dependency on GitHub's API to render the portfolio.
function portfolioCatalogue() {
  return {
    name: 'portfolio-catalogue',
    resolveId(id) { if (id === 'virtual:portfolio-projects') return moduleId },
    load(id) {
      if (id !== moduleId) return
      return `export default ${JSON.stringify(readCatalogue(projectDirectory))}`
    },
    configureServer(server) {
      const reload = (file) => {
        if (!file.startsWith(projectDirectory + path.sep) || !file.endsWith('.json')) return
        const module = server.moduleGraph.getModuleById(moduleId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(projectDirectory)
      server.watcher.on('change', reload).on('add', reload).on('unlink', reload)
      server.httpServer?.once('close', () => {
        server.watcher.off('change', reload).off('add', reload).off('unlink', reload)
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss(), portfolioCatalogue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { outDir: 'docs', emptyOutDir: true },
})
