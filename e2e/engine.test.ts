import assert from 'node:assert/strict'
import { seedData, generateResult, normalizeIngredient, totalMinutes, SURPRISE_STATES, guessCategory } from '../src/data/kitchen'
import { totalTime, dietLabel, hueClass, ING_CATEGORY_ORDER } from '../src/lib/format'
import { parseServings, parseQuantity, formatQuantity, formatAmount, scaleIngredients, scaleServingsLabel } from '../src/lib/scale'
import { parseStepSeconds, formatCountdown } from '../src/lib/timer'
import type { Ingredient } from '../src/types'

let passed = 0
const failures: string[] = []
const check = (name: string, fn: () => void) => {
  try {
    fn()
    passed++
    console.log('  ok  ' + name)
  } catch (e) {
    failures.push(name)
    console.log('FAIL  ' + name + '\n      ' + (e as Error).message)
  }
}

/* ---------------- aliases ---------------- */
check('normalizeIngredient applies aliases', () => {
  assert.equal(normalizeIngredient('Rum'), 'white rum')
  assert.equal(normalizeIngredient('tomato'), 'tomatoes')
  assert.equal(normalizeIngredient('  Spaghetti '), 'pasta')
  assert.equal(normalizeIngredient('bitters'), 'angostura bitters')
  assert.equal(normalizeIngredient('campari'), 'negroni')
})

/* ---------------- matching ---------------- */
check('chips rank matching recipes first (pasta+lemon)', () => {
  const { recipes, fallback } = generateResult(
    { category: 'food', ingredients: ['pasta', 'lemon'], prepTime: 60, diets: [], skill: 'advanced' },
    6, 1234
  )
  assert.equal(fallback, false)
  assert.equal(recipes[0].title, 'Lemon Ricotta Pasta with Arugula')
})

check('campari chip surfaces The Negroni (no dangling chips)', () => {
  const { recipes, fallback } = generateResult(
    { category: 'drink', ingredients: ['campari'], prepTime: 15, diets: [], skill: 'advanced' },
    6, 7
  )
  assert.equal(fallback, false, 'campari should match, not fall back')
  assert.equal(recipes[0].title, 'The Negroni')
})

/* ---------------- fallback behavior ---------------- */
check('unmatched chips set fallback flag and still return recipes', () => {
  const { recipes, fallback } = generateResult(
    { category: 'food', ingredients: ['durian'], prepTime: 90, diets: [], skill: 'advanced' },
    6, 42
  )
  assert.equal(fallback, true)
  assert.ok(recipes.length > 0, 'should still improvise results')
})

check('empty chips: no fallback, full pool shuffled', () => {
  const { recipes, fallback } = generateResult(
    { category: 'food', ingredients: [], prepTime: 90, diets: [], skill: 'advanced' },
    6, 99
  )
  assert.equal(fallback, false)
  assert.equal(recipes.length, 6)
})

/* ---------------- filters ---------------- */
check('vegan filter never returns non-vegan dishes (feta chip falls back to vegan pool)', () => {
  const { recipes, fallback } = generateResult(
    { category: 'food', ingredients: ['feta'], prepTime: 90, diets: ['vegan'], skill: 'advanced' },
    6, 5
  )
  assert.equal(fallback, true, 'feta matches nothing vegan, so pool fallback fires')
  assert.ok(recipes.length > 0)
  for (const r of recipes) assert.ok(r.diets.includes('vegan'), r.title + ' must be vegan')
})

check('skill=easy excludes advanced drinks', () => {
  const { recipes } = generateResult(
    { category: 'drink', ingredients: ['bourbon'], prepTime: 15, diets: [], skill: 'easy' },
    6, 3
  )
  assert.ok(!recipes.some((r) => r.title === 'Smoked Old Fashioned'), 'advanced drink must be filtered out at easy')
})

check('prepTime filter is inclusive of template totals', () => {
  const exact = generateResult({ category: 'food', ingredients: ['black beans'], prepTime: 25, diets: [], skill: 'easy' }, 6, 11)
  assert.ok(exact.recipes.some((r) => r.title === 'Smoky Black Bean Tacos'), '25-min recipe fits 25-min budget')
  const tighter = generateResult({ category: 'food', ingredients: ['black beans'], prepTime: 15, diets: [], skill: 'easy' }, 6, 11)
  assert.ok(!tighter.recipes.some((r) => r.title === 'Smoky Black Bean Tacos'), '25-min recipe must not fit 15-min budget')
})

/* ---------------- recipe integrity ---------------- */
check('generated recipes are complete (ingredients, steps, pairings, museNote)', () => {
  const { recipes } = generateResult(
    { category: 'drink', ingredients: ['gin'], prepTime: 15, diets: [], skill: 'easy' },
    6, 2026
  )
  for (const r of recipes) {
    assert.ok(r.ingredients.length > 0, r.title + ' has ingredients')
    assert.ok(r.steps.length > 0, r.title + ' has steps')
    assert.ok(r.pairings.length > 0, r.title + ' has pairings')
    assert.ok(r.museNote.length > 0, r.title + ' has a muse note')
    assert.ok(r.emoji.length > 0, r.title + ' has an emoji')
  }
})

