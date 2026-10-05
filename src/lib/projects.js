export const categories = [
  { value: 'all', label: 'All work', color: '#b8b5ae' },
  { value: 'software', label: 'Software', color: '#99b4cc' },
  { value: 'game', label: 'Games', color: '#a6b8a5' },
  { value: 'music', label: 'Music', color: '#c49aa6' },
]

export function parseProjectDate(value) {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(value))
  if (!match) throw new Error(`Invalid project date: ${value}`)
  const [, month, day, year] = match.map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`Invalid calendar date: ${value}`)
  }
  return date.getTime()
}

export function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch { return null }
}

export function youtubeEmbed(value) {
  const safe = safeExternalUrl(value)
  if (!safe) return null
  const url = new URL(safe)
  if (!['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) return null
  if (!/^\/embed\/[\w-]+$/.test(url.pathname)) return null
  return `https://www.youtube-nocookie.com${url.pathname}?rel=0`
}

export function normalizeProject(name, data) {
  if (!name || typeof name !== 'string' || /[\\/]/.test(name) || name === '.' || name === '..') {
    throw new Error('Invalid project name')
  }
  if (!data || !categories.slice(1).some(({ value }) => value === data.category)) {
    throw new Error(`Invalid category for ${name}`)
  }
  if (typeof data.description !== 'string' || !Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string')) {
    throw new Error(`Invalid description or tags for ${name}`)
  }
  const repo = safeExternalUrl(data.repo)
  if (!repo) throw new Error(`Invalid project link for ${name}`)
  const timestamp = parseProjectDate(data.date)
  const category = categories.find(item => item.value === data.category)
  const extension = typeof data.preview === 'string' && /^\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i.test(data.preview) ? data.preview : null
  return {
    name,
    category: data.category,
    categoryLabel: category.label,
    color: category.color,
    description: data.description,
    tags: data.tags,
    repo,
    timestamp,
    dateISO: new Date(timestamp).toISOString().slice(0, 10),
    dateLabel: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(timestamp),
    year: new Date(timestamp).getUTCFullYear(),
    // Preserve filenames, including spaces, Unicode and punctuation, in existing media.
    image: data.category !== 'music' && extension ? `projects/preview/${encodeURIComponent(name + extension)}` : null,
    embed: data.category === 'music' ? youtubeEmbed(data.preview) : null,
  }
}

export function filterProjects(projects, category = 'all', query = '') {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  return projects.filter(project => {
    if (category !== 'all' && project.category !== category) return false
    const haystack = `${project.name} ${project.description} ${project.tags.join(' ')}`.toLocaleLowerCase()
    return terms.every(term => haystack.includes(term))
  })
}
