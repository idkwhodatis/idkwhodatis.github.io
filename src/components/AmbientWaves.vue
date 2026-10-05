<script setup>
import { onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { ribbonPath, springStep, waveShapes } from '@/lib/waves'

const props = defineProps({ scene: { type: Number, default: 0 }, color: String, animate: Boolean, reducedMotion: Boolean })
const id = useId().replace(/:/g, '')
const svg = ref(null)
let positions = waveShapes[0].map(row => [...row])
let velocities = positions.map(row => row.map(() => 0))
let frame = 0, previous = 0, flowTime = 0
let paths = []
function paint() {
  paths.forEach((path, index) => {
    const ribbon = Math.floor(index / 4), strand = index % 4 - 1
    path.setAttribute('d', ribbonPath(positions[ribbon], flowTime, ribbon, strand))
  })
}
function restart() {
  cancelAnimationFrame(frame)
  if (!svg.value) return
  const target = waveShapes[props.scene]
  if (props.reducedMotion || !props.animate) {
    positions = target.map(row => [...row])
    velocities = positions.map(row => row.map(() => 0))
    paint()
    return
  }
  previous = performance.now()
  function tick(now) {
    frame = requestAnimationFrame(tick)
    // 30fps is enough for this very slow ambient effect; avoid reactive frame updates.
    if (now - previous < 1000 / 30) return
    const seconds = Math.min((now - previous) / 1000, 0.08)
    previous = now
    flowTime += seconds
    positions.forEach((row, ribbon) => row.forEach((value, point) => {
      const step = springStep(value, velocities[ribbon][point], target[ribbon][point], seconds)
      positions[ribbon][point] = step[0]
      velocities[ribbon][point] = step[1]
    }))
    paint()
  }
  frame = requestAnimationFrame(tick)
}
watch(() => [props.scene, props.animate, props.reducedMotion], restart)
onMounted(() => { paths = [...svg.value.querySelectorAll('[data-ribbon]')]; restart() })
onUnmounted(() => cancelAnimationFrame(frame))
</script>

<template>
  <div class="ambient-waves" aria-hidden="true">
    <svg ref="svg" viewBox="0 0 1440 700" preserveAspectRatio="none" :style="{ color }">
      <defs>
        <linearGradient :id="`${id}-ribbon`" x1="0" y1="0" x2="0" y2="1"><stop stop-color="currentColor" stop-opacity=".01" /><stop offset=".45" stop-color="currentColor" stop-opacity=".075" /><stop offset="1" stop-color="currentColor" stop-opacity=".008" /></linearGradient>
      </defs>
      <g :fill="`url(#${id}-ribbon)`">
        <template v-for="(row, ribbon) in waveShapes[0]" :key="ribbon">
          <path v-for="strand in 4" :key="strand" data-ribbon :d="ribbonPath(row, 0, ribbon, strand - 2)" :opacity="strand === 1 ? .8 : .4" />
        </template>
      </g>
    </svg>
  </div>
</template>
