const SITE_URL = 'https://theaiecosystem.reyaan.me'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export interface SeoInput {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown> | null
}

const upsert = (selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) => {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  apply(el)
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  }, el => el.setAttribute('content', content))

const setLink = (rel: string, href: string) =>
  upsert(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link')
    l.rel = rel
    return l
  }, el => el.setAttribute('href', href))

export function setSeo({ title, description, path, jsonLd = null }: SeoInput) {
  document.title = title
  setMeta('name', 'description', description)
  setLink('canonical', `${SITE_URL}${path}`)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', `${SITE_URL}${path}`)
  setMeta('property', 'og:image', DEFAULT_IMAGE)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', DEFAULT_IMAGE)
  upsert('script#route-jsonld', () => {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.id = 'route-jsonld'
    return s
  }, el => {
    if (jsonLd) {
      el.textContent = JSON.stringify(jsonLd)
      el.removeAttribute('data-empty')
    } else {
      el.textContent = ''
      el.setAttribute('data-empty', 'true')
    }
  })
}
