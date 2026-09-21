import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), injectSWAssets()],
  // relative asset URLs so the built app works at a domain root, inside a
  // GitHub Pages sub-path, and inside the Capacitor WebView unchanged
  base: './',
})

/**
 * Precache the hashed build assets: after the bundle is written, splice the
 * real asset file names into the service worker's ASSETS list so the first
 * visit (before the SW controls the page) is fully cached for offline use.
 */
function injectSWAssets(): Plugin {
  let config: ResolvedConfig | null = null
  return {
    name: 'inject-sw-assets',
    apply: 'build',
    configResolved(c) {
      config = c
    },
    closeBundle() {
      // Vite copies public/ into outDir before closeBundle, so patch the copy
      // that actually ships (public/ keeps its placeholder for dev serving)
      const swPath = resolve(config!.build.outDir, 'sw.js')
      if (!existsSync(swPath)) return
      const assets = readdirSync(resolve(config!.build.outDir, 'assets'))
        .filter((f) => /\.(js|css)$/.test(f))
        .map((f) => `./assets/${f}`)
      const sw = readFileSync(swPath, 'utf8')
      const next = sw.replace(
        'const ASSETS = []',
        `const ASSETS = [${assets.map((a) => `'${a}'`).join(', ')}]`
      )
      if (next !== sw) writeFileSync(swPath, next)
    },
  }
}
