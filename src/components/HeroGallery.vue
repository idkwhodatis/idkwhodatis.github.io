<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowDownRight, Pause, Play } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useMotion } from '@/composables/useMotion'
import AmbientWaves from '@/components/AmbientWaves.vue'
import SceneArt from '@/components/SceneArt.vue'

const emit = defineEmits(['select-category'])
const scenes = [
  { name: 'Everything', category: 'all', label: 'One curiosity. Many directions.', line: ['Curiosity,', 'made tangible.'], description: 'Software, games, and music. A collection of things I’ve made along the way.', color: '#b8b5ae' },
  { name: 'Software', category: 'software', label: 'A problem. A possibility.', line: ['Small ideas.', 'Useful things.'], description: 'Tools, applications, and experiments. Finding a better way to do the everyday.', color: '#99b4cc' },
  { name: 'Games', category: 'game', label: 'A little room to play.', line: ['Make a world.', 'Get lost in it.'], description: 'Mechanics, stories, and playful experiments. Made for the joy of figuring things out.', color: '#a6b8a5' },
  { name: 'Music', category: 'music', label: 'A different kind of making.', line: ['Less thinking.', 'More feeling.'], description: 'Original tracks and remixes. Another way to turn an idea into something real.', color: '#c49aa6' },
]
const active = ref(0)
const paused = ref(false)
const hovered = ref(false)
const focused = ref(false)
const inView = ref(true)
const root = ref(null)
const { reducedMotion, pageVisible } = useMotion()
const current = computed(() => scenes[active.value])
const playing = computed(() => !paused.value && !reducedMotion.value && pageVisible.value && inView.value)
const rotating = computed(() => playing.value && !hovered.value && !focused.value)
let timer, observer
watch([rotating, active], () => {
  clearTimeout(timer)
  if (rotating.value) timer = window.setTimeout(() => { active.value = (active.value + 1) % scenes.length }, 6500)
})
function select(index) { active.value = index; paused.value = true }
function focusOut(event) { if (!event.currentTarget.contains(event.relatedTarget)) focused.value = false }
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { inView.value = entry.isIntersecting }, { threshold: 0.05 })
  observer.observe(root.value)
})
onUnmounted(() => { clearTimeout(timer); observer?.disconnect() })
</script>

<template>
  <section ref="root" class="hero" aria-label="Introduction" @mouseenter="hovered = true" @mouseleave="hovered = false" @focusin="focused = true" @focusout="focusOut" :style="{ '--scene-color': current.color }">
    <div class="hero-overline"><span class="eyebrow">A personal collection</span><span class="eyebrow">Software / Games / Music</span></div>
    <div class="hero-stage">
      <AmbientWaves :color="current.color" :scene="active" :animate="playing" :reduced-motion="reducedMotion" />
      <Transition name="poster" mode="out-in">
        <div :key="active" class="hero-poster" :aria-live="rotating ? 'off' : 'polite'" aria-atomic="true">
          <div class="hero-art"><SceneArt :scene="active" /></div>
          <div class="hero-copy">
            <p class="eyebrow scene-label">{{ current.label }}</p>
            <h1><span>{{ current.line[0] }}</span><span>{{ current.line[1] }}</span></h1>
            <p class="hero-description">{{ current.description }}</p>
            <Button as-child variant="outline" class="hero-cta">
              <RouterLink :to="{ path: '/', hash: '#projects' }" @click="emit('select-category', current.category)">Explore the work <ArrowDownRight :size="16" aria-hidden="true" /></RouterLink>
            </Button>
          </div>
        </div>
      </Transition>
    </div>
    <div class="hero-bottom">
      <div class="scene-selector" role="group" aria-label="Choose an introduction">
        <button v-for="(scene, index) in scenes" :key="scene.name" type="button" class="scene-choice" :aria-pressed="active === index" :style="{ '--choice-color': scene.color }" @click="select(index)"><span class="scene-indicator" aria-hidden="true"></span>{{ scene.name }}</button>
      </div>
      <div class="motion-controls">
        <span class="scene-number" aria-hidden="true">0{{ active + 1 }} <span>/ 04</span></span>
        <Button v-if="!reducedMotion" variant="ghost" size="icon" :aria-label="paused ? 'Play motion' : 'Pause motion'" @click="paused = !paused"><Play v-if="paused" :size="14" aria-hidden="true" /><Pause v-else :size="14" aria-hidden="true" /></Button>
        <span v-else class="reduced-motion-note">Motion off</span>
      </div>
    </div>
  </section>
</template>
