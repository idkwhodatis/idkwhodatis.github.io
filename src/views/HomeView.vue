<script setup>
import { computed, ref } from 'vue'
import { Search, SearchX, X } from 'lucide-vue-next'
import projects from 'virtual:portfolio-projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { categories, filterProjects } from '@/lib/projects'
import HeroGallery from '@/components/HeroGallery.vue'
import Project from '@/components/Project.vue'

const category = ref('all')
const query = ref('')
const filtered = computed(() => filterProjects(projects, category.value, query.value))
function selectCategory(value) { category.value = value; query.value = '' }
function resetFilters() { selectCategory('all') }
</script>

<template>
  <main id="main-content" class="shell" tabindex="-1">
    <HeroGallery @select-category="selectCategory" />
    <section id="projects" class="projects-section" aria-labelledby="projects-heading">
      <div class="section-heading"><div><p class="eyebrow">The things I've made</p><h2 id="projects-heading">A few different directions<span>.</span></h2></div><span class="collection-count">{{ String(projects.length).padStart(2, '0') }} / Collected works</span></div>
      <Tabs v-model="category" class="project-tabs">
        <div class="project-toolbar">
          <TabsList aria-label="Filter projects" class="filter-tabs"><TabsTrigger v-for="item in categories" :key="item.value" :value="item.value">{{ item.label }}<span class="filter-count">{{ item.value === 'all' ? projects.length : projects.filter(project => project.category === item.value).length }}</span></TabsTrigger></TabsList>
          <div class="project-search"><label for="project-search" class="sr-only">Search projects</label><Search :size="16" aria-hidden="true" /><Input id="project-search" v-model="query" placeholder="Find something…" autocomplete="off" /><Button v-if="query" variant="ghost" size="icon" class="clear-search" aria-label="Clear search" @click="query = ''"><X :size="14" aria-hidden="true" /></Button></div>
        </div>
        <p class="results-summary" role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'project' : 'projects' }}<span aria-hidden="true"> · </span><span>Newest first</span></p>
        <TabsContent v-for="item in categories" :key="item.value" :value="item.value" class="project-panel">
          <div v-if="filtered.length" class="project-grid"><Project v-for="project in filtered" :key="project.name" :project="project" /></div>
          <div v-else class="empty-state"><SearchX :size="28" :stroke-width="1.4" aria-hidden="true" /><h3>No matching projects</h3><p>Try another word, a technology, or a different category.</p><Button variant="outline" @click="resetFilters">Reset filters</Button></div>
        </TabsContent>
      </Tabs>
    </section>
  </main>
</template>
