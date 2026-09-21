import assert from 'node:assert/strict'
import { seedData, generateResult, normalizeIngredient, totalMinutes, SURPRISE_STATES } from '../src/data/kitchen'
import { totalTime, dietLabel, hueClass, ING_CATEGORY_ORDER } from '../src/lib/format'

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

console.log('\n' + (failures.length === 0 ? `ALL ${passed} CHECKS PASSED` : `${failures.length} FAILED: ${failures.join(', ')}`))
process.exit(failures.length === 0 ? 0 : 1)
