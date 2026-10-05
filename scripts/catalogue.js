import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeProject } from '../src/lib/projects.js'

export function readCatalogue(directory = fileURLToPath(new URL('../public/projects', import.meta.url))) {
  const names = JSON.parse(fs.readFileSync(path.join(directory, 'projects.json'), 'utf8'))
  if (!Array.isArray(names) || names.some(name => typeof name !== 'string' || path.basename(name) !== name || /[\\/]/.test(name))) {
    throw new Error('projects.json must contain project names, not paths')
  }
  if (new Set(names).size !== names.length) throw new Error('Duplicate names in projects.json')
  return names.map(name => {
    const data = JSON.parse(fs.readFileSync(path.join(directory, name + '.json'), 'utf8'))
    return normalizeProject(name, data)
  }).sort((a, b) => b.timestamp - a.timestamp || a.name.localeCompare(b.name, 'en'))
}
