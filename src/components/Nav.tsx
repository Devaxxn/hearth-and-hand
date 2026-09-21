import type { LucideIcon } from 'lucide-react'
import { Flame, LibraryBig, ShoppingBasket } from 'lucide-react'

export type Route = 'muse' | 'shelf' | 'basket'

interface NavDef {
  id: Route
  label: string
  icon: LucideIcon
}

const NAV: NavDef[] = [
  { id: 'muse', label: 'Muse', icon: Flame },
  { id: 'shelf', label: 'My Shelf', icon: LibraryBig },
  { id: 'basket', label: 'Basket', icon: ShoppingBasket },
]

export const LogoMark = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="14" fill="#f6f1e7" />
    <rect x="4" y="4" width="56" height="56" rx="11" fill="#f6f1e7" stroke="#e5dcc8" strokeWidth="1" />
    <path d="M22 14v10c0 3 4.5 4.4 4.5 8v18" fill="none" stroke="#8a9b7c" strokeWidth="4" strokeLinecap="round" />
    <path d="M26.5 27.5c2.5-2.5 8-2.5 10 1" fill="none" stroke="#8a9b7c" strokeWidth="4" strokeLinecap="round" />
    <circle cx="41" cy="33" r="7.5" fill="#c47a5e" />
    <rect x="39.5" y="14" width="3" height="15" rx="1.5" fill="#6b7280" transform="rotate(35 41 14)" />
  </svg>
)

export const BottomNav = ({ route, onNavigate, basketCount }: { route: Route; onNavigate: (r: Route) => void; basketCount: number }) => (
  <nav
    className="fixed inset-x-0 bottom-0 z-40 border-t border-bark/10 bg-cream/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    style={{ backgroundColor: 'rgba(246, 241, 231, 0.93)' }}
  >
    <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = route === id
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 transition-colors"
            style={{ color: active ? 'var(--color-sage-deep)' : 'var(--color-bark-muted)' }}
            aria-current={active ? 'page' : undefined}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {id === 'basket' && basketCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-cream">
                  {basketCount > 9 ? '9+' : basketCount}
                </span>
              )}
            </span>
            <span className={`text-[11px] font-bold tracking-wide ${active ? '' : 'font-semibold'}`}>{label}</span>
            {active && <span className="absolute -top-[7px] h-1 w-8 rounded-full bg-sage" />}
          </button>
        )
      })}
    </div>
  </nav>
)

export const SideRail = ({ route, onNavigate, basketCount }: { route: Route; onNavigate: (r: Route) => void; basketCount: number }) => (
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-bark/10 bg-parchment/70 px-5 py-7 backdrop-blur md:flex">
    <div className="mb-9 flex items-center gap-3">
      <LogoMark size={44} />
      <div>
        <p className="font-display text-lg font-semibold leading-tight text-slate-deep">Hearth &amp; Hand</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bark-muted">Kitchen &amp; Bar</p>
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = route === id
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all ${
              active ? 'bg-sage-deep text-cream shadow-md' : 'text-bark hover:bg-sage-soft/40'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 2} />
            <span className="flex-1">{label}</span>
            {id === 'basket' && basketCount > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  active ? 'bg-cream/25 text-cream' : 'bg-clay text-cream'
                }`}
              >
                {basketCount > 9 ? '9+' : basketCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
    <div className="mt-auto rounded-2xl bg-sage-soft/40 p-4">
      <p className="font-display text-sm font-semibold text-sage-deep">From the pantry</p>
      <p className="mt-1 text-xs leading-relaxed text-bark-muted">
        “The kitchen is a workshop; the bar, a library. Take your time in both.”
      </p>
    </div>
  </aside>
)

export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="mb-5 flex items-center gap-3 pt-2 md:pt-0">
    <div className="md:hidden">
      <LogoMark size={38} />
    </div>
    <div>
      <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-slate-deep md:text-4xl">{title}</h1>
      <p className="text-[13px] font-medium text-bark-muted md:text-sm">{subtitle}</p>
    </div>
  </header>
)
