import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://theaiecosystem.reyaan.me'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'src', 'data')

const toolIds = new Set()
for (const file of readdirSync(dataDir).filter(f => f.endsWith('.json'))) {
  if (file === 'all_models.json') continue
  const entries = JSON.parse(readFileSync(join(dataDir, file), 'utf8'))
  for (const tool of entries || []) {
    if (tool && tool.id) toolIds.add(String(tool.id))
  }
}

const today = new Date().toISOString().slice(0, 10)

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/browse', priority: '0.9' },
  { path: '/categories', priority: '0.8' },
  { path: '/project-analysis', priority: '0.8' },
  { path: '/maker', priority: '0.6' },
  { path: '/compare', priority: '0.5' }
]

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const urls = [
  ...staticPages.map(p => `  <url>\n    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`),
  ...[...toolIds].sort().map(id => `  <url>\n    <loc>${SITE_URL}/tools/${encodeURIComponent(id)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.7</priority>\n  </url>`)
].join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(join(root, 'public', 'sitemap.xml'), xml)
console.log(`sitemap.xml generated: ${staticPages.length} static pages + ${toolIds.size} tool pages = ${staticPages.length + toolIds.size} urls`)
