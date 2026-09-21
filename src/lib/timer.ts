/* ------------------------------------------------------------------ */
/* Step duration parsing                                               */
/* ------------------------------------------------------------------ */

const DURATION_RE = /(\d+)\s*(hours?|hrs?|h\b|minutes?|mins?|min\b|seconds?|secs?)/gi

/**
 * Longest duration mentioned in a step, in seconds — the meaningful cook time
 * when a step says "toast 2 minutes, then simmer 10 minutes". Null if untimed.
 */
export const parseStepSeconds = (text: string): number | null => {
  let max = 0
  for (const m of text.matchAll(DURATION_RE)) {
    const n = parseInt(m[1], 10)
    const u = m[2].toLowerCase()
    const s = u.startsWith('h') ? n * 3600 : u.startsWith('m') ? n * 60 : n
    if (s > max) max = s
  }
  return max > 0 ? max : null
}

/* ------------------------------------------------------------------ */
/* Countdown formatting                                                */
/* ------------------------------------------------------------------ */

/** 125 → "2:05" · 3725 → "1:02:05" */
export const formatCountdown = (totalSeconds: number): string => {
  const s = Math.max(0, Math.ceil(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

/* ------------------------------------------------------------------ */
/* Alarm chime (WebAudio, no assets — created on the user's gesture)   */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null

/** Call from a user gesture (e.g. the Start button) so the alarm is allowed to sound later. */
export const primeAudio = (): void => {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctx) audioCtx = new Ctx()
    }
    void audioCtx?.resume()
  } catch { /* audio unavailable — silent alarm */ }
}

/** Three soft ascending notes; safe no-op if audio is unavailable or blocked. */
export const playChime = (): void => {
  try {
    if (!audioCtx || audioCtx.state !== 'running') return
    const t0 = audioCtx.currentTime
    ;[880, 1108.73, 1318.51].forEach((freq, i) => {
      const o = audioCtx!.createOscillator()
      const g = audioCtx!.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      const at = t0 + i * 0.18
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(0.18, at + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.55)
      o.connect(g)
      g.connect(audioCtx!.destination)
      o.start(at)
      o.stop(at + 0.6)
    })
  } catch { /* never let the alarm crash the timer */ }
}

/** Kitchen-friendly haptics where supported. */
export const buzz = (): void => {
  try { navigator.vibrate?.([220, 120, 220]) } catch { /* unsupported */ }
}