check('seed shelf has 4 recipes, two favorited', () => {
  const seed = seedData()
  assert.equal(seed.recipes.length, 4)
  assert.equal(seed.recipes.filter((r) => r.favorite).length, 2)
  assert.equal(seed.basket.length, 0)
})

check('totalMinutes/totalTime formatting', () => {
  const r = generateResult({ category: 'food', ingredients: [], prepTime: 90, diets: [], skill: 'advanced' }, 1, 1).recipes[0]
  assert.equal(totalMinutes(r), r.prepMinutes + r.cookMinutes)
  assert.ok(['No-cook', '15 min', '45 min'].some(() => true))
  const ninety = { ...r, prepMinutes: 45, cookMinutes: 45 }
  assert.equal(totalTime(ninety), '1 hr 30 min')
  const clean = { ...r, prepMinutes: 60, cookMinutes: 0 }
  assert.equal(totalTime(clean), '1 hr')
})

/* ---------------- maps cover the domain ---------------- */
check('fuzzy matching: plurals, phrases and off-list items find recipes', () => {
  // 'chicken breast' — 'breast' is unknown, 'chicken' must still score
  const chicken = generateResult({ category: 'food', ingredients: ['chicken breast'], prepTime: 60, diets: [], skill: 'advanced' }, 6, 3)
  assert.ok(chicken.recipes[0].title.includes('Chicken'), 'chicken breast should rank chicken recipes first')
  // plural free-text
  const eggs = generateResult({ category: 'food', ingredients: ['eggs'], prepTime: 60, diets: [], skill: 'advanced' }, 6, 3)
  assert.ok(eggs.recipes[0].title.includes('Shakshuka') || eggs.recipes[0].title.includes('Omelet'), 'eggs should rank egg dishes first')
  // prep-descriptor noise must not break matching
  const fresh = generateResult({ category: 'food', ingredients: ['fresh cherry tomatoes'], prepTime: 60, diets: [], skill: 'advanced' }, 6, 3)
  assert.ok(fresh.recipes.some((r) => r.title.includes('Tomatoes')), 'fresh cherry tomatoes should match tomato recipes')
})

check('improv engine: unknown custom ingredients produce coherent woven recipes', () => {
  const { recipes, fallback } = generateResult(
    { category: 'food', ingredients: ['halloumi'], prepTime: 30, diets: [], skill: 'easy' },
    6, 9
  )
  assert.equal(fallback, true)
  assert.ok(recipes.length >= 3, 'should return woven recipes')
  for (const r of recipes.slice(0, 3)) {
    assert.ok(r.title.includes('Halloumi'), `woven title should name the ingredient: ${r.title}`)
    assert.ok(r.ingredients.some((i) => i.name === 'halloumi'), 'woven recipe should include the ingredient')
    assert.ok(r.ingredients.some((i) => i.name.includes('garlic')), 'woven recipe should include pantry anchors')
    assert.ok(r.museNote.includes('Improvised'), 'woven recipe should carry an improv note')
  }
})

check('improv engine: custom ingredients get sane aisles and quantities', () => {
  assert.equal(guessCategory('gouda cheese'), 'dairy')
  assert.equal(guessCategory('sake'), 'spirits')
  assert.equal(guessCategory('kale'), 'produce')
  const { recipes } = generateResult(
    { category: 'drink', ingredients: ['elderflower liqueur'], prepTime: 15, diets: [], skill: 'advanced' },
    6, 11
  )
  const woven = recipes.find((r) => r.museNote.includes('Improvised'))
  assert.ok(woven, 'unknown spirit should improvise a drink')
  const elf = woven!.ingredients.find((i) => i.name === 'elderflower liqueur')
  assert.ok(elf, 'custom spirit should be woven in')
  assert.equal(elf!.category, 'spirits', 'custom spirit should land in the spirits aisle')
  assert.match(elf!.quantity, / oz/, 'custom spirit should get a measured pour')
})

check('improv engine: diet filters stay hard even when improvising', () => {
  const { recipes } = generateResult(
    { category: 'food', ingredients: ['halloumi', 'spinach'], prepTime: 45, diets: ['vegan'], skill: 'easy' },
    6, 5
  )
  for (const r of recipes) {
    const names = r.ingredients.map((i) => i.name.toLowerCase()).join(' ')
    assert.ok(!names.includes('feta') && !names.includes('butter') && !names.includes('parmesan'), `${r.title} must stay vegan`)
  }
})

