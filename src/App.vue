<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ArrowUpRight } from 'lucide-vue-next'
import TopBar from '@/components/TopBar.vue'
function skipToContent() {
  const main = document.getElementById('main-content')
  main?.focus({ preventScroll: true })
  main?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <a class="skip-link" href="#main-content" @click.prevent="skipToContent">Skip to content</a>
  <div class="site-shell">
    <TopBar />
    <RouterView />
    <footer class="site-footer shell">
      <RouterLink class="wordmark" to="/">idkwhodatis<span>.</span></RouterLink>
      <p>A work in progress. Always.</p>
      <a href="https://github.com/idkwhodatis" target="_blank" rel="noopener noreferrer">Find me on GitHub <ArrowUpRight :size="14" aria-hidden="true" /></a>
    </footer>
  </div>
</template>
