// Keep the reveal independent of a specific input device: actual document
// scrolling covers a wheel, trackpad, touch, keyboard and the scrollbar.
export const REVEAL_SCROLL_THRESHOLD = 24

export function heroScrollAction(previousY, currentY, compact, transitioning = false) {
  if (![previousY, currentY].every(Number.isFinite)) return null
  const previous = Math.max(0, previousY)
  const current = Math.max(0, currentY)
  if (transitioning) return null
  if (!compact && current > REVEAL_SCROLL_THRESHOLD && current > previous) return 'collapse'
  if (compact && current <= 1 && previous > 1) return 'expand'
  return null
}

// Vue Router must measure #projects after the hero has finished changing height,
// not before. Wait for the real CSS transition, not a hard-coded animation delay.
// Reduced motion / an already compact hero have no transition and resolve at once.
export async function waitForHeroLayout(element) {
  if (!element?.getAnimations) return
  const transitions = element.getAnimations().filter(animation => animation.transitionProperty === 'height')
  await Promise.allSettled(transitions.map(animation => animation.finished))
}