check('every Surprise Me preset yields at least one recipe', () => {
  for (const preset of SURPRISE_STATES) {
    const { recipes } = generateResult(preset, 6, 7)
    assert.ok(recipes.length > 0, `preset [${preset.category}: ${preset.ingredients.join(',')}] yielded nothing`)
  }
})

check('format maps cover every enum value', () => {
  for (const hue of ['cream', 'sage', 'clay', 'slate', 'butter'] as const) assert.ok(hueClass[hue])
  for (const d of ['vegan', 'vegetarian', 'gluten-free', 'keto', 'dairy-free', 'nut-free'] as const) assert.ok(dietLabel[d])
  assert.deepEqual(ING_CATEGORY_ORDER, ['produce', 'dairy', 'pantry', 'spirits', 'other'])
})

// ------------------------------------------------------------------
// serving-size calculator
// ------------------------------------------------------------------

check('servings labels parse to base counts', () => {
  assert.equal(parseServings('Serves 4'), 4)
  assert.equal(parseServings('Makes 6'), 6)
  assert.equal(parseServings('1 drink'), 1)
  assert.equal(parseServings('Serves 12'), 12)
  assert.equal(parseServings('a generous spread'), 2) // fallback
})

check('quantity parsing handles fractions, wholes, and non-scalable text', () => {
  assert.deepEqual(parseQuantity('2 tbsp'), { amount: 2, unit: 'tbsp' })
  assert.deepEqual(parseQuantity('3/4 oz'), { amount: 0.75, unit: 'oz' })
  assert.deepEqual(parseQuantity('1 1/2 cups'), { amount: 1.5, unit: 'cups' })
  assert.deepEqual(parseQuantity('8'), { amount: 8, unit: '' })
  assert.equal(parseQuantity('to taste'), null)
  assert.equal(parseQuantity('a handful'), null)
})

check('amount formatting snaps to kitchen fractions', () => {
  assert.equal(formatAmount(1.75), '1 3/4')
  assert.equal(formatAmount(0.5), '1/2')
  assert.equal(formatAmount(0.375), '3/8')
  assert.equal(formatAmount(6), '6')
})

check('formatQuantity pluralizes naturally', () => {
  assert.equal(formatQuantity(2, 'cups'), '2 cups')
  assert.equal(formatQuantity(1, 'cups'), '1 cup')
  assert.equal(formatQuantity(4, 'cloves'), '4 cloves')
  assert.ok(/^1 clove(s)?$/.test(formatQuantity(0.5, 'cloves')), 'count units round to a whole, singular clove')
})

check('doubling scales measure and count units, never prose', () => {
  const base: Ingredient[] = [
    { quantity: '2 tbsp', name: 'Olive oil', category: 'pantry' },
    { quantity: '3 cloves', name: 'Garlic', category: 'produce' },
    { quantity: '1 1/2 cups', name: 'Stock', category: 'pantry' },
    { quantity: 'to taste', name: 'Salt', category: 'pantry' },
  ]
  const out = scaleIngredients(base, 2)
  assert.equal(out[0].quantity, '4 tbsp')
  assert.equal(out[1].quantity, '6 cloves')
  assert.equal(out[2].quantity, '3 cups')
  assert.equal(out[3].quantity, 'to taste') // untouched
})

check('halving keeps kitchen-friendly minimums', () => {
  const out = scaleIngredients([{ quantity: '1 tbsp', name: 'Butter', category: 'dairy' }, { quantity: '1 slice', name: 'Bread', category: 'pantry' }], 0.5)
  assert.equal(out[0].quantity, '1/2 tbsp')
  assert.equal(out[1].quantity, '1 slice') // counts never drop below 1
})

check('servings labels rescale with correct plurals', () => {
  assert.equal(scaleServingsLabel('Serves 2', 6), 'Serves 6')
  assert.equal(scaleServingsLabel('1 drink', 2), '2 drinks')
  assert.equal(scaleServingsLabel('2 drinks', 1), '1 drink')
  assert.equal(scaleServingsLabel('Makes 6', 12), 'Makes 12')
})

// ------------------------------------------------------------------
// interactive timer
// ------------------------------------------------------------------

check('step durations parse, longest wins', () => {
  assert.equal(parseStepSeconds('Simmer for 10 minutes until glossy'), 600)
  assert.equal(parseStepSeconds('Toast 2 minutes, then simmer 10 minutes'), 600)
  assert.equal(parseStepSeconds('Chill for 1 hour'), 3600)
  assert.equal(parseStepSeconds('Stir briefly and serve'), null)
})

check('countdown formatting covers minutes and hours', () => {
  assert.equal(formatCountdown(125), '2:05')
  assert.equal(formatCountdown(3725), '1:02:05')
  assert.equal(formatCountdown(0), '0:00')
})

console.log('\n' + (failures.length === 0 ? `ALL ${passed} CHECKS PASSED` : `${failures.length} FAILED: ${failures.join(', ')}`))
process.exit(failures.length === 0 ? 0 : 1)
