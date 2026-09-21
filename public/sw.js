/* Hearth & Hand service worker — full offline app shell */
const VERSION = 'v5'
const CACHE = `hearth-hand-${VERSION}`
// hashed build assets are injected here by vite.config.ts at build time —
// precaching them at install makes the very first visit work offline too
const ASSETS = []

// relative URLs resolve against the SW's own scope, so this works both at a
// domain root and inside a GitHub Pages sub-path (and inside Capacitor)
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll([...SHELL, ...ASSETS]))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // only handle our own origin — leave cross-origin traffic to the network
  if (url.origin !== location.origin) return

  // navigations: network first so updates land immediately, cache fallback
  // for offline (the precached app shell)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html', { ignoreVary: true }).then((r) => r || caches.match('./', { ignoreVary: true })))
    )
    return
  }

  // hashed build assets + public files: stale-while-revalidate
  if (url.pathname.includes('/assets/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(
      caches.match(req, { ignoreVary: true }).then((cached) => {
        const fetched = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone()
              caches.open(CACHE).then((c) => c.put(req, copy))
            }
            return res
          })
          .catch(() => cached)
        return cached || fetched
      })
    )
    return
  }

  // everything else: try network, fall back to cache
  event.respondWith(
    caches.match(req, { ignoreVary: true }).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || fetched
    })
  )
})
