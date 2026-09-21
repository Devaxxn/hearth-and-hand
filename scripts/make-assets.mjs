// One-time asset generation: launcher icons + splash from public/icon.svg.
// Run with: node scripts/make-assets.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const svg = readFileSync('public/icon.svg')
const bgSvg = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="#f6f1e7"/></svg>'
)
const fgSvg = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><g transform="translate(232,232) scale(0.55)"><rect width="1024" height="1024" fill="none"/></g><image href="data:image/png;base64,__FG__" x="0" y="0" width="1024" height="1024"/></svg>'
)

// --- PWA icons (public/) ---
await sharp(svg, { density: 300 }).resize(192, 192).png().toFile('public/icon-192.png')
await sharp(svg, { density: 300 }).resize(512, 512).png().toFile('public/icon-512.png')
await sharp(bgSvg, { density: 300 })
  .composite([{ input: await sharp(svg, { density: 300 }).resize(620, 620).png().toBuffer(), gravity: 'centre' }])
  .png()
  .toFile('public/icon-512-maskable.png')

// --- Android adaptive icon layers (1024x1024, content kept in the safe zone) ---
await sharp(bgSvg, { density: 300 }).png().toFile('assets/icon-background.png')
await sharp(svg, { density: 300 })
  .resize(620, 620)
  .extend({ top: 202, bottom: 202, left: 202, right: 202, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('assets/icon-foreground.png')
await sharp(svg, { density: 300 }).resize(512, 512).png().toFile('assets/drawable-icon.png')

// --- Splash: full-bleed warm background, centered mark ---
const splashMark = await sharp(svg, { density: 300 }).resize(480, 480).png().toBuffer()
await sharp(bgSvg, { density: 300 })
  .composite([{ input: splashMark, gravity: 'centre' }])
  .resize(2732, 2732, { fit: 'contain', background: '#f6f1e7' })
  .png()
  .toFile('assets/splash.png')

console.log('assets generated: public/icons + assets/ (android layers, splash)')
