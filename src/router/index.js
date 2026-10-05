import { nextTick } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  // Hash routes work on GitHub Pages, including refreshes and subdirectory previews.
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'idkwhodatis — Curiosity, made tangible.' } },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'About — idkwhodatis' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Page not found — idkwhodatis' } },
  ],
  async scrollBehavior(to, from, savedPosition) {
    await nextTick()
    if (savedPosition) return savedPosition
    if (to.hash === '#projects') {
      return { el: '#projects', top: 104, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }
    }
    return { top: 0 }
  },
})

router.afterEach(async (to, from) => {
  document.title = to.meta.title
  if (from.matched.length && to.path !== from.path) {
    await nextTick()
    requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
  }
})
export default router
