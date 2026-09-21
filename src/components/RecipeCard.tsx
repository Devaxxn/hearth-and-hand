import type { Ingredient, Recipe } from '../types'
import { hueClass, skillLabel, totalTime } from '../lib/format'
import { Check, ChefHat, Clock, Heart, Martini, Plus, UtensilsCrossed, Wine } from 'lucide-react'

const MetaPill = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-bark-muted shadow-sm">
    {icon}
    {children}
  </span>
)

export const DietDot = ({ diets }: { diets: Recipe['diets'] }) => {
  if (diets.length === 0) return null
  const first = diets[0]
  const label = first === 'vegan' ? 'Vegan' : first === 'vegetarian' ? 'Vegetarian' : first === 'gluten-free' ? 'GF' : first === 'keto' ? 'Keto' : first === 'dairy-free' ? 'DF' : 'NF'
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-sage-soft/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage-deep"
      title={diets.map((d) => d).join(', ')}
    >
      {label}
      {diets.length > 1 && ` +${diets.length - 1}`}
    </span>
  )
}

export const RecipeCard = ({
  recipe,
  onOpen,
  onToggleFavorite,
  onSave,
  saved,
  favorite,
  savedLabel,
  delay = 0,
}: {
  recipe: Recipe
  onOpen: () => void
  onToggleFavorite: () => void
  /** when provided, the footer renders a Muse-style "Save to shelf + basket" action */
  onSave?: () => void
  saved?: boolean
  /** overrides recipe.favorite so generation results can display their own heart state */
  favorite?: boolean
  /** when provided, the footer renders a Shelf-style status label instead of the save action */
  savedLabel?: string
  delay?: number
}) => {
  const isFav = favorite ?? recipe.favorite
  return (
    <article
      className={`card-tile ${hueClass[recipe.hue]} animate-fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button onClick={onOpen} className="block w-full p-5 text-left" aria-label={`Open ${recipe.title}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="text-3xl leading-none" aria-hidden="true">
            {recipe.emoji}
          </span>
          <div className="flex items-center gap-1.5">
            <DietDot diets={recipe.diets} />
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  e.preventDefault()
                  onToggleFavorite()
                }
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-white/80"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} className={isFav ? 'fill-clay text-clay' : 'text-bark-muted'} />
            </span>
          </div>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-slate-deep">{recipe.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-bark-muted">{recipe.blurb}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <MetaPill icon={<Clock size={12} />}>{totalTime(recipe)}</MetaPill>
          <MetaPill icon={<ChefHat size={12} />}>{skillLabel[recipe.skill]}</MetaPill>
          <MetaPill icon={recipe.category === 'drink' ? <Martini size={12} /> : <UtensilsCrossed size={12} />}>
            {recipe.category === 'drink' ? 'Drink' : 'Food'}
          </MetaPill>
        </div>
      </button>

      {savedLabel !== undefined ? (
        <div className="flex items-center justify-between border-t border-bark/10 px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-bark-muted">
            {recipe.ingredients.length} ingredients
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sage-deep">
            <Check size={14} strokeWidth={3} /> {savedLabel}
          </span>
        </div>
      ) : onSave ? (
        <div className="flex items-center justify-between border-t border-bark/10 px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-bark-muted">
            {recipe.ingredients.length} ingredients
          </span>
          <button
            onClick={onSave}
            className={`btn-soft px-3.5 py-1.5 text-xs ${saved ? 'opacity-70' : ''}`}
            aria-label={`Add ${recipe.title} to the shelf and its ingredients to the basket`}
          >
            {saved ? <Check size={14} /> : <Plus size={14} />}
            {saved ? 'In Basket' : 'Save'}
          </button>
        </div>
      ) : null}
    </article>
  )
}

export const IngredientList = ({ ingredients, compact = false }: { ingredients: Ingredient[]; compact?: boolean }) => {
  const groups = new Map<string, Ingredient[]>()
  for (const i of ingredients) {
    const arr = groups.get(i.category) ?? []
    arr.push(i)
    groups.set(i.category, arr)
  }
  return (
    <div className="space-y-4">
      {[...groups.entries()].map(([cat, items]) => (
        <div key={cat}>
          {!compact && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">{catLabel(cat)}</p>}
          <ul className="space-y-1.5">
            {items.map((i, idx) => (
              <li key={`${i.name}-${idx}`} className="flex items-baseline gap-2 text-[15px] leading-snug">
                <span className="w-24 shrink-0 text-right font-bold text-sage-deep">{i.quantity}</span>
                <span className="text-bark">
                  {i.name}
                  {i.note && <span className="text-bark-muted"> — {i.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const catLabel = (cat: string) =>
  cat === 'produce' ? 'Produce' : cat === 'dairy' ? 'Dairy' : cat === 'pantry' ? 'Pantry' : cat === 'spirits' ? 'Spirits & Liquids' : 'Other'

export const PairingRow = ({ pairing }: { pairing: Recipe['pairings'][number] }) => {
  const icon =
    pairing.kind === 'wine' ? <Wine size={15} /> : pairing.kind === 'cocktail' ? <Martini size={15} /> : pairing.kind === 'beer' ? '🍺' : pairing.kind === 'side' ? '🥖' : '🫖'
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-bark/10 bg-white/60 p-3.5">
      <span className="mt-0.5 text-sage-deep">{icon}</span>
      <div>
        <p className="text-sm font-bold text-slate-deep">{pairing.name}</p>
        <p className="text-xs leading-relaxed text-bark-muted">{pairing.note}</p>
      </div>
    </div>
  )
}
