import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readCatalogue } from '../../scripts/catalogue.js'

const catalogue = readCatalogue()

async function visitAbout(page, isMobile) {
  if (isMobile) await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('link', { name: 'About', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Different interests.')
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  // Media behaviour is tested without relying on a third-party network/service.
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Test media</title><body>Test player</body></html>' }))
})

test('renders the full original catalogue without browser errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curiosity,')
  await expect(page.getByTestId('project-card')).toHaveCount(catalogue.length)
  await expect(page.getByRole('heading', { name: 'FormatBay', exact: true })).toBeVisible()
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('categories, tag search and empty-state reset compose correctly', async ({ page }) => {
  await page.goto('/#/\u0023projects')
  await page.getByRole('tab', { name: /^Software/ }).click()
  await expect(page.getByTestId('project-card')).toHaveCount(catalogue.filter(project => project.category === 'software').length)
  await page.getByRole('textbox', { name: 'Search projects' }).fill('svelte')
  await expect(page.getByRole('heading', { name: 'FormatBay', exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: 'Search projects' }).fill('no-such-project-zzzz')
  await expect(page.getByRole('heading', { name: 'No matching projects' })).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.getByTestId('project-card')).toHaveCount(catalogue.length)
})

test('tabs are keyboard-operable', async ({ page }) => {
  await page.goto('/')
  const all = page.getByRole('tab', { name: /^All work/ })
  await all.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('tab', { name: /^Software/ })).toHaveAttribute('aria-selected', 'true')
})

test('previews close with Escape and return focus to their trigger', async ({ page }) => {
  await page.goto('/')
  const trigger = page.locator('[data-category="software"] button[aria-label^="Preview "]').first()
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open project', exact: true })).toHaveAttribute('rel', /noopener/)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('music loads only when requested and unloads when closed', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /^Music/ }).click()
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.locator('[data-category="music"] button[aria-label^="Preview "]').first().click()
  await expect(page.locator('iframe')).toHaveAttribute('src', /^https:\/\/www.youtube-nocookie.com\/embed\//)
  await expect(page.locator('iframe')).toHaveAttribute('title', /music player/)
  await page.keyboard.press('Escape')
  await expect(page.locator('iframe')).toHaveCount(0)
})

test('missing screenshots have a graceful fallback', async ({ page }) => {
  await page.route('**/projects/preview/**', route => route.abort())
  await page.goto('/')
  const trigger = page.locator('[data-category="software"] button[aria-label^="Preview "]').first()
  await trigger.scrollIntoViewIfNeeded()
  await expect(trigger.locator('.preview-art')).toBeVisible()
  await trigger.click()
  await expect(page.getByText('No preview available. Explore the project below.')).toBeVisible()
})

test('About navigation, refresh and return to Projects work on static hosting', async ({ page, isMobile }) => {
  await page.goto('/')
  await visitAbout(page, isMobile)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Different interests.')
  await expect(page.getByRole('link', { name: /Earlier React version/ })).toHaveAttribute('href', 'https://idkwhodatis.github.io/idkwhodatis.github.io-react/')
  await page.getByRole('link', { name: 'Explore the work' }).click()
  await expect(page.getByRole('heading', { name: 'A few different directions.' })).toBeVisible()
})

test('unknown hash routes have a usable recovery', async ({ page }) => {
  await page.goto('/#/missing-page')
  await expect(page.getByRole('heading', { name: "This page isn't here." })).toBeVisible()
  await page.getByRole('link', { name: 'Back to the portfolio' }).click()
  await expect(page.getByTestId('project-card')).toHaveCount(catalogue.length)
})

test('hero controls select scenes and reduced motion keeps them still', async ({ page }) => {
  await page.goto('/')
  const group = page.getByRole('group', { name: 'Choose an introduction' })
  await group.getByRole('button', { name: 'Software', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small ideas.')
  await expect(page.getByRole('button', { name: 'Pause motion' })).toHaveCount(0)
  const path = page.locator('[data-ribbon]').first()
  const before = await path.getAttribute('d')
  await page.waitForTimeout(150)
  expect(await path.getAttribute('d')).toBe(before)
  await page.getByRole('link', { name: 'Explore the work' }).click()
  await expect(page.getByRole('tab', { name: /^Software/ })).toHaveAttribute('aria-selected', 'true')
})

test('home and About pass automated accessibility checks', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByTestId('project-card')).toHaveCount(catalogue.length)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await visitAbout(page, isMobile)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('layout stays within the viewport and records visual previews', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curiosity,')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: false })
  await page.getByRole('heading', { name: 'A few different directions.' }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: testInfo.outputPath('projects.png'), fullPage: false })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
