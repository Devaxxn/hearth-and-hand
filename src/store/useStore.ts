import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppData, MuseState, Recipe, ShoppingItem } from '../types'
import { DEFAULT_MUSE } from '../types'
import { seedData, canonicalRecipeId } from '../data/kitchen'

const STORAGE_KEY = 'hearth-hand:v1'

const isValidRecipe = (r: Recipe): boolean =>
  typeof r?.id === 'string' && typeof r?.title === 'string' && Array.isArray(r?.ingredients)

const load = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // first run: seed AND persist immediately so storage always matches the UI
      const fresh = seedData()
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      } catch {
        /* storage unavailable — memory-only session */
      }
      return fresh
    }
    const parsed = JSON.parse(raw) as Partial<AppData>
    // dedupe on category+title (the source of truth for the stable id), keeping
    // the first (newest) occurrence — heals duplicates written by versions that
    // generated per-run ids for the same recipe. A favorited duplicate ORs its
    // favorite into the kept entry so the merge can never drop it.
    const merged = new Map<string, Recipe>()
    for (const r of Array.isArray(parsed.recipes) ? parsed.recipes : []) {
      if (!isValidRecipe(r)) continue
      const key = canonicalRecipeId(r.category, r.title)
      const prev = merged.get(key)
      if (!prev) {
        // normalize legacy per-run ids to the canonical stable id
        merged.set(key, { ...r, id: key })
      } else if (r.favorite) {
        prev.favorite = true
      }
    }
    const recipes = [...merged.values()]
    const basket = (Array.isArray(parsed.basket) ? parsed.basket : []).filter(
      (i): i is ShoppingItem => typeof i?.id === 'string' && typeof i?.name === 'string'
    )
    const healed: AppData = {
      version: 1,
      recipes,
      basket,
      muse: { ...DEFAULT_MUSE, ...(parsed.muse ?? {}) },
      onboarded: Boolean(parsed.onboarded),
    }
    // persist the healed copy immediately so storage matches what the UI shows
    try {
      const now = JSON.stringify(healed)
      if (now !== raw) localStorage.setItem(STORAGE_KEY, now)
    } catch {
      /* storage unavailable — heal in memory only */
    }
    return healed
  } catch {
    return seedData()
  }
}

let memory: AppData | null = null
const listeners = new Set<() => void>()

const commit = (next: AppData) => {
  memory = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* storage full or unavailable — keep working in-memory */
  }
  listeners.forEach((l) => l())
}

export const useStore = () => {
  const [tick, force] = useState(0)

  useEffect(() => {
    if (memory === null) memory = load()
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => { listeners.delete(l) }
  }, [])

  const data = useMemo(() => memory ?? load(), [tick])

  const update = useCallback((fn: (d: AppData) => AppData) => {
    if (memory === null) memory = load()
    commit(fn(memory))
  }, [])

  const setMuse = useCallback(
    (patch: Partial<MuseState>) => update((d) => ({ ...d, muse: { ...d.muse, ...patch } })),
    [update]
  )

  const saveRecipe = useCallback(
    (recipe: Recipe) =>
      update((d) => {
        const exists = d.recipes.find((r) => r.id === recipe.id)
        if (!exists) return { ...d, recipes: [recipe, ...d.recipes] }
        // re-saving an existing recipe updates it without ever dropping a favorite
        const merged = { ...recipe, favorite: recipe.favorite || exists.favorite }
        return { ...d, recipes: d.recipes.map((r) => (r.id === recipe.id ? merged : r)) }
      }),
    [update]
  )

  const removeRecipe = useCallback(
    (id: string) => update((d) => ({ ...d, recipes: d.recipes.filter((r) => r.id !== id) })),
    [update]
  )

  const toggleFavorite = useCallback(
    (id: string) =>
      update((d) => ({
        ...d,
        recipes: d.recipes.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
      })),
    [update]
  )

  const addIngredientsToBasket = useCallback(
    (recipe: Recipe) =>
      update((d) => {
        const next = [...d.basket]
        for (const i of recipe.ingredients) {
          const existing = next.find((n) => !n.checked && n.name === i.name)
          if (existing) {
            if (i.note && !existing.note) existing.note = i.note
          } else {
            next.push({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: i.name,
              category: i.category,
              note: i.note,
              checked: false,
              recipeTitle: recipe.title,
            })
          }
        }
        return { ...d, basket: next }
      }),
    [update]
  )

  const addManualItem = useCallback(
    (name: string, category: ShoppingItem['category']) =>
      update((d) => ({
        ...d,
        basket: [
          ...d.basket,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: name.trim(),
            category,
            checked: false,
          },
        ],
      })),
    [update]
  )

  const toggleBasketItem = useCallback(
    (id: string) =>
      update((d) => ({
        ...d,
        basket: d.basket.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
      })),
    [update]
  )

  const removeBasketItem = useCallback(
    (id: string) => update((d) => ({ ...d, basket: d.basket.filter((i) => i.id !== id) })),
    [update]
  )

  const clearChecked = useCallback(
    () => update((d) => ({ ...d, basket: d.basket.filter((i) => !i.checked) })),
    [update]
  )

  const clearBasket = useCallback(() => update((d) => ({ ...d, basket: [] })), [update])

  const setOnboarded = useCallback(() => update((d) => ({ ...d, onboarded: true })), [update])

  return {
    data,
    setMuse,
    saveRecipe,
    removeRecipe,
    toggleFavorite,
    addIngredientsToBasket,
    addManualItem,
    toggleBasketItem,
    removeBasketItem,
    clearChecked,
    clearBasket,
    setOnboarded,
  }
}
