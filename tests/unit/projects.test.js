import test from 'node:test'
import assert from 'node:assert/strict'
import { readCatalogue } from '../../scripts/catalogue.js'
import { filterProjects, normalizeProject, parseProjectDate, safeExternalUrl, youtubeEmbed } from '../../src/lib/projects.js'

const fixture = { date: '7.31.2025', category: 'software', tags: ['Vue'], description: 'A useful tool', repo: 'https://example.com/project', preview: '.png' }

test('the original catalogue is complete, valid and newest-first', () => {
  const projects = readCatalogue()
  assert.equal(projects.length, 14)
  assert.equal(new Set(projects.map(project => project.name)).size, projects.length)
  assert.ok(projects.some(project => project.name === 'FormatBay'))
  assert.ok(projects.some(project => project.category === 'music'))
  assert.ok(projects.every((project, index) => index === 0 || projects[index - 1].timestamp >= project.timestamp))
})

test('legacy dates are parsed in UTC and impossible dates fail clearly', () => {
  assert.equal(new Date(parseProjectDate('2.29.2024')).toISOString(), '2024-02-29T00:00:00.000Z')
  for (const value of ['2.29.2025', '13.1.2025', '1.32.2025', '', '2025-07-31']) assert.throws(() => parseProjectDate(value))
})

test('filenames are encoded and missing previews have a local visual fallback', () => {
  const project = normalizeProject('A & B', fixture)
  assert.equal(project.image, 'projects/preview/A%20%26%20B.png')
  assert.equal(project.dateISO, '2025-07-31')
  assert.equal(normalizeProject('No image', { ...fixture, preview: 'none' }).image, null)
  assert.throws(() => normalizeProject('../escape', fixture))
  assert.throws(() => normalizeProject('Bad', { ...fixture, category: 'unknown' }))
})

test('external links reject executable URLs, credentials and malformed input', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', '/relative', 'https://user:pass@example.com']) assert.equal(safeExternalUrl(url), null)
  assert.equal(safeExternalUrl('https://example.com'), 'https://example.com/')
})

test('music uses a privacy-enhanced, allowlisted embed', () => {
  assert.equal(youtubeEmbed('https://www.youtube.com/embed/UeKRdWimgwI?rel=0'), 'https://www.youtube-nocookie.com/embed/UeKRdWimgwI?rel=0')
  for (const url of ['https://evil.example/embed/test', 'https://www.youtube.com.evil.example/embed/test', 'https://youtube.com/watch?v=test']) assert.equal(youtubeEmbed(url), null)
})

test('search is case-insensitive, matches tags, intersects categories and supports multiple words', () => {
  const projects = [normalizeProject('Tool', fixture), normalizeProject('Song', { ...fixture, category: 'music', tags: ['Bass'], preview: 'none' })]
  assert.equal(filterProjects(projects, 'all', ' VUE useful ').length, 1)
  assert.equal(filterProjects(projects, 'music', 'Vue').length, 0)
  assert.equal(filterProjects(projects, 'music', 'bass')[0].name, 'Song')
  assert.equal(filterProjects(projects, 'all', '    ').length, 2)
})
