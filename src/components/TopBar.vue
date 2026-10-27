<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { ArrowRight, ArrowUpRight, ChevronDown, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const route = useRoute()
const open = ref(false)
const archiveOpen = ref(false)
const mobileArchiveOpen = ref(false)
const base = import.meta.env.BASE_URL
const links = [
  { label: 'Home', to: '/', active: () => route.path === '/' && !route.hash },
  { label: 'Projects', to: { path: '/', hash: '#projects' }, active: () => route.path === '/' && route.hash === '#projects' },
  { label: 'About', to: '/about', active: () => route.path === '/about' },
]
const legacyVersions = [
  { label: 'Classic', subtitle: 'Vue 3 + Quasar', href: `${base}classic/` },
  { label: 'Legacy', subtitle: 'Vue 2 + Vanilla CSS', href: `${base}legacy/` },
]
</script>

<template>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink class="wordmark" to="/" aria-label="idkwhodatis home">idkwhodatis<span>.</span></RouterLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink v-for="link in links" :key="link.label" :to="link.to" :class="{ current: link.active() }" :aria-current="link.active() ? 'page' : undefined">{{ link.label }}</RouterLink>
        <DropdownMenuRoot v-model:open="archiveOpen">
          <DropdownMenuTrigger as-child>
            <button type="button" class="nav-dropdown-trigger">Archive <ChevronDown :size="14" class="nav-chevron" aria-hidden="true" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent class="archive-dropdown" :side-offset="8" align="end">
              <DropdownMenuItem v-for="version in legacyVersions" :key="version.label" as-child>
                <a :href="version.href" class="archive-dropdown-item">
                  <span>{{ version.label }}<small>{{ version.subtitle }}</small></span>
                  <ArrowRight :size="14" aria-hidden="true" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
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
            <div class="mobile-archive-group">
              <button type="button" class="mobile-archive-trigger" :aria-expanded="mobileArchiveOpen" @click="mobileArchiveOpen = !mobileArchiveOpen">
                Archive <ChevronDown :size="18" class="nav-chevron" :class="{ 'is-open': mobileArchiveOpen }" aria-hidden="true" />
              </button>
              <div v-show="mobileArchiveOpen" class="mobile-archive-list">
                <a v-for="version in legacyVersions" :key="version.label" :href="version.href" @click="open = false">{{ version.label }} <ArrowRight :size="16" aria-hidden="true" /></a>
              </div>
            </div>
            <a href="https://github.com/idkwhodatis/idkwhodatis.github.io" target="_blank" rel="noopener noreferrer" @click="open = false">Source <ArrowUpRight :size="18" aria-hidden="true" /></a>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  </header>
</template>
