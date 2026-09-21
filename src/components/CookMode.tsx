import { useEffect, useMemo, useRef, useState } from 'react'
import type { Recipe } from '../types'
import { totalTime } from '../lib/format'
import { Check, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react'

const PROGRESS_KEY = 'hearth-hand:cook-progress'

export const CookMode = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => {
  const [done, setDone] = useState<boolean[]>(() => recipe.steps.map(() => false))
  const [celebrate, setCelebrate] = useState(false)

  const key = `${PROGRESS_KEY}:${recipe.id}`
  const [current, setCurrent] = useState(0)

  // restore progress per-recipe (session-scoped convenience)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key)
      if (raw) {
        const arr = JSON.parse(raw) as boolean[]
        if (Array.isArray(arr) && arr.length === recipe.steps.length) {
          setDone(arr)
          setCurrent(Math.max(arr.findIndex((d) => !d), 0))
          setCelebrate(arr.every(Boolean))
        }
      }
    } catch { /* noop */ }
  }, [key, recipe.steps.length])

  const persist = (arr: boolean[]) => {
    try { sessionStorage.setItem(key, JSON.stringify(arr)) } catch { /* noop */ }
  }

  const completed = useMemo(() => done.filter(Boolean).length, [done])

  // ref mirror of `done` so rapid same-tick taps (before React re-renders)
  // never base their computation on a stale snapshot
  const doneRef = useRef(done)
  doneRef.current = done

  const toggle = (i: number) => {
    const next = doneRef.current.map((d, j) => (j === i ? !d : d))
    doneRef.current = next
    setDone(next)
    persist(next)
    const nextUndone = next.findIndex((d) => !d)
    if (nextUndone !== -1) setCurrent(nextUndone)
    setCelebrate(next.every(Boolean))
  }

  const reset = () => {
    const cleared = recipe.steps.map(() => false)
    doneRef.current = cleared
    setDone(cleared)
    persist(cleared)
    setCurrent(0)
    setCelebrate(false)
  }

  // keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(c + 1, recipe.steps.length - 1))
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(c - 1, 0))
    }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose, recipe.steps.length])

  const pct = recipe.steps.length === 0 ? 0 : Math.round((completed / recipe.steps.length) * 100)

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-deep text-cream" role="dialog" aria-modal="true" aria-label={`Cook mode: ${recipe.title}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 md:px-8" style={{ borderBottom: '1px solid rgba(246,241,231,0.08)' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-cream/80 transition hover:bg-cream/10" aria-label="Exit cook mode">
          <X size={17} /> Exit
        </button>
        <div className="text-center">
          <p className="font-display text-base font-semibold">{recipe.emoji} {recipe.title}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/50">{recipe.category === 'drink' ? 'Mix Mode' : 'Cook Mode'} · {totalTime(recipe)}</p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-cream/80 transition hover:bg-cream/10" aria-label="Reset progress">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-cream/10">
        <div className="h-full rounded-r-full bg-gradient-to-r from-sage to-butter transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-8 md:px-8">
          {/* All steps, tap to complete */}
          <ol className="space-y-4">
            {recipe.steps.map((s, i) => {
              const isDone = done[i]
              const isCurrent = i === current && !isDone
              return (
                <li key={i}>
                  <button
                    onClick={() => toggle(i)}
                    data-done={isDone}
                    className={`cook-step flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition-all duration-300 ${
                      isCurrent ? 'border-sage/70 bg-cream/10 shadow-lg' : 'border-cream/10 bg-cream/[0.04]'
                    } ${isDone ? 'opacity-70' : ''}`}
                    aria-pressed={isDone}
                    aria-label={`Step ${i + 1}: mark ${isDone ? 'incomplete' : 'complete'}`}
                  >
                    <span
                      className="cook-box mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-cream/25 font-display text-sm font-bold transition-all"
                      style={{ background: isDone ? 'var(--color-sage-deep)' : 'transparent', borderColor: isDone ? 'var(--color-sage-deep)' : undefined }}
                    >
                      {isDone ? <Check size={18} /> : i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="cook-text block text-[17px] font-semibold leading-relaxed md:text-xl" style={{ color: isDone ? 'rgba(246,241,231,0.45)' : '#f6f1e7', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {s.text}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Celebration */}
          {celebrate && (
            <div className="mt-8 rounded-3xl border border-butter/40 bg-butter/10 p-8 text-center animate-pop">
              <p className="text-4xl">{recipe.category === 'drink' ? '🥂' : '🍽️'}</p>
              <p className="mt-3 font-display text-2xl font-semibold text-butter">
                {recipe.category === 'drink' ? 'Pour and enjoy!' : 'Dinner is served!'}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream/70">
                Every step complete — the hearth is warm and the glass is full. Well done, chef.
              </p>
              <button onClick={reset} className="btn-soft mt-5 px-5 py-2.5 text-sm" style={{ background: 'rgba(246,241,231,0.12)', color: '#f6f1e7' }}>
                <RotateCcw size={15} /> Run it again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom pager */}
      <div className="flex items-center justify-between px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8" style={{ borderTop: '1px solid rgba(246,241,231,0.08)' }}>
        <button
          onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          disabled={current === 0}
          className="flex items-center gap-1.5 rounded-full border border-cream/15 px-4 py-2.5 text-sm font-bold transition hover:bg-cream/10 disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/50">
          Step {Math.min(current + 1, recipe.steps.length)} of {recipe.steps.length} · {completed} done
        </p>
        <button
          onClick={() => setCurrent((c) => Math.min(c + 1, recipe.steps.length - 1))}
          disabled={current >= recipe.steps.length - 1}
          className="flex items-center gap-1.5 rounded-full border border-cream/15 px-4 py-2.5 text-sm font-bold transition hover:bg-cream/10 disabled:opacity-30"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
