import { useMemo, useState } from 'react'
import type { Diet, MuseState, Recipe } from '../types'
import { dietLabel } from '../lib/format'
import { generateResult, INGREDIENT_POOL, SURPRISE_STATES, normalizeIngredient } from '../data/kitchen'
import { useStore } from '../store/useStore'
import { RecipeCard } from './RecipeCard'
import { ChefHat, Dices, Loader2, Martini, Plus, Search, Sparkles, UtensilsCrossed, X } from 'lucide-react'

const DIETS: Diet[] = ['vegan', 'vegetarian', 'gluten-free', 'keto', 'dairy-free', 'nut-free']
const TIME_STEPS = [15, 30, 45, 60, 90]

export const Muse = ({ onOpenRecipe }: { onOpenRecipe: (recipe: Recipe) => void }) => {
  const { data, setMuse, saveRecipe, toggleFavorite, addIngredientsToBasket } = useStore()
  const muse = data.muse

  const [input, setInput] = useState('')
  const [results, setResults] = useState<Recipe[] | null>(null)
  const [fallback, setFallback] = useState(false)
  const [loading, setLoading] = useState(false)

  const suggestions = useMemo(() => {
    const pool = INGREDIENT_POOL[muse.category]
    const q = normalizeIngredient(input)
    const base = q ? pool.filter((p) => p.includes(q) && !muse.ingredients.includes(p)) : pool
    return base.filter((p) => !muse.ingredients.includes(p)).slice(0, 12)
  }, [input, muse.category, muse.ingredients])

  const addIngredient = (raw: string) => {
    const v = raw.trim().toLowerCase()
    if (!v) return
    if (muse.ingredients.some((i) => normalizeIngredient(i) === normalizeIngredient(v))) {
      setInput('')
      return
    }
    setMuse({ ingredients: [...muse.ingredients, v] })
    setInput('')
  }

  const removeIngredient = (i: string) => setMuse({ ingredients: muse.ingredients.filter((x) => x !== i) })

  const toggleDiet = (d: Diet) =>
    setMuse({ diets: muse.diets.includes(d) ? muse.diets.filter((x) => x !== d) : [...muse.diets, d] })

  const run = (override?: Partial<MuseState>) => {
    const state: MuseState = { ...muse, ...override }
    if (override) setMuse(override)
    setLoading(true)
    setResults(null)
    setFallback(false)
    window.setTimeout(() => {
      const r = generateResult(state, 6, Date.now())
      setResults(r.recipes)
      setFallback(r.fallback)
      setLoading(false)
    }, 900)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const surprise = () => {
    const pick = SURPRISE_STATES[Math.floor(Math.random() * SURPRISE_STATES.length)]
    setResults(null)
    setLoading(true)
    setMuse(pick)
    window.setTimeout(() => {
      const r = generateResult(pick, 6, Date.now())
      setResults(r.recipes)
      setFallback(false)
      setLoading(false)
    }, 900)
  }

  const handleSave = (recipe: Recipe) => {
    saveRecipe(recipe)
    addIngredientsToBasket(recipe)
  }

  const timeLabel = (m: number) => (m >= 90 ? '90+ min' : `≤ ${m} min`)

  return (
    <div>
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-bark/10 bg-gradient-to-br from-sage-soft/50 via-cream to-parchment p-6 shadow-sm md:p-9">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay">The AI Kitchen &amp; Bar Muse</p>
        <h2 className="mt-2 max-w-xl font-display text-2xl font-semibold leading-tight text-slate-deep md:text-[34px]">
          Tell me what's in your kitchen. I'll write tonight's recipe.
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-bark-muted">
          Pick your spirits and produce below — the Muse composes dishes and drinks around what you already have,
          filtered to your diet, your clock and your skill.
        </p>

        {/* Category */}
        <div className="mt-6 inline-flex rounded-full border border-bark/12 bg-white/70 p-1 shadow-sm">
          {(['food', 'drink'] as const).map((c) => (
            <button
              key={c}
              onClick={() => { setMuse({ category: c }); setResults(null) }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                muse.category === c ? 'bg-sage-deep text-cream shadow' : 'text-bark-muted hover:text-bark'
              }`}
            >
              {c === 'food' ? <UtensilsCrossed size={15} /> : <Martini size={15} />}
              {c === 'food' ? 'Food' : 'Drinks'}
            </button>
          ))}
        </div>

        {/* Ingredients input */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {muse.ingredients.map((i) => (
              <span key={i} className="chip" data-on="true">
                {i}
                <button onClick={() => removeIngredient(i)} aria-label={`Remove ${i}`} className="ml-0.5 rounded-full hover:bg-white/20">
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative mt-2">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-muted" />
            <input
              className="field pl-10"
              placeholder={muse.category === 'food' ? 'Add an ingredient — chicken, miso, lemon…' : 'Add a spirit — gin, mezcal, aperol…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { addIngredient(input); e.preventDefault() }
              }}
              aria-label="Add ingredient"
            />
            {input && (
              <button onClick={() => addIngredient(input)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-sage-deep p-1 text-cream" aria-label="Add">
                <Plus size={14} />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} onClick={() => addIngredient(s)} className="chip" data-on="false">
                  <Plus size={11} /> {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Prep time</p>
            <div className="flex flex-wrap gap-1.5">
              {TIME_STEPS.map((t) => (
                <button key={t} onClick={() => setMuse({ prepTime: t })} className="chip" data-on={muse.prepTime === t}>
                  {timeLabel(t)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Dietary needs</p>
            <div className="flex flex-wrap gap-1.5">
              {DIETS.map((d) => (
                <button key={d} onClick={() => toggleDiet(d)} className="chip" data-on={muse.diets.includes(d)}>
                  {dietLabel[d]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Skill level</p>
            <div className="flex flex-wrap gap-1.5">
              {(['easy', 'medium', 'advanced'] as const).map((s) => (
                <button key={s} onClick={() => setMuse({ skill: s })} className="chip" data-on={muse.skill === s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={() => run()} disabled={loading} className="btn-primary px-6 py-3 text-sm">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ChefHat size={16} />}
            {loading ? 'The Muse is thinking…' : 'Craft my recipes'}
          </button>
          <button onClick={surprise} disabled={loading} className="btn-soft px-5 py-3 text-sm" style={{ background: 'rgba(233, 180, 92, 0.28)', color: '#8a651f' }}>
            <Dices size={16} />
            Surprise Me
          </button>
        </div>
      </section>

      {/* Loading skeletons */}
      {loading && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-3xl border border-bark/10 bg-white/50 p-5">
              <div className="sk h-8 w-10" />
              <div className="sk mt-4 h-5 w-3/4" />
              <div className="sk mt-2 h-4 w-full" />
              <div className="sk mt-1.5 h-4 w-5/6" />
              <div className="mt-4 flex gap-2">
                <div className="sk h-6 w-20" />
                <div className="sk h-6 w-16" />
                <div className="sk h-6 w-16" />
              </div>
            </div>
            ))}
        </section>
      )}

      {/* Results */}
      {results && (
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-slate-deep md:text-2xl">
              {results.length > 0 ? 'Fresh from the Muse' : 'The shelf came back empty'}
            </h3>
            <p className="hidden text-xs font-semibold text-bark-muted sm:block">{results.length} ideas</p>
          </div>

          {fallback && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-butter/20 px-4 py-2 text-xs font-semibold text-butter-ink">
              <Sparkles size={13} />
              Nothing matched every ingredient with those filters, so the Muse improvised from your pantry.
            </p>
          )}

          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-bark/25 bg-white/40 p-10 text-center">
              <p className="text-3xl">🫙</p>
              <p className="mt-3 font-display text-lg font-semibold text-slate-deep">No matches for that combination</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-bark-muted">
                Try loosening a filter, raising the prep time, or swapping an ingredient — the Muse works with what she has.
              </p>
              <button onClick={surprise} className="btn-soft mt-4 px-5 py-2.5 text-sm">
                <Dices size={15} /> Surprise me instead
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((r, idx) => {
                const savedRecipe = data.recipes.find((x) => x.id === r.id)
                return (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    delay={idx * 70}
                    onOpen={() => onOpenRecipe(r)}
                    onToggleFavorite={() => {
                      if (savedRecipe) toggleFavorite(savedRecipe.id)
                      else saveRecipe({ ...r, favorite: true })
                    }}
                    onSave={() => handleSave(r)}
                    saved={Boolean(savedRecipe)}
                    favorite={savedRecipe?.favorite}
                  />
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
