<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowUpRight, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const route = useRoute()
const open = ref(false)
const base = import.meta.env.BASE_URL
const links = [
  { label: 'Home', to: '/', active: () => route.path === '/' && !route.hash },
  { label: 'Projects', to: { path: '/', hash: '#projects' }, active: () => route.path === '/' && route.hash === '#projects' },
  { label: 'About', to: '/about', active: () => route.path === '/about' },
]
const legacyVersions = [
  { label: 'Classic', href: `${base}classic/`, title: 'Previous Vue + Quasar version (classic branch)' },
  { label: 'Legacy', href: `${base}legacy/`, title: 'Original 2020 CV version (legacy branch)' },
]
</script>

<template>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink class="wordmark" to="/" aria-label="idkwhodatis home">idkwhodatis<span>.</span></RouterLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink v-for="link in links" :key="link.label" :to="link.to" :class="{ current: link.active() }" :aria-current="link.active() ? 'page' : undefined">{{ link.label }}</RouterLink>
        <span class="nav-divider" aria-hidden="true"></span>
        <div class="nav-legacy" role="group" aria-label="Legacy versions">
          <span class="nav-group-label" aria-hidden="true">Archive</span>
          <a v-for="version in legacyVersions" :key="version.label" :href="version.href" :title="version.title" target="_blank" rel="noopener noreferrer">{{ version.label }} <ArrowUpRight :size="14" aria-hidden="true" /></a>
        </div>
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
            <div class="mobile-nav-section" role="group" aria-label="Legacy versions">
              <p class="eyebrow mobile-nav-heading">Legacy versions</p>
              <a v-for="version in legacyVersions" :key="version.label" :href="version.href" target="_blank" rel="noopener noreferrer" @click="open = false">{{ version.label }} <ArrowUpRight :size="18" aria-hidden="true" /></a>
            </div>
            <a href="https://github.com/idkwhodatis/idkwhodatis.github.io" target="_blank" rel="noopener noreferrer" @click="open = false">Source <ArrowUpRight :size="18" aria-hidden="true" /></a>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  </header>
</template>
