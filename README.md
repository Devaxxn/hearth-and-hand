# Hearth & Hand 🍳

**An aesthetic AI-powered Recipe & Drink Organizer** — warm, modern-rustic, mobile-first.
Craft recipes and cocktails from what's already in your kitchen, save them to a searchable shelf,
and send ingredients straight to a smart, aisle-sorted shopping basket.

## Features

- **AI Kitchen & Bar Muse** — select or type ingredients/spirits on hand; filter by category
  (Food vs. Drinks), prep time, dietary needs (vegan, vegetarian, gluten-free, keto, dairy-free,
  nut-free) and skill level. "Surprise Me" for instant ideas. Output is rich recipe cards with
  title, prep/cook time, difficulty, categorized ingredients, step-by-step instructions, muse
  notes, and pairings (wine / cocktail / zero-proof / side).
- **My Shelf** — saved recipe gallery with All / Food / Drinks / Favorites tabs, search, tag
  filtering, edit, delete, favorite. Persists via localStorage.
- **Smart Shopping List** — one tap sends a recipe's ingredients to the basket, auto-grouped by
  aisle (Produce, Dairy, Pantry, Spirits & Liquids). Add items manually, check them off, clear
  crossed-off items.
- **Cook / Mix Mode** — full-screen step-by-step reading mode with big text, tap-to-complete
  steps, progress bar, keyboard navigation and a completion celebration.
- **Installable PWA** — manifest, service worker, offline shell caching, app icons.
- **Onboarding** — one-time welcome modal on first launch.

## Tech

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4 (`@theme` tokens, no config file needed)
- Lucide icons
- LocalStorage persistence (`hearth-hand:v1`) — recipes, favorites, basket, Muse filters

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build      # typecheck + bundle to dist/ (injects hashed assets into the service worker)
npm run preview    # serve dist/ locally
npm test           # headless engine tests (17 assertions on the recipe engine)
```

## Offline (PWA)

The app is fully offline-capable. The service worker (`public/sw.js`) precaches the app shell
*and* the hashed JS/CSS bundles at install time (the list is injected by `vite.config.ts`),
so the **very first visit** already works offline. Assets are served stale-while-revalidate;
navigations are network-first with a cache fallback. Data lives in `localStorage` — nothing
needs the network after install. Bump `VERSION` in `public/sw.js` when shipping updates.

## Deploy to web (GitHub Pages — automatic)

Deployment is wired in `.github/workflows/deploy.yml`: every push to `main` runs tests +
build, then publishes `dist/` to GitHub Pages. Enable **Settings → Pages → Source: GitHub
Actions** once; the live URL appears in the workflow run's `deploy` job.

Any other static host works too — the build is fully relative (`base: './'`).

## Ship to the Play Store (Capacitor — Android is set up)
`The `android/` platform is committed and store-ready: app id `com.hearthhand.app`, adaptive
launcher icons and splash screens already generated (`scripts/make-assets.mjs` →
`npx @capacitor/assets generate --android`). Build the release bundle:

```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease   # → app/build/outputs/bundle/release/app-release.aab
```

Before your first upload, create a keystore and sign the bundle:

```bash
keytool -genkey -v -keystore hearth-hand.keystore -alias hearth-hand -keyalg RSA -keysize 2048 -validity 10000
# then add signingConfig to android/app/build.gradle, or sign in Android Studio:
#   Build → Generate Signed Bundle / APK → Android App Bundle
```

Upload the `.aab` in the Play Console (create the app, fill the store listing from
`store/metadata.md`, complete the data-safety form — the app collects no data). For iOS,
add the platform with `npx cap add ios` and archive in Xcode.

## Project structure

```
src/
  data/kitchen.ts       ingredient pool + 28 recipe templates + generation engine
  store/useStore.ts     localStorage-backed store (recipes, basket, muse, onboarding)
  components/
    Nav.tsx             bottom nav (mobile), side rail (desktop), header, logo
    Muse.tsx            generator: chips, filters, Surprise Me, results
    Shelf.tsx           saved library: tabs, search, tags
    Basket.tsx          grouped shopping checklist
    RecipeCard.tsx      cards, ingredient list, pairing rows
    RecipeDetail.tsx    full-screen detail, editor, delete confirm
    CookMode.tsx        full-screen tap-to-complete steps
  lib/format.ts         labels + formatting helpers
  types.ts              domain model
```

---

From the pantry: *the kitchen is a workshop; the bar, a library. Take your time in both.*
