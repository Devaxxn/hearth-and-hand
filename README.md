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
npm run build      # typecheck + bundle to dist/
npm run preview    # serve dist/ locally
npm test           # headless engine tests (13 assertions on the recipe engine)
```

## Deploy to web (Vercel / Netlify / Pages)

The build in `dist/` is static — deploy it anywhere. SPA fallback not required (single route).

## Ship to the App Store & Play Store (Capacitor)

The project is PWA-first; wrap it with Capacitor for native stores:

```bash
npm i @capacitor/core @capacitor/cli
npx cap init "Hearth & Hand" com.hearthhand.app --web-dir=dist
npm i @capacitor/android @capacitor/ios
npm run build
npx cap add android
npx cap add ios
npx cap sync
npx cap open android   # Android Studio → build AAB for Play
npx cap open ios       # Xcode → archive for App Store
```

A ready-to-edit `capacitor.config.json` is included; `npx cap init` can be skipped.

Store metadata (description, keywords, privacy text) lives in `store/metadata.md`.

### Store checklist

- [ ] Bundle ID `com.hearthhand.app` set in Xcode / Android Studio
- [ ] App icons (1024×1024 App Store, 512×512 Play) — generate from `public/icon.svg`
- [ ] Screenshots: 6.7" iPhone, 6.4/6.7" Android phone, 10" tablet
- [ ] Privacy policy URL (app is fully offline/local — see `store/metadata.md`)
- [ ] Age rating 4+ / Everyone
- [ ] App Privacy: "Data Not Collected" (all data is local)

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
