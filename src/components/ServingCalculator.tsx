import { useMemo } from 'react'
import type { Recipe } from '../types'
import { parseServings, scaleIngredients, scaleServingsLabel } from '../lib/scale'
import { IngredientList } from './RecipeCard'
import { Minus, Plus, Users } from 'lucide-react'

const BASES = [1, 2, 3, 0.5]

const servingsNoun = (recipe: Recipe, n: number): string =>
  recipe.category === 'drink' ? (n === 1 ? 'drink' : 'drinks') : n === 1 ? 'serving' : 'servings'

/**
 * Scale the recipe's ingredient quantities for a different number of servings.
 * Fractions snap to kitchen-friendly eighths; countable things (cloves, slices)
 * stay whole; "to taste" entries are left alone. Controlled: `factor` lives in
 * the parent so the meta pills stay in sync.
 */
export const ServingCalculator = ({
  recipe,
  factor,
  onScale,
}: {
  recipe: Recipe
  factor: number
  onScale: (f: number) => void
}) => {
  const baseServings = parseServings(recipe.servings)
  const targetServings = Math.max(1, Math.round(baseServings * factor))

  const scaled = useMemo(
    () => (factor === 1 ? recipe.ingredients : scaleIngredients(recipe.ingredients, factor)),
    [recipe.ingredients, factor]
  )
  const scaledLabel = useMemo(
    () => (factor === 1 ? recipe.servings : scaleServingsLabel(recipe.servings, targetServings)),
    [recipe.servings, factor, targetServings]
  )
  const unscaledCount = useMemo(() => {
    if (factor === 1) return 0
    return recipe.ingredients.filter((o) => {
      const scaledQty = scaled.find((s) => s.name === o.name)?.quantity
      return scaledQty === o.quantity && o.quantity.trim().toLowerCase() !== '' && !/^\d/.test(o.quantity.trim())
    }).length
  }, [recipe.ingredients, scaled, factor])

  const set = (f: number) => onScale(Math.min(6, Math.max(0.5, Math.round(f * 8) / 8)))

  return (
    <div className="mt-4 rounded-2xl border border-bark/10 bg-white/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-bark-muted">
          <Users size={13} /> Scale recipe
        </p>
        <div className="flex items-center gap-2.5">
          <button onClick={() => set(factor - 0.25)} disabled={factor <= 0.5} className="btn-soft h-8 w-8 !p-0 disabled:opacity-30" aria-label="Fewer servings">
            <Minus size={15} />
          </button>
          <span className="min-w-28 text-center font-display text-lg font-semibold text-slate-deep" aria-live="polite">
            {targetServings} {servingsNoun(recipe, targetServings)}
          </span>
          <button onClick={() => set(factor + 0.25)} disabled={factor >= 6} className="btn-soft h-8 w-8 !p-0 disabled:opacity-30" aria-label="More servings">
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {BASES.map((b) => (
          <button key={b} onClick={() => set(b)} data-on={factor === b} className="chip" aria-pressed={factor === b}>
            {b === 0.5 ? '½×' : `${b}×`}
          </button>
        ))}
        {factor !== 1 && !BASES.includes(factor) && <span className="chip" data-on="true">{factor}×</span>}
      </div>

      {factor !== 1 && (
        <div className="mt-3 border-t border-bark/10 pt-3">
          <p className="mb-2 text-xs font-semibold text-bark-muted">
            {scaledLabel} · quantities scaled {factor < 1 ? 'down' : 'up'}
            {unscaledCount > 0 && <> · {unscaledCount} unchanged (to taste)</>}
          </p>
          <IngredientList ingredients={scaled} compact />
        </div>
      )}
    </div>
  )
}
