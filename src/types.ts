export type Category = 'food' | 'drink'
export type Skill = 'easy' | 'medium' | 'advanced'
export type Diet = 'vegan' | 'vegetarian' | 'gluten-free' | 'keto' | 'dairy-free' | 'nut-free'
export type Occasion = 'everyday' | 'dinner-party' | 'brunch' | 'cozy-night-in'

export type ShelfTag =
  | 'comfort'
  | 'fresh'
  | 'indulgent'
  | 'light'
  | 'smoky'
  | 'herbal'
  | 'citrusy'
  | 'spiced'
  | 'no-cook'
  | 'one-pan'

export type IngredientCategory = 'produce' | 'dairy' | 'pantry' | 'spirits' | 'other'

export interface Ingredient {
  quantity: string
  name: string
  category: IngredientCategory
  note?: string
}

export interface Pairing {
  kind: 'wine' | 'cocktail' | 'beer' | 'zero-proof' | 'side'
  name: string
  note: string
}

export interface Step {
  text: string
}

export interface Recipe {
  id: string
  title: string
  category: Category
  blurb: string
  emoji: string
  hue: RecipeHue
  servings: string
  prepMinutes: number
  cookMinutes: number
  skill: Skill
  diets: Diet[]
  occasion: Occasion
  tags: ShelfTag[]
  ingredients: Ingredient[]
  steps: Step[]
  pairings: Pairing[]
  glassware?: string
  favorite: boolean
  createdAt: number
  museNote: string
}

export type RecipeHue = 'sage' | 'clay' | 'cream' | 'slate' | 'butter'

export interface ShoppingItem {
  id: string
  name: string
  category: IngredientCategory
  note?: string
  checked: boolean
  recipeTitle?: string
}

export interface MuseState {
  category: Category
  ingredients: string[]
  prepTime: number
  diets: Diet[]
  skill: Skill
}

export interface AppData {
  version: 1
  recipes: Recipe[]
  basket: ShoppingItem[]
  muse: MuseState
  onboarded: boolean
}

export const DEFAULT_MUSE: MuseState = {
  category: 'food',
  ingredients: [],
  prepTime: 30,
  diets: [],
  skill: 'easy',
}
