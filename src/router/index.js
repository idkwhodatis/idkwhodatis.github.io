import { nextTick } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { waitForHeroLayout } from '@/lib/heroReveal'

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
    await waitForHeroLayout(document.querySelector('[data-hero-state]'))
    // Another navigation can finish while a reveal animation is in flight.
    if (router.currentRoute.value.fullPath !== to.fullPath) return false
    if (savedPosition) return savedPosition
    if (to.hash === '#projects') {
      const top = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 88) + 24
      return { el: '#projects', top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }
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
