// Vue/JavaScript port of the ribbon geometry in KnowYourself/Doc/src/lib/waves.ts.
// Four portfolio scenes reuse its shared topology and critically damped transitions.
export const waveShapes = [
  [[155, 40, 65, 145, 220, 145, 90, 100], [460, 365, 410, 485, 600, 570, 440, 108], [310, 385, 370, 300, 225, 260, 345, 65]],
  [[130, 105, 150, 155, 160, 120, 130, 78], [495, 465, 480, 475, 470, 435, 450, 96], [320, 305, 330, 320, 310, 295, 300, 52]],
  [[315, 320, 265, 190, 115, 85, 35, 82], [580, 585, 510, 420, 330, 285, 210, 100], [455, 455, 385, 300, 215, 180, 115, 62]],
  [[160, 35, 360, 260, 160, 20, 185, 104], [440, 570, 245, 345, 445, 595, 415, 108], [315, 240, 245, 300, 355, 390, 300, 64]],
]

export function ribbonPath(p, time = 0, seed = 0, strand = -1) {
  const upper = [], lower = []
  for (let i = 0; i <= 24; i++) {
    const progress = i / 24
    const segment = progress < 0.5 ? 0 : 3
    const t = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2
    const u = 1 - t
    const base = u*u*u*p[segment] + 3*u*u*t*p[segment+1] + 3*u*t*t*p[segment+2] + t*t*t*p[segment+3]
    const phase = progress * Math.PI * 4 - time * 0.32 + seed * 1.9
    const swell = Math.sin(progress * Math.PI * 2 - time * 0.45 + seed * 2.1) * 6
    const ripple = swell + Math.sin(phase) * 3 + Math.sin(phase * 1.7 + 1.2) * 1.2
    const width = p[7] * 0.75 * (0.82 + 0.15 * Math.sin(phase + 0.8) + 0.08 * Math.sin(phase * 0.63 - 1))
    const center = base + p[7] * 0.375 + ripple
    const lane = strand < 0 ? 0.5 : 0.15 + strand * 0.28 + Math.sin(phase * 0.8 + strand * 1.5 + time * 0.12) * 0.045
    const spread = strand < 0 ? 0.5 : 0.055 + 0.025 * (1 + Math.sin(phase * 1.2 + strand * 2))
    upper.push([-80 + progress * 1600, center + width * (lane - spread - 0.5)])
    lower.push([-80 + progress * 1600, center + width * (lane + spread - 0.5)])
  }
  function curve(points) {
    let result = ''
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)], b = points[i]
      const c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)]
      result += `C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(d[0]-b[0])/6} ${c[1]-(d[1]-b[1])/6} ${c[0]} ${c[1]}`
    }
    return result
  }
  lower.reverse()
  return `M${upper[0].join(' ')}${curve(upper)}L${lower[0].join(' ')}${curve(lower)}Z`
}

export function springStep(position, velocity, target, seconds) {
  const frequency = 6
  const offset = position - target
  const impulse = velocity + frequency * offset
  const decay = Math.exp(-frequency * seconds)
  return [target + (offset + impulse * seconds) * decay, (velocity - frequency * impulse * seconds) * decay]
}
