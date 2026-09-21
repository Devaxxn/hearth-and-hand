import { useEffect, useState } from 'react'

const KEY = 'hearth-hand:theme'

export type Theme = 'light' | 'dark'

const apply = (t: Theme) => {
  document.documentElement.classList.toggle('dark', t === 'dark')
  // keep the Android/OS chrome in sync
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#1c1a17' : '#f6f1e7')
}

/** Theme state persisted to localStorage; falls back to the OS preference on first run. */
export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* storage unavailable */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    apply(theme)
    try { localStorage.setItem(KEY, theme) } catch { /* storage unavailable */ }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}
