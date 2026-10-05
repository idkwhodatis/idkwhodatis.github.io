<script setup>
import { ref, watch } from 'vue'
import { ArrowUpRight, Code2, Expand, Gamepad2, Music2, Play } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const props = defineProps({ project: { type: Object, required: true } })
const failed = ref(false)
const open = ref(false)
watch(() => props.project.name, () => { failed.value = false; open.value = false })
const icons = { software: Code2, game: Gamepad2, music: Music2 }
const base = import.meta.env.BASE_URL
</script>

<template>
  <article class="project-card" data-testid="project-card" :data-category="project.category" :style="{ '--project-color': project.color }">
    <Card class="project-surface">
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <button type="button" class="card-preview" :aria-label="`Preview ${project.name}`">
            <img v-if="project.image && !failed" :src="base + project.image" :alt="`${project.name} screenshot`" loading="lazy" decoding="async" width="640" height="400" @error="failed = true" />
            <div v-else class="preview-art" aria-hidden="true">
              <div class="preview-orbit orbit-one"></div><div class="preview-orbit orbit-two"></div>
              <component :is="icons[project.category]" class="preview-icon" :size="36" :stroke-width="1" />
              <span class="preview-art-label">{{ project.category === 'music' ? 'Press play. Tune in.' : 'An idea, made real.' }}</span>
            </div>
            <span class="preview-action"><Play v-if="project.category === 'music'" :size="15" aria-hidden="true" /><Expand v-else :size="15" aria-hidden="true" /><span>{{ project.category === 'music' ? 'Listen' : 'Preview' }}</span></span>
          </button>
        </DialogTrigger>
        <DialogContent class="project-dialog">
          <div class="dialog-heading"><DialogTitle>{{ project.name }}</DialogTitle><DialogDescription>{{ project.description }}</DialogDescription></div>
          <iframe v-if="open && project.embed" class="music-player" :src="project.embed" :title="`${project.name} music player`" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <img v-else-if="project.image && !failed" class="full-preview" :src="base + project.image" :alt="`${project.name} full-size preview`" @error="failed = true" />
          <div v-else class="missing-preview"><component :is="icons[project.category]" :size="40" :stroke-width="1" aria-hidden="true" /><p>No preview available. Explore the project below.</p></div>
          <Button as-child variant="outline" class="dialog-project-link"><a :href="project.repo" target="_blank" rel="noopener noreferrer">Open project <ArrowUpRight :size="16" aria-hidden="true" /></a></Button>
        </DialogContent>
      </Dialog>
      <CardContent class="project-content">
        <div class="project-meta"><span>{{ project.categoryLabel }}</span><time :datetime="project.dateISO">{{ project.dateLabel }}</time></div>
        <div class="project-title-row"><h3>{{ project.name }}</h3><Button as-child variant="ghost" size="icon" class="project-link"><a :href="project.repo" :aria-label="`Open ${project.name}`" target="_blank" rel="noopener noreferrer"><ArrowUpRight :size="19" aria-hidden="true" /></a></Button></div>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-tags"><Badge v-for="tag in project.tags" :key="tag" variant="secondary">{{ tag }}</Badge></div>
      </CardContent>
    </Card>
  </article>
</template>
