import { useEffect, useState } from 'react'
import type { IngredientCategory, Recipe } from '../types'
import { dietLabel, ING_CATEGORY_LABEL, skillLabel, totalTime } from '../lib/format'
import { useStore } from '../store/useStore'
import { IngredientList, PairingRow } from './RecipeCard'
import { CookMode } from './CookMode'
import {
  Clock, ChefHat, Heart, ListChecks, Pencil, Play, ShoppingBasket, Sparkles, Trash2, Users, X,
} from 'lucide-react'

export const RecipeDetail = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => {
  const { data, saveRecipe, toggleFavorite, removeRecipe, addIngredientsToBasket } = useStore()
  const [editing, setEditing] = useState(false)
  const [editKey, setEditKey] = useState(0)
  const [cooking, setCooking] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addedToast, setAddedToast] = useState(false)

  // live follow the stored version while editing elsewhere
  const live = data.recipes.find((r) => r.id === recipe.id) ?? recipe

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !cooking) onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose, cooking])

  const added = data.basket.some((i) => i.recipeTitle === live.title && !i.checked)

  const toast = () => {
    setAddedToast(true)
    window.setTimeout(() => setAddedToast(false), 2200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-cream" role="dialog" aria-modal="true" aria-label={live.title}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-bark/10 bg-cream/92 px-4 py-3 backdrop-blur md:px-8">
        <button onClick={onClose} className="btn-soft px-3.5 py-2 text-xs" aria-label="Back to shelf">
          <X size={15} /> Close
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (data.recipes.some((r) => r.id === live.id)) toggleFavorite(live.id)
              else saveRecipe({ ...live, favorite: true })
            }}
            className="btn-soft px-3 py-2"
            aria-label={live.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} className={live.favorite ? 'fill-clay text-clay' : ''} />
          </button>
          <button
            onClick={() => {
              setEditing((e) => !e)
              setEditKey((k) => k + 1)
            }}
            className="btn-soft px-3.5 py-2 text-xs"
          >
            <Pencil size={15} /> {editing ? 'Done' : 'Edit'}
          </button>
          <button onClick={() => setConfirmDelete(true)} className="btn-soft px-3 py-2 text-clay" aria-label="Delete recipe">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-deep/40 p-6 backdrop-blur-sm" onClick={() => setConfirmDelete(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-cream p-6 shadow-2xl animate-pop" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl font-semibold text-slate-deep">Remove from the shelf?</p>
            <p className="mt-2 text-sm text-bark-muted">
              “{live.title}” will be gone for good — the Muse can always rewrite it, though.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="btn-soft flex-1 py-2.5 text-sm">Keep it</button>
              <button
                onClick={() => { removeRecipe(live.id); onClose() }}
                className="flex-1 rounded-full bg-clay py-2.5 text-sm font-bold text-cream transition hover:brightness-110"
              >
                Remove
              </button>
            </div>
            </div>
        </div>
      )}

      <article className="mx-auto max-w-3xl px-4 pb-28 pt-6 md:px-0">
        <span className="text-5xl">{live.emoji}</span>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-deep md:text-[42px]">{live.title}</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-bark-muted">{live.blurb}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="meta"><Clock size={13} /> {totalTime(live)}</span>
          <span className="meta"><ChefHat size={13} /> {skillLabel[live.skill]}</span>
          <span className="meta"><Users size={13} /> {live.servings}</span>
          {live.category === 'drink' && live.glassware && <span className="meta">🥃 {live.glassware}</span>}
          {live.diets.map((d) => (
            <span key={d} className="meta" style={{ background: 'rgba(201, 212, 189, 0.5)', color: 'var(--color-sage-deep)' }}>{dietLabel[d]}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setCooking(true)} className="btn-primary px-6 py-3 text-sm">
            <Play size={15} /> {live.category === 'drink' ? 'Start Mixing' : 'Start Cooking'}
          </button>
          <button
            onClick={() => { addIngredientsToBasket(live); toast() }}
            className="btn-soft px-5 py-3 text-sm"
            disabled={added}
          >
            <ShoppingBasket size={15} /> {added ? 'Added to Basket' : 'Add Ingredients to Basket'}
          </button>
        </div>
        {addedToast && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-deep px-4 py-1.5 text-xs font-bold text-cream animate-pop">
            <ListChecks size={13} /> Added to your shopping basket
          </p>
        )}

        {/* Muse note */}
        {live.museNote && (
          <aside className="mt-8 rounded-2xl border border-butter/40 bg-butter/15 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-butter-ink">
              <Sparkles size={13} /> Muse note
            </p>
            <p className="mt-1.5 text-sm italic leading-relaxed text-bark">{live.museNote}</p>
          </aside>
        )}

        {/* Ingredients + steps */}
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <section>
            <h3 className="font-display text-xl font-semibold text-slate-deep">Ingredients</h3>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-bark-muted">for {live.servings.toLowerCase()}</p>
            <IngredientList ingredients={live.ingredients} />
          </section>
          <section>
            <h3 className="font-display text-xl font-semibold text-slate-deep">{live.category === 'drink' ? 'Method' : 'Instructions'}</h3>
            <ol className="mt-4 space-y-4">
              {live.steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="stepnum">{i + 1}</span>
                  <p className="pt-0.5 text-[15px] leading-relaxed text-bark">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Pairings */}
        {live.pairings.length > 0 && (
          <section className="mt-10">
            <h3 className="font-display text-xl font-semibold text-slate-deep">Pairings &amp; suggestions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {live.pairings.map((p, i) => (
                <PairingRow key={i} pairing={p} />
              ))}
            </div>
          </section>
        )}

        {/* Editor */}
        {editing && <RecipeEditor key={editKey} recipe={live} onSaved={() => setEditing(false)} />}
      </article>

      {cooking && <CookMode recipe={live} onClose={() => setCooking(false)} />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

const RecipeEditor = ({ recipe, onSaved }: { recipe: Recipe; onSaved: () => void }) => {
  const { saveRecipe } = useStore()
  const [draft, setDraft] = useState(recipe)

  useEffect(() => setDraft(recipe), [recipe])

  const patch = (p: Partial<Recipe>) => setDraft((d) => ({ ...d, ...p }))

  const setIngredient = (idx: number, p: Partial<Recipe['ingredients'][number]>) =>
    setDraft((d) => ({ ...d, ingredients: d.ingredients.map((i, j) => (j === idx ? { ...i, ...p } : i)) }))

  const setStep = (idx: number, text: string) =>
    setDraft((d) => ({ ...d, steps: d.steps.map((s, i) => (i === idx ? { text } : s)) }))

  const save = () => {
    saveRecipe(draft)
    onSaved()
  }

  return (
    <section className="mt-10 rounded-3xl border border-bark/12 bg-white/60 p-5 md:p-7 animate-fade-up">
      <h3 className="font-display text-xl font-semibold text-slate-deep">Edit recipe</h3>

      <label className="block mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Title</label>
      <input className="field mt-1.5" value={draft.title} onChange={(e) => patch({ title: e.target.value })} />

      <label className="block mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Blurb</label>
      <textarea className="field mt-1.5 min-h-20" value={draft.blurb} onChange={(e) => patch({ blurb: e.target.value })} />

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Prep (min)</label>
          <input type="number" className="field mt-1.5" value={draft.prepMinutes} onChange={(e) => patch({ prepMinutes: Number(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Cook (min)</label>
          <input type="number" className="field mt-1.5" value={draft.cookMinutes} onChange={(e) => patch({ cookMinutes: Number(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Servings</label>
          <input className="field mt-1.5" value={draft.servings} onChange={(e) => patch({ servings: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Emoji</label>
          <input className="field mt-1.5" value={draft.emoji} onChange={(e) => patch({ emoji: e.target.value.slice(0, 4) })} />
        </div>
      </div>

      {/* Ingredients editor */}
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Ingredients</p>
      <div className="mt-2 space-y-2">
        {draft.ingredients.map((i, idx) => (
          <div key={idx} className="grid grid-cols-[80px_1fr_110px] gap-2">
            <input className="field !py-2 text-sm" value={i.quantity} placeholder="qty" onChange={(e) => setIngredient(idx, { quantity: e.target.value })} />
            <input className="field !py-2 text-sm" value={i.name} placeholder="ingredient" onChange={(e) => setIngredient(idx, { name: e.target.value })} />
            <select className="field !py-2 text-sm" value={i.category} onChange={(e) => setIngredient(idx, { category: e.target.value as IngredientCategory })}>
              {(Object.keys(ING_CATEGORY_LABEL) as IngredientCategory[]).map((c) => (
                <option key={c} value={c}>{ING_CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={() => setDraft((d) => ({ ...d, ingredients: [...d.ingredients, { quantity: '', name: '', category: 'pantry' }] }))}
          className="btn-soft px-4 py-2 text-xs"
        >
          + Add ingredient
        </button>
      </div>

      {/* Steps editor */}
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Steps</p>
      <div className="mt-2 space-y-2">
        {draft.steps.map((s, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="stepnum mt-1">{idx + 1}</span>
            <textarea className="field min-h-16 flex-1 text-sm" value={s.text} onChange={(e) => setStep(idx, e.target.value)} />
            <button
              onClick={() => setDraft((d) => ({ ...d, steps: d.steps.filter((_, i) => i !== idx) }))}
              className="rounded-full p-2 text-bark-muted hover:bg-bark/5 hover:text-clay"
              aria-label={`Delete step ${idx + 1}`}
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setDraft((d) => ({ ...d, steps: [...d.steps, { text: '' }] }))}
          className="btn-soft px-4 py-2 text-xs"
        >
          + Add step
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={save} className="btn-primary px-6 py-2.5 text-sm">Save changes</button>
        <button onClick={onSaved} className="btn-soft px-5 py-2.5 text-sm">Cancel</button>
      </div>
    </section>
  )
}
