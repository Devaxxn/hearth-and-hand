import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react'
import { formatCountdown, playChime, primeAudio, buzz } from '../lib/timer'

interface TimerState {
  /** seconds remaining; authoritative while paused */
  remaining: number
  running: boolean
  /** epoch ms the countdown reaches zero, valid while running */
  deadline: number
  label: string
  total: number
}

export const TIMER_EVENT = 'hearth:timer'

/** Start the app-wide kitchen timer from anywhere (Cook Mode step chips, etc.). */
export const startKitchenTimer = (seconds: number, label: string): void => {
  window.dispatchEvent(new CustomEvent(TIMER_EVENT, { detail: { seconds, label } }))
}

/**
 * A floating, app-wide cook timer. Lives above every screen — including Cook
 * Mode — so a countdown keeps running while you browse. Durations from the
 * open recipe's steps arrive via props; anything else can trigger it via
 * startKitchenTimer(). Quick presets cover the rest.
 */
export const KitchenTimer = ({ durations }: { durations: number[] }) => {
  const [state, setState] = useState<TimerState | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [finished, setFinished] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const firedRef = useRef(false)

  // tick while running
  useEffect(() => {
    if (!state?.running) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [state?.running])

  const start = useCallback((seconds: number, label: string) => {
    primeAudio()
    firedRef.current = false
    setFinished(false)
    setState({ remaining: seconds, running: true, deadline: Date.now() + seconds * 1000, label, total: seconds })
    setNow(Date.now())
    setExpanded(true)
  }, [])

  // external triggers (cook-mode step chips) + auto-minimize when a new timer starts elsewhere
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ seconds: number; label: string }>).detail
      if (d && Number.isFinite(d.seconds) && d.seconds > 0) start(Math.round(d.seconds), d.label)
    }
    window.addEventListener(TIMER_EVENT, h)
    return () => window.removeEventListener(TIMER_EVENT, h)
  }, [start])

  // fire the alarm exactly once when the deadline passes
  useEffect(() => {
    if (!state?.running) return
    if (now >= state.deadline && !firedRef.current) {
      firedRef.current = true
      setState((s) => (s ? { ...s, running: false, remaining: 0 } : s))
      setFinished(true)
      setExpanded(true)
      playChime()
      buzz()
    }
  }, [now, state])

  const pause = () => setState((s) => (s?.running ? { ...s, running: false, remaining: Math.max(0, (s.deadline - Date.now()) / 1000) } : s))
  const resume = () => {
    primeAudio()
    setState((s) => (s && !s.running && s.remaining > 0 ? { ...s, running: true, deadline: Date.now() + s.remaining * 1000 } : s))
  }
  const clear = () => { setState(null); setFinished(false); setExpanded(false) }
  const restart = () => { if (state) start(state.total, state.label) }

  const remaining = state ? (state.running ? Math.max(0, (state.deadline - now) / 1000) : state.remaining) : 0
  const pct = state && state.total > 0 ? Math.max(0, Math.min(100, (1 - remaining / state.total) * 100)) : 0

  const presets = [
    { label: '1 min', s: 60 },
    { label: '5 min', s: 300 },
    { label: '10 min', s: 600 },
    { label: '15 min', s: 900 },
  ]

  // nothing running and panel closed → small launcher so the feature is discoverable
  if (!state && !expanded) {
    return (
      <div className="fixed right-4 bottom-[5.4rem] z-[65] md:bottom-[5.4rem] md:right-6">
        <button
          onClick={() => setExpanded(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-deep/15 bg-white/85 shadow-lg backdrop-blur transition hover:scale-105 dark:!border-[var(--border-warm)] dark:!bg-[rgba(43,39,32,0.9)] dark:!text-[var(--color-butter)]"
          aria-label="Open kitchen timer"
          title="Kitchen timer"
        >
          <Timer size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed right-4 bottom-[5.4rem] z-[65] md:bottom-[5.4rem] md:right-6">
      {/* Collapsed pill */}
      {!expanded && state && (
        <button
          onClick={() => setExpanded(true)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 shadow-lg backdrop-blur transition ${
            finished ? 'animate-pop border-butter bg-butter/90 !text-slate-deep' : 'border-slate-deep/20 bg-slate-deep/90 !text-cream'
          }`}
          aria-label={`Kitchen timer: ${state.label}, ${formatCountdown(remaining)} ${state.running ? 'running' : 'paused'} — expand`}
        >
          <Timer size={15} />
          <span className="font-display text-sm font-bold tabular-nums">{formatCountdown(remaining)}</span>
          {!state.running && !finished && <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">paused</span>}
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div
          className="w-[17rem] overflow-hidden rounded-3xl border border-slate-deep/20 bg-slate-deep/95 shadow-2xl backdrop-blur animate-pop"
          style={{ color: '#f6f1e7' }}
          role="region"
          aria-label="Kitchen timer"
        >
          <div className="flex items-center justify-between px-4 pt-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cream/60">
              <Timer size={12} /> Kitchen timer
            </p>
            <button
              onClick={() => setExpanded(false)}
              className="rounded-full p-1 text-cream/60 transition hover:bg-cream/10 hover:text-cream"
              aria-label="Minimize timer"
            >
              <X size={14} />
            </button>
          </div>

          {state ? (
            <>
              <div className="px-5 pt-3 text-center">
                <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-cream/55" title={state.label}>{state.label}</p>
                <p
                  className={`mt-1 font-display text-[2.6rem] font-semibold leading-none tabular-nums ${finished ? 'animate-pop !text-butter' : ''}`}
                  role="timer"
                  aria-live={remaining <= 10 && state.running ? 'assertive' : 'off'}
                >
                  {finished ? "Time's up!" : formatCountdown(remaining)}
                </p>
                {finished && <p className="mt-1.5 text-xs text-cream/70">Take it off the heat — you made it.</p>}
              </div>

              {/* progress bar */}
              <div className="mx-5 mt-3 h-1.5 overflow-hidden rounded-full bg-cream/10">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-linear"
                  style={{ width: `${pct}%`, background: finished ? 'var(--color-butter)' : 'linear-gradient(90deg, #7f9470, #e9b45c)' }}
                />
              </div>

              <div className="flex items-center justify-center gap-2.5 px-5 py-4">
                <button
                  onClick={state.running ? pause : finished ? restart : resume}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/12 transition hover:bg-cream/20"
                  aria-label={state.running ? 'Pause timer' : finished ? 'Restart timer' : 'Resume timer'}
                >
                  {state.running ? <Pause size={18} /> : finished ? <RotateCcw size={17} /> : <Play size={18} />}
                </button>
                <button onClick={restart} className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/8 transition hover:bg-cream/16" aria-label="Restart timer">
                  <RotateCcw size={15} />
                </button>
                <button onClick={clear} className="ml-1 rounded-full px-3 py-1.5 text-xs font-bold text-cream/60 transition hover:bg-cream/10 hover:text-cream">
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 pb-4 pt-3">
              <p className="px-1 pb-2.5 text-xs leading-relaxed text-cream/60">
                {durations.length > 0 ? 'Timers from this recipe:' : 'Set a quick timer:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {durations.slice(0, 4).map((s) => (
                  <button key={s} onClick={() => start(s, stepLabel(s))} className="rounded-full border border-cream/20 px-3 py-1.5 text-xs font-bold transition hover:bg-cream/10">
                    {stepLabel(s)}
                  </button>
                ))}
                {presets.map((p) => (
                  <button key={p.s} onClick={() => start(p.s, p.label)} className="rounded-full border border-cream/20 px-3 py-1.5 text-xs font-bold transition hover:bg-cream/10">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** "3 min" / "1 hr 15 min" — compact label for a duration in seconds */
const stepLabel = (s: number): string => {
  if (s < 3600) return `${Math.round(s / 60)} min`
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  return m ? `${h} hr ${m} min` : `${h} hr`
}
