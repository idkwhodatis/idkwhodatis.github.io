<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowUpRight, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const route = useRoute()
const open = ref(false)
const links = [
  { label: 'Home', to: '/', active: () => route.path === '/' && !route.hash },
  { label: 'Projects', to: { path: '/', hash: '#projects' }, active: () => route.path === '/' && route.hash === '#projects' },
  { label: 'About', to: '/about', active: () => route.path === '/about' },
]
</script>

<template>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink class="wordmark" to="/" aria-label="idkwhodatis home">idkwhodatis<span>.</span></RouterLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink v-for="link in links" :key="link.label" :to="link.to" :class="{ current: link.active() }" :aria-current="link.active() ? 'page' : undefined">{{ link.label }}</RouterLink>
        <span class="nav-divider" aria-hidden="true"></span>
        <a href="https://github.com/idkwhodatis/idkwhodatis.github.io" target="_blank" rel="noopener noreferrer">Source <ArrowUpRight :size="14" aria-hidden="true" /></a>
      </nav>
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button class="mobile-menu-button" variant="ghost" size="icon" aria-label="Open navigation"><Menu :size="20" aria-hidden="true" /></Button>
        </DialogTrigger>
        <DialogContent class="navigation-dialog">
          <DialogTitle>Navigation</DialogTitle>
          <DialogDescription class="sr-only">Explore the portfolio.</DialogDescription>
          <nav class="mobile-nav" aria-label="Mobile navigation">
            <RouterLink v-for="link in links" :key="link.label" :to="link.to" @click="open = false">{{ link.label }} <ArrowUpRight :size="18" aria-hidden="true" /></RouterLink>
            <a href="https://github.com/idkwhodatis/idkwhodatis.github.io" target="_blank" rel="noopener noreferrer" @click="open = false">Source <ArrowUpRight :size="18" aria-hidden="true" /></a>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  </header>
</template>
