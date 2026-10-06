import test from 'node:test'
import assert from 'node:assert/strict'
import { heroScrollAction, waitForHeroLayout, REVEAL_SCROLL_THRESHOLD } from '../../src/lib/heroReveal.js'

test('only actual downward scrolling beyond the threshold starts a reveal', () => {
  assert.equal(heroScrollAction(0, 0, false), null)
  assert.equal(heroScrollAction(0, REVEAL_SCROLL_THRESHOLD, false), null)
  assert.equal(heroScrollAction(0, 120, false), 'collapse')
  assert.equal(heroScrollAction(240, 120, false), null)
})

test('a compact intro does not keep collapsing during ordinary scrolling', () => {
  assert.equal(heroScrollAction(120, 200, true), null)
  assert.equal(heroScrollAction(200, 120, true), null)
})

test('scrolling back to the very top restores the full-screen introduction', () => {
  assert.equal(heroScrollAction(100, 0, true), 'expand')
  assert.equal(heroScrollAction(100, 2, true), null)
  assert.equal(heroScrollAction(0, 0, true), null)
})

test('an in-flight reveal ignores scroll anchoring and transition-driven scroll events', () => {
  assert.equal(heroScrollAction(100, 0, true, true), null)
  assert.equal(heroScrollAction(0, 100, false, true), null)
})

test('overscroll and invalid coordinates do not create bogus transitions', () => {
  assert.equal(heroScrollAction(-10, 0, true), null)
  assert.equal(heroScrollAction(0, -10, false), null)
  assert.equal(heroScrollAction(NaN, 100, false), null)
  assert.equal(heroScrollAction(0, Infinity, false), null)
})

test('layout waiting is immediate without a hero or without an active height transition', async () => {
  await waitForHeroLayout(null)
  await waitForHeroLayout({})
  await waitForHeroLayout({ getAnimations: () => [] })
  // Never wait on ambient / infinite artwork animations.
  await waitForHeroLayout({ getAnimations: () => [{ transitionProperty: 'opacity', finished: new Promise(() => {}) }] })
})

test('navigation waits for the actual hero height transition', async () => {
  let finish
  let settled = false
  const height = new Promise(resolve => { finish = resolve })
  const waiting = waitForHeroLayout({ getAnimations: () => [{ transitionProperty: 'height', finished: height }] }).then(() => { settled = true })
  await Promise.resolve()
  assert.equal(settled, false)
  finish()
  await waiting
  assert.equal(settled, true)
})

test('cancelled transitions resolve safely during navigation or unmount', async () => {
  await assert.doesNotReject(waitForHeroLayout({ getAnimations: () => [{ transitionProperty: 'height', finished: Promise.reject(new Error('cancelled')) }] }))
})
