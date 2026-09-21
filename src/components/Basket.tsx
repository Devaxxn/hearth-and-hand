import { useState } from 'react'
import type { IngredientCategory, ShoppingItem } from '../types'
import { ING_CATEGORY_LABEL, ING_CATEGORY_ORDER, CATEGORY_EMOJI } from '../lib/format'
import { useStore } from '../store/useStore'
import { Check, Plus, Trash2, X } from 'lucide-react'

export const Basket = () => {
  const { data, addManualItem, toggleBasketItem, removeBasketItem, clearChecked, clearBasket } = useStore()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<IngredientCategory>('produce')
  const [confirmClear, setConfirmClear] = useState(false)

  const items = data.basket
  const uncheckedCount = items.filter((i) => !i.checked).length
  const checkedCount = items.length - uncheckedCount

  const grouped = ING_CATEGORY_ORDER.map((cat) => ({
    cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const submit = () => {
    if (!name.trim()) return
    addManualItem(name, category)
    setName('')
  }

  return (
    <div>
      {/* Manual add */}
      <section className="rounded-3xl border border-bark/10 bg-white/60 p-4 md:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-bark-muted">Add item manually</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            className="field flex-1"
            placeholder="e.g. olive oil, bay leaves…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            aria-label="Item name"
          />
          <select className="field sm:w-44" value={category} onChange={(e) => setCategory(e.target.value as IngredientCategory)} aria-label="Aisle">
            {ING_CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>{ING_CATEGORY_LABEL[c]}</option>
            ))}
          </select>
          <button onClick={submit} className="btn-primary px-5 py-2.5 text-sm" disabled={!name.trim()}>
            <Plus size={16} /> Add
          </button>
        </div>
      </section>

      {/* Summary bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bark-muted">
          {uncheckedCount} to buy{checkedCount > 0 ? ` · ${checkedCount} in the cart` : ''}
        </p>
        <div className="flex gap-2">
          {checkedCount > 0 && (
            <button onClick={clearChecked} className="btn-soft px-3.5 py-1.5 text-xs">
              <Check size={13} /> Clear crossed off
            </button>
          )}
          {items.length > 0 && (
            <button onClick={() => setConfirmClear(true)} className="btn-soft px-3.5 py-1.5 text-xs text-clay">
              <Trash2 size={13} /> Empty list
            </button>
          )}
        </div>
      </div>

      {/* Grouped list */}
      {items.length === 0 ? (
        <div className="shelf-wood mt-3 rounded-3xl border border-bark/10 p-12 text-center">
          <p className="text-4xl">🧺</p>
          <p className="mt-3 font-display text-lg font-semibold text-slate-deep">Your basket is empty</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-bark-muted">
            Open any saved recipe and tap <strong>“Add Ingredients to Basket”</strong> — everything lands here, sorted by aisle.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          {grouped.map(({ cat, items: group }) => (
            <section key={cat} className="rounded-3xl border border-bark/10 bg-white/55 p-4 md:p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-slate-deep">
                <span aria-hidden="true">{CATEGORY_EMOJI[cat]}</span>
                {ING_CATEGORY_LABEL[cat]}
                <span className="ml-auto rounded-full bg-sage-soft/50 px-2.5 py-0.5 text-[11px] font-bold text-sage-deep">
                  {group.filter((i) => !i.checked).length} left
                </span>
              </h3>
              <ul className="mt-3 space-y-1">
                {group.map((item) => (
                  <BasketRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleBasketItem(item.id)}
                    onRemove={() => removeBasketItem(item.id)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Clear-all confirm */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-deep/40 p-6 backdrop-blur-sm" onClick={() => setConfirmClear(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-cream p-6 shadow-2xl animate-pop" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl font-semibold text-slate-deep">Empty the whole basket?</p>
            <p className="mt-2 text-sm text-bark-muted">All {items.length} items — checked and unchecked — will be cleared.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmClear(false)} className="btn-soft flex-1 py-2.5 text-sm">Never mind</button>
              <button
                onClick={() => { clearBasket(); setConfirmClear(false) }}
                className="flex-1 rounded-full bg-clay py-2.5 text-sm font-bold text-cream transition hover:brightness-110"
              >
                Empty it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const BasketRow = ({ item, onToggle, onRemove }: { item: ShoppingItem; onToggle: () => void; onRemove: () => void }) => (
  <li className="group flex items-center gap-3 rounded-xl px-1.5 py-2 transition-colors hover:bg-bark/[0.04]">
    <button
      onClick={onToggle}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
        item.checked ? 'border-sage-deep bg-sage-deep text-cream' : 'border-bark/25 bg-white hover:border-sage'
      }`}
      aria-label={item.checked ? `Mark ${item.name} as still needed` : `Mark ${item.name} as picked up`}
      aria-pressed={item.checked}
    >
      {item.checked && <Check size={14} strokeWidth={3} />}
    </button>
    <button onClick={onToggle} className="flex-1 text-left">
      <span className={`block text-[15px] font-semibold leading-tight ${item.checked ? 'text-bark-muted line-through' : 'text-bark'}`}>
        {item.name}
      </span>
      {item.recipeTitle && (
        <span className="text-[11px] font-semibold text-bark-muted">for {item.recipeTitle}</span>
      )}
    </button>
    <button
      onClick={onRemove}
      className="rounded-full p-1.5 text-bark-muted opacity-0 transition hover:bg-clay/10 hover:text-clay group-hover:opacity-100 md:opacity-60"
      aria-label={`Remove ${item.name}`}
    >
      <X size={15} />
    </button>
  </li>
)
