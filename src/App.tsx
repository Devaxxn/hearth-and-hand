import { useEffect, useState } from 'react'
import type { Recipe } from './types'
import type { Route } from './components/Nav'
import { BottomNav, Header, SideRail } from './components/Nav'
import { Muse } from './components/Muse'
import { Shelf } from './components/Shelf'
import { Basket } from './components/Basket'
import { RecipeDetail } from './components/RecipeDetail'
import { useStore } from './store/useStore'
import { totalTime } from './lib/format'
import { Flame, LibraryBig, ShoppingBasket, Sparkles, Heart } from 'lucide-react'

const SUBTITLES: Record<Route, string> = {
  muse: 'What are we making tonight?',
  shelf: 'Every recipe you have loved, kept warm.',
  basket: 'One list, sorted by aisle, ready for the market.',
}

export default function App() {
  const { data, setOnboarded } = useStore()
  const [route, setRoute] = useState<Route>(() => {
    const saved = sessionStorage.getItem('hearth-hand:route')
    return saved === 'muse' || saved === 'shelf' || saved === 'basket' ? saved : 'muse'
  })
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support is best-effort */ })
    }
  }, [])

  useEffect(() => {
    try { sessionStorage.setItem('hearth-hand:route', route) } catch { /* noop */ }
    window.scrollTo({ top: 0 })
  }, [route])

  // prefer the persisted version when the recipe lives on the shelf (edits/favorites stay live)
  const detail = detailRecipe ? data.recipes.find((r) => r.id === detailRecipe.id) ?? detailRecipe : null

  // Cross-tab/desktop dashboard stats
  const stats = {
    total: data.recipes.length,
    food: data.recipes.filter((r) => r.category === 'food').length,
    drinks: data.recipes.filter((r) => r.category === 'drink').length,
    favorites: data.recipes.filter((r) => r.favorite).length,
    basket: data.basket.filter((i) => !i.checked).length,
  }
  const latest = [...data.recipes].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

  return (
    <div className="min-h-full">
      <SideRail route={route} onNavigate={setRoute} basketCount={stats.basket} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4 md:pl-[17.5rem] md:pr-8 md:pt-8 md:pb-16">
        {route === 'muse' && (
          <>
            <Header title="Kitchen & Bar Muse" subtitle={SUBTITLES.muse} />
            <Muse onOpenRecipe={(r) => setDetailRecipe(r)} />
            {stats.total > 0 && (
              <section className="mt-10 hidden md:block">
                <h3 className="font-display text-2xl font-semibold text-slate-deep">From your shelf</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {latest.map((r) => (
                    <button key={r.id} onClick={() => setDetailRecipe(r)} className="card-tile hue-cream p-4 text-left">
                      <span className="text-2xl">{r.emoji}</span>
                      <p className="mt-2 font-display text-[15px] font-semibold leading-snug text-slate-deep">{r.title}</p>
                      <p className="mt-1 text-xs font-semibold text-bark-muted">{totalTime(r)} · {r.favorite ? '♥ favorite' : 'saved'}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {route === 'shelf' && (
          <>
            <Header title="My Shelf" subtitle={SUBTITLES.shelf} />
            <Shelf onOpenRecipe={(r) => setDetailRecipe(r)} />
          </>
        )}

        {route === 'basket' && (
          <>
            <Header title="Smart Basket" subtitle={SUBTITLES.basket} />
            <Basket />
          </>
        )}
      </main>

      {/* Desktop dashboard strip (extra chrome for the wide screen) */}
      <div className="pointer-events-none fixed bottom-6 right-6 hidden flex-col items-end gap-3 md:flex">
        <div className="pointer-events-auto flex gap-2 rounded-full border border-bark/10 bg-white/80 px-4 py-2 shadow-lg backdrop-blur">
          <span className="stat"><Flame size={13} /> {stats.total} saved</span>
          <span className="stat"><LibraryBig size={13} /> {stats.food} food</span>
          <span className="stat"><Sparkles size={13} /> {stats.drinks} drinks</span>
          <span className="stat"><Heart size={13} /> {stats.favorites} favs</span>
          {stats.basket > 0 && <span className="stat"><ShoppingBasket size={13} /> {stats.basket} to buy</span>}
        </div>
      </div>

      <BottomNav route={route} onNavigate={setRoute} basketCount={stats.basket} />

      {detail && <RecipeDetail recipe={detail} onClose={() => setDetailRecipe(null)} />}

      {/* Onboarding */}
      {!data.onboarded && <Onboarding onDone={setOnboarded} />}
    </div>
  )
}

const Onboarding = ({ onDone }: { onDone: () => void }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-deep/55 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="w-full max-w-md rounded-[2rem] bg-cream p-8 shadow-2xl animate-pop">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay">Welcome to</p>
      <h2 className="mt-1 font-display text-3xl font-semibold text-slate-deep">Hearth &amp; Hand</h2>
      <p className="mt-3 text-sm leading-relaxed text-bark-muted">
        Your kitchen &amp; bar muse: type what you have, get real recipes and drinks, save them to your shelf, and send
        the shopping list straight to your basket. Everything stays on this device.
      </p>
      <ul className="mt-5 space-y-2.5 text-sm">
        <li className="flex gap-2.5"><Flame size={17} className="mt-0.5 shrink-0 text-clay" /> <span><strong>Muse</strong> — craft recipes from what's on hand.</span></li>
        <li className="flex gap-2.5"><LibraryBig size={17} className="mt-0.5 shrink-0 text-sage-deep" /> <span><strong>My Shelf</strong> — your saved library, searchable and taggable.</span></li>
        <li className="flex gap-2.5"><ShoppingBasket size={17} className="mt-0.5 shrink-0 text-butter-ink" /> <span><strong>Basket</strong> — one tap sends ingredients, sorted by aisle.</span></li>
      </ul>
      <button onClick={onDone} className="btn-primary mt-7 w-full py-3 text-sm">
        <Sparkles size={16} /> Light the hearth
      </button>
    </div>
  </div>
)
