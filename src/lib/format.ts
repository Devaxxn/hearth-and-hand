import type { Diet, Recipe, RecipeHue, Skill } from '../types'
import type { IngredientCategory } from '../types'

export const hueClass: Record<RecipeHue, string> = {
  cream: 'hue-cream',
  sage: 'hue-sage',
  clay: 'hue-clay',
  slate: 'hue-slate',
  butter: 'hue-butter',
}

export const skillLabel: Record<Skill, string> = {
  easy: 'Easy',
  medium: 'Medium',
  advanced: 'Advanced',
}

export const dietLabel: Record<Diet, string> = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  'gluten-free': 'Gluten-Free',
  keto: 'Keto',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
}

export const ING_CATEGORY_LABEL: Record<string, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  pantry: 'Pantry & Dry Goods',
  spirits: 'Spirits & Liquids',
  other: 'Other',
}

export const ING_CATEGORY_ORDER: IngredientCategory[] = ['produce', 'dairy', 'pantry', 'spirits', 'other']

export const totalTime = (r: Recipe): string => {
  const m = r.prepMinutes + r.cookMinutes
  if (m === 0) return 'No-cook'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest === 0 ? `${h} hr` : `${h} hr ${rest} min`
}

export const OCCASION_LABEL: Record<string, string> = {
  everyday: 'Everyday',
  'dinner-party': 'Dinner Party',
  brunch: 'Brunch',
  'cozy-night-in': 'Cozy Night In',
}

export const CATEGORY_EMOJI: Record<string, string> = {
  produce: '🥬',
  dairy: '🥛',
  pantry: '🫙',
  spirits: '🥃',
  other: '🧺',
}
