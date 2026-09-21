import type { Ingredient } from '../types'

/* ------------------------------------------------------------------ */
/* Servings label parsing                                              */
/* ------------------------------------------------------------------ */

/** "Serves 4" → 4 · "Makes 6" → 6 · "1 drink" → 1 · no number → 2 */
export const parseServings = (label: string): number => {
  const m = label.match(/(\d+(?:\.\d+)?)/)
  if (!m) return 2
  return Math.max(1, Math.round(parseFloat(m[1])))
}

/* ------------------------------------------------------------------ */
/* Quantity parsing                                                    */
/* ------------------------------------------------------------------ */

const NUM = String.raw`(\d+(?:\.\d+)?)`
const FRAC = String.raw`(?:(\d+)\s*\/\s*(\d+))`
const QUANTITY_RE = new RegExp(`^${NUM}?\\s*${FRAC}?\\s*([a-zA-Z]*)$`)

export interface ParsedQuantity {
  amount: number
  unit: string
}

/**
 * Parses recipe quantities: "2" · "2 tbsp" · "3/4 oz" · "1 1/2 cups" · "8".
 * Returns null for non-scalable entries like "to taste".
 */
export const parseQuantity = (quantity: string): ParsedQuantity | null => {
  const m = quantity.trim().match(QUANTITY_RE)
  if (!m) return null
  const whole = m[1] ? parseFloat(m[1]) : 0
  const frac = m[2] && m[3] ? parseInt(m[2], 10) / parseInt(m[3], 10) : 0
  if (!m[1] && !(m[2] && m[3])) return null
  return { amount: whole + frac, unit: (m[4] ?? '').toLowerCase() }
}

/* ------------------------------------------------------------------ */
/* Quantity formatting                                                 */
/* ------------------------------------------------------------------ */

// units that measure, so fractions make kitchen sense (1/8 snap)
const MEASURE_UNITS = new Set([
  'tbsp', 'tsp', 'oz', 'cup', 'cups', 'lb', 'pinch', 'pinches', 'dash', 'dashes',
  'splash', 'splashes', 'qt', 'pt', 'stick', 'sticks',
])
// units that count discrete things, so round to whole numbers
const COUNT_UNITS = new Set([
  'clove', 'cloves', 'leaf', 'leaves', 'slice', 'slices', 'sprig', 'sprigs',
  'can', 'cans', 'handful', 'handfuls', 'strip', 'strips', 'bottle', 'bottles',
  'wedge', 'wedges', 'ear', 'ears', 'bunch', 'bunches', 'piece', 'pieces',
  'drink', 'drinks', 'serving', 'servings', 'square', 'squares',
])
// never pluralized
const INVARIABLE_UNITS = new Set(['tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'qt', 'pt', 'gal'])

const EIGHTHS: Record<number, string> = {
  1: '1/8', 2: '1/4', 3: '3/8', 4: '1/2', 5: '5/8', 6: '3/4', 7: '7/8',
}

/** 1.75 → "1 3/4" · 0.5 → "1/2" · 6 → "6" (snapped to eighths) */
export const formatAmount = (x: number): string => {
  const snapped = Math.round(x * 8) / 8
  let whole = Math.floor(snapped + 1e-9)
  let rem = Math.round((snapped - whole) * 8)
  if (rem === 8) { whole += 1; rem = 0 }
  if (whole === 0 && rem === 0) return '0'
  const parts: string[] = []
  if (whole > 0) parts.push(String(whole))
  if (rem > 0) parts.push(EIGHTHS[rem] ?? String(rem / 8))
  return parts.join(' ')
}

/** 1.25 cups → "1 1/4 cups" · 1 clove → "1 clove" · 3 cloves → "3 cloves" */
export const formatQuantity = (amount: number, unit: string): string => {
  let display: string
  // the number we show also drives pluralization — never the raw amount,
  // or 1.25 → "1" would print as "1 strips"
  let displayAmount: number
  if (MEASURE_UNITS.has(unit)) {
    const snapped = Math.max(1 / 8, Math.round(amount * 8) / 8)
    displayAmount = snapped
    display = snapped < 1 / 8 ? '< 1/8' : formatAmount(snapped)
  } else if (COUNT_UNITS.has(unit)) {
    displayAmount = Math.max(1, Math.round(amount))
    display = String(displayAmount)
  } else if (unit) {
    displayAmount = Math.max(1, Math.round(amount)) // grams/ml etc.
    display = String(displayAmount)
  } else {
    displayAmount = Math.max(1 / 8, Math.round(amount * 8) / 8)
    display = formatAmount(displayAmount)
  }
  return display + (unit ? ` ${pluralizeUnit(unit, displayAmount)}` : '')
}

const PLURAL: Record<string, string> = {
  cup: 'cups', clove: 'cloves', slice: 'slices', leaf: 'leaves', sprig: 'sprigs',
  pinch: 'pinches', can: 'cans', handful: 'handfuls', strip: 'strips',
  dash: 'dashes', splash: 'splashes', bottle: 'bottles', wedge: 'wedges',
  stick: 'sticks', ear: 'ears', bunch: 'bunches', piece: 'pieces',
  drink: 'drinks', serving: 'servings', square: 'squares',
}
const SINGULAR: Record<string, string> = Object.fromEntries(
  Object.entries(PLURAL).map(([s, p]) => [p, s])
)

const pluralizeUnit = (unit: string, amount: number): string => {
  if (INVARIABLE_UNITS.has(unit)) return unit
  if (amount > 1.05) return PLURAL[unit] ?? unit
  // exactly one (or rounded down to one): always the singular form,
  // even if the source data carried a plural unit like "1 cups"
  return SINGULAR[unit] ?? unit
}

/* ------------------------------------------------------------------ */
/* Scaling                                                             */
/* ------------------------------------------------------------------ */

/** Scales every scalable ingredient by `factor`; unscalable ("to taste") pass through. */
export const scaleIngredients = (ingredients: Ingredient[], factor: number): Ingredient[] => {
  if (factor === 1) return ingredients
  return ingredients.map((i) => {
    const parsed = parseQuantity(i.quantity)
    if (!parsed) return i
    return { ...i, quantity: formatQuantity(parsed.amount * factor, parsed.unit) }
  })
}

/** Rewrites a servings label for a new count, fixing plurals: ("1 drink", 2) → "2 drinks" */
export const scaleServingsLabel = (base: string, target: number): string => {
  const m = base.match(/(\d+(?:\.\d+)?)/)
  if (!m) return base
  const n = parseFloat(m[1])
  let out = base.replace(m[1], String(target))
  const last = (out.match(/([a-zA-Z]+)\s*$/) ?? [])[1]?.toLowerCase() ?? ''
  if (n === 1 && target !== 1) out = out.replace(/([a-zA-Z]+)\s*$/, PLURAL[last] ?? last)
  if (n !== 1 && target === 1) out = out.replace(/([a-zA-Z]+)\s*$/, SINGULAR[last] ?? last)
  return out
}
