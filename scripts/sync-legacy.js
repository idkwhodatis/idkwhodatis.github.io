import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

function refExists(ref) {
  try {
    execSync(`git rev-parse --verify "${ref}"`, { cwd: root, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function resolveRef(branch) {
  if (refExists(branch)) return branch
  if (refExists(`origin/${branch}`)) return `origin/${branch}`
  return null
}

const classicRef = resolveRef('classic')
if (classicRef) {
  const classicOut = path.join(root, 'public/classic')
  fs.mkdirSync(path.join(classicOut, 'assets'), { recursive: true })
  const files = execSync(`git ls-tree -r --name-only "${classicRef}" docs/`, { cwd: root, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
  for (const file of files) {
    if (file.startsWith('docs/projects/')) continue
    const rel = file.slice('docs/'.length)
    const buf = execSync(`git show "${classicRef}:${file}"`, { cwd: root, maxBuffer: 50 * 1024 * 1024 })
    const outPath = path.join(classicOut, rel)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    if (rel === 'index.html') {
      const html = buf
        .toString('utf8')
        .replace('href="/favicon.ico"', 'href="./favicon.ico"')
        .replace('src="/assets/', 'src="./assets/')
        .replace('href="/assets/', 'href="./assets/')
      fs.writeFileSync(outPath, html)
    } else if (rel === 'assets/index-DsRu6Tb7.js') {
      const js = buf
        .toString('utf8')
        .replace('Nm=function(e){return"/"+e}', 'Nm=function(e){return"./"+e}')
        .replace('history:sg("/")', 'history:sg(location.pathname+"#")')
        .replace('"/projects/', '"../projects/')
        .replace('"/projects/', '"../projects/')
        .replace('"/projects/projects.json"', '"../projects/projects.json"')
        .replace('"/projects/"+e[n]+".json"', '"../projects/"+e[n]+".json"')
      fs.writeFileSync(outPath, js)
    } else if (rel === 'assets/index-B51T7Xks.css') {
      const css = buf.toString('utf8').replace(/url\(\/assets\//g, 'url(./')
      fs.writeFileSync(outPath, css)
    } else {
      fs.writeFileSync(outPath, buf)
    }
  }
}

const legacyRef = resolveRef('legacy')
if (legacyRef) {
  const legacyOut = path.join(root, 'public/legacy')
  fs.mkdirSync(legacyOut, { recursive: true })
  const files = execSync(`git ls-tree -r --name-only "${legacyRef}"`, { cwd: root, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
  for (const file of files) {
    if (file === 'README.md' || file === '_config.yml') continue
    const buf = execSync(`git show "${legacyRef}:${file}"`, { cwd: root, maxBuffer: 50 * 1024 * 1024 })
    const outPath = path.join(legacyOut, file)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, buf)
  }
}
