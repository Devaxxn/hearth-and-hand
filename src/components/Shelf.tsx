import { useMemo, useState } from 'react'
import type { Recipe } from '../types'
import { useStore } from '../store/useStore'
import { RecipeCard } from './RecipeCard'
import { Heart, Martini, Search, SlidersHorizontal, X } from 'lucide-react'

type Tab = 'all' | 'food' | 'drink' | 'favorites'

const TABS: { id: Tab; label: string; icon?: typeof Martini }[] = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'drink', label: 'Drinks', icon: Martini },
  { id: 'favorites', label: 'Favorites', icon: Heart },
]

const TAGS = ['comfort', 'fresh', 'indulgent', 'light', 'smoky', 'herbal', 'citrusy', 'spiced', 'no-cook', 'one-pan'] as const

export const ShelfHeader = () => (
  <header className="mb-5 flex items-center gap-3 pt-2 md:pt-0">
    <div>
      <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-slate-deep md:text-4xl">My Shelf</h1>
      <p className="text-[13px] font-medium text-bark-muted md:text-sm">Every recipe you have loved, kept warm.</p>
    </div>
  </header>
)

export const Shelf = ({ onOpenRecipe }: { onOpenRecipe: (recipe: Recipe) => void }) => {
  const { data, toggleFavorite } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  const recipes = data.recipes

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes
      .filter((r) => (tab === 'all' ? true : tab === 'favorites' ? r.favorite : r.category === tab))
      .filter((r) => (activeTags.length === 0 ? true : activeTags.every((t) => r.tags.includes(t as never))))
      .filter((r) =>
        q === ''
          ? true
          : r.title.toLowerCase().includes(q) ||
            r.blurb.toLowerCase().includes(q) ||
            r.ingredients.some((i) => i.name.toLowerCase().includes(q)) ||
            r.tags.some((t) => t.includes(q))
      )
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [recipes, tab, query, activeTags])

  const toggleTag = (t: string) =>
    setActiveTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                  tab === t.id ? 'bg-slate-deep text-cream shadow' : 'bg-white/70 text-bark-muted hover:text-bark'
                }`}
              >
                {Icon && <Icon size={13} className={tab === t.id ? 'fill-cream/30' : 'fill-bark-muted/20'} />}
                {t.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setShowTags((s) => !s)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-bold transition-all ${
            showTags || activeTags.length > 0 ? 'border-sage-deep bg-sage-deep text-cream' : 'border-bark/15 bg-white/70 text-bark-muted'
          }`}
        >
          <SlidersHorizontal size={14} /> Tags{activeTags.length > 0 ? ` (${activeTags.length})` : ''}
        </button>
      </div>

      {/* Tag panel */}
      {showTags && (
        <div className="animate-fade-up mt-3 rounded-2xl border border-bark/10 bg-white/60 p-4">
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <button key={t} onClick={() => toggleTag(t)} className="chip" data-on={activeTags.includes(t)}>
                {t === 'no-cook' ? 'No-cook' : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {activeTags.length > 0 && (
            <button onClick={() => setActiveTags([])} className="mt-3 text-xs font-bold text-clay hover:underline">
              Clear tag filters
            </button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative mt-3">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-muted" />
        <input
          className="field pl-10"
          placeholder="Search titles, ingredients, tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-sage-deep p-1 text-cream" aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Count */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-bark-muted">
        {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'} on the shelf
      </p>

      {/* Grid on wood */}
      <div className="shelf-wood mt-3 rounded-3xl border border-bark/10 p-4 md:p-5">
        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-4xl">{recipes.length === 0 ? '🏡' : '🔍'}</p>
            <p className="mt-3 font-display text-lg font-semibold text-slate-deep">
              {recipes.length === 0 ? 'The shelf is bare' : 'Nothing matches those filters'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-bark-muted">
              {recipes.length === 0
                ? 'Visit the Muse, craft something delicious, and tap Save to keep it here.'
                : 'Try a different tab, clear the tag filters, or search something broader.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r: Recipe, idx) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                delay={Math.min(idx * 50, 400)}
                onOpen={() => onOpenRecipe(r)}
                onToggleFavorite={() => toggleFavorite(r.id)}
                favorite={r.favorite}
                savedLabel={r.favorite ? 'On Shelf ♥' : 'On Shelf'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
