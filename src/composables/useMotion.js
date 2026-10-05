import { onMounted, onUnmounted, ref } from 'vue'

export function useMotion() {
  // Static until mounted; no animation flash for reduced-motion users.
  const reducedMotion = ref(true)
  const pageVisible = ref(true)
  let media
  const updateMotion = () => { reducedMotion.value = media.matches }
  const updateVisibility = () => { pageVisible.value = !document.hidden }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    updateMotion()
    updateVisibility()
    media.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
  })
  onUnmounted(() => {
    media?.removeEventListener('change', updateMotion)
    document.removeEventListener('visibilitychange', updateVisibility)
  })
  return { reducedMotion, pageVisible }
}
