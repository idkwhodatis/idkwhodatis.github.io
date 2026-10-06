import { test, expect } from '@playwright/test'

const heroSelector = '[data-hero-state]'

async function settled(page, state) {
  await expect(page.locator(heroSelector)).toHaveAttribute('data-hero-state', state)
  await expect(page.locator(heroSelector)).toHaveAttribute('data-transitioning', 'false')
}

test('the initial introduction fills the screen below the header', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await settled(page, 'expanded')
  const box = await page.locator(heroSelector).boundingBox()
  expect(Math.abs(box.y + box.height - page.viewportSize().height)).toBeLessThan(2)
  const projects = await page.locator('#projects').boundingBox()
  expect(projects.y).toBeGreaterThanOrEqual(page.viewportSize().height - 2)
})

test('a downward scroll shrinks the intro and returning to the top restores it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const initial = await page.locator(heroSelector).boundingBox()
  await page.evaluate(() => window.scrollTo(0, 120))
  await settled(page, 'compact')
  const compact = await page.locator(heroSelector).boundingBox()
  expect(compact.height).toBeLessThan(initial.height * .85)
  await page.evaluate(() => window.scrollTo(0, 0))
  await settled(page, 'expanded')
  expect(Math.abs((await page.locator(heroSelector).boundingBox()).height - initial.height)).toBeLessThan(2)
})

test('Explore selects its category and waits for the shrink before scrolling to projects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.getByRole('group', { name: 'Choose an introduction' }).getByRole('button', { name: 'Software', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small ideas.')
  await page.getByRole('link', { name: 'Explore the work' }).click()
  await settled(page, 'compact')
  await expect(page.getByRole('tab', { name: /^Software/ })).toHaveAttribute('aria-selected', 'true')
  await expect.poll(async () => {
    const section = await page.locator('#projects').boundingBox()
    const header = await page.locator('.site-header').boundingBox()
    return Math.abs(section.y - header.height - 24)
  }).toBeLessThan(3)
})

test('reduced motion reveals immediately without a height animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore the work' }).click()
  await settled(page, 'compact')
  expect(await page.locator(heroSelector).evaluate(element => element.getAnimations().filter(animation => animation.transitionProperty === 'height').length)).toBe(0)
})

test('project deep links and refresh start compact rather than jumping through the intro', async ({ page }) => {
  await page.goto('/#/#projects')
  await settled(page, 'compact')
  await page.reload()
  await settled(page, 'compact')
  expect((await page.locator(heroSelector).boundingBox()).height).toBeLessThanOrEqual(440)
})

test('everyday text is readable and interactive elements keep the normal cursor', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const selector of ['.hero-description', '.hero-cta', '.project-description', '.project-search input']) {
    expect(await page.locator(selector).first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16)
  }
  for (const selector of ['.project-meta', '.project-tags > span', '.eyebrow']) {
    expect(await page.locator(selector).first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(13)
  }
  for (const selector of ['.hero-cta', '.hero-cta svg', '.scene-choice', '[role="tab"]', '.card-preview', '.wordmark']) {
    const element = page.locator(selector).first()
    await element.hover()
    await expect(element).toHaveCSS('cursor', 'default')
  }
  await expect(page.locator('#project-search')).toHaveCSS('cursor', 'text')
})

test('small screens keep controls inside the intro and never overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const cta = await page.locator('.hero-cta').boundingBox()
  const controls = await page.locator('.hero-bottom').boundingBox()
  expect(cta.y + cta.height).toBeLessThanOrEqual(controls.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.evaluate(() => scrollTo(0, 120))
  await settled(page, 'compact')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
