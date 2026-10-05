import test from 'node:test'
import assert from 'node:assert/strict'
import { ribbonPath, springStep, waveShapes } from '../../src/lib/waves.js'

test('every scene and strand has valid, closed geometry', () => {
  for (const shape of waveShapes) for (const row of shape) for (const strand of [-1, 0, 1, 2]) {
    const path = ribbonPath(row, 123.4, 2, strand)
    assert.ok(path.startsWith('M') && path.endsWith('Z'))
    assert.ok(!/NaN|Infinity|undefined/.test(path))
  }
})

test('spring converges and is independent of frame subdivision', () => {
  const full = springStep(0, 2, 100, 0.2)
  const half = springStep(0, 2, 100, 0.1)
  const twice = springStep(half[0], half[1], 100, 0.1)
  assert.ok(Math.abs(full[0] - twice[0]) < 1e-9)
  assert.ok(Math.abs(full[1] - twice[1]) < 1e-9)
  assert.ok(Math.abs(springStep(0, 0, 100, 5)[0] - 100) < 1e-6)
})
