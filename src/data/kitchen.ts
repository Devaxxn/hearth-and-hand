import type { AppData, Category, Diet, Ingredient, IngredientCategory, MuseState, Pairing, Recipe, RecipeHue, ShelfTag, Skill } from '../types'
import { DEFAULT_MUSE } from '../types'

/* ------------------------------------------------------------------ */
/* Ingredient pools — chip suggestions in the Muse                     */
/* ------------------------------------------------------------------ */

export const INGREDIENT_POOL: Record<Category, string[]> = {
  food: [
    'chicken', 'ground beef', 'salmon', 'shrimp', 'eggs', 'tofu',
    'pasta', 'rice', 'potatoes', 'sweet potatoes', 'quinoa', 'tortillas',
    'tomatoes', 'garlic', 'onion', 'spinach', 'mushrooms', 'bell peppers', 'zucchini',
    'avocado', 'lemon', 'lime', 'butter', 'parmesan', 'feta', 'coconut milk',
    'chickpeas', 'black beans', 'lentils', 'broccoli', 'carrots', 'cucumber',
    'arugula', 'basil', 'cilantro', 'honey', 'peanut butter', 'miso', 'sesame oil',
  ],
  drink: [
    'gin', 'vodka', 'white rum', 'dark rum', 'whiskey', 'bourbon', 'rye',
    'tequila', 'mezcal', 'aperol', 'campari', 'triple sec', 'dry vermouth',
    'prosecco', 'lemon', 'lime', 'orange', 'grapefruit', 'mint', 'basil',
    'rosemary', 'cucumber', 'jalapeño', 'ginger beer', 'tonic', 'soda water',
    'espresso', 'simple syrup', 'honey syrup', 'angostura bitters', 'peach',
  ],
}

/* ------------------------------------------------------------------ */
/* Recipe templates                                                    */
/* ------------------------------------------------------------------ */

type Emphasis = 'start' | 'middle' | 'end'

interface TemplateStep {
  text: string
  emphasis: Emphasis
  minutes?: number
}

interface RecipeTemplate {
  title: string
  category: Category
  emoji: string
  hue: RecipeHue
  blurb: string
  servings: string
  prep: number
  cook: number
  skill: Skill
  diets: Diet[]
  occasion: 'everyday' | 'dinner-party' | 'brunch' | 'cozy-night-in'
  tags: ShelfTag[]
  keywords: string[]
  ingredients: Ingredient[]
  steps: TemplateStep[]
  pairings: Pairing[]
  glassware?: string
  museNote: string
}

const ing = (quantity: string, name: string, category: Ingredient['category'], note?: string): Ingredient => ({
  quantity,
  name,
  category,
  note,
})

const FOOD: RecipeTemplate[] = [
  {
    title: 'Skillet Chicken with Blistered Tomatoes',
    category: 'food',
    emoji: '🍗',
    hue: 'clay',
    blurb: 'Golden thighs, jammy tomatoes and a spoonful of basil — a one-pan weeknight that tastes like Sunday.',
    servings: 'Serves 2',
    prep: 15,
    cook: 25,
    skill: 'medium',
    diets: ['gluten-free'],
    occasion: 'everyday',
    tags: ['comfort', 'one-pan'],
    keywords: ['chicken', 'tomatoes', 'garlic', 'basil', 'lemon', 'butter', 'parmesan'],
    ingredients: [
      ing('1 lb', 'bone-in chicken thighs', 'pantry'),
      ing('2 cups', 'cherry tomatoes', 'produce'),
      ing('4 cloves', 'garlic', 'produce', 'smashed'),
      ing('2 tbsp', 'olive oil', 'pantry'),
      ing('1 tbsp', 'butter', 'dairy'),
      ing('1/2', 'lemon', 'produce'),
      ing('1 handful', 'basil leaves', 'produce'),
      ing('1 oz', 'parmesan', 'dairy', 'shaved'),
    ],
    steps: [
      { text: 'Pat the chicken dry and season generously with salt and pepper.', emphasis: 'start' },
      { text: 'Sear skin-side down in olive oil over medium heat until deeply golden, about 8 minutes.', emphasis: 'middle', minutes: 8 },
      { text: 'Flip, add garlic and butter, and spoon the foaming butter over the chicken.', emphasis: 'middle', minutes: 3 },
      { text: 'Scatter in the tomatoes and transfer the skillet to a 400°F oven until the chicken reads 165°F.', emphasis: 'middle', minutes: 14 },
      { text: 'Rest 5 minutes, then finish with lemon, basil and shaved parmesan.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Oaked Chardonnay', note: 'Buttery enough to meet the pan juices, crisp enough for the tomatoes.' },
      { kind: 'cocktail', name: 'Basil Gimlet', note: 'Herbal and bright — echoes the basil without sweetness.' },
    ],
    museNote: 'Don’t crowd the pan — blistered tomatoes need their own corner to burst.',
  },
  {
    title: 'Miso Butter Noodles',
    category: 'food',
    emoji: '🍜',
    hue: 'sage',
    blurb: 'Six ingredients, one pot of starchy noodle water, and the glossiest comfort bowl in your rotation.',
    servings: 'Serves 2',
    prep: 10,
    cook: 10,
    skill: 'easy',
    diets: ['vegetarian'],
    occasion: 'cozy-night-in',
    tags: ['comfort', 'indulgent'],
    keywords: ['pasta', 'miso', 'butter', 'garlic', 'sesame oil', 'eggs'],
    ingredients: [
      ing('8 oz', 'ramen or egg noodles', 'pantry'),
      ing('2 tbsp', 'white miso', 'pantry'),
      ing('3 tbsp', 'butter', 'dairy'),
      ing('2 cloves', 'garlic', 'produce', 'grated'),
      ing('2', 'scallions', 'produce', 'thin sliced'),
      ing('1 tsp', 'sesame oil', 'pantry'),
      ing('2', 'soft-boiled eggs', 'dairy', 'optional'),
    ],
    steps: [
      { text: 'Boil the noodles, saving a full cup of the starchy water before draining.', emphasis: 'start' },
      { text: 'Melt butter with garlic in the empty pot until it smells sweet, about 1 minute.', emphasis: 'middle', minutes: 1 },
      { text: 'Off heat, whisk in miso, then loosen with splashes of noodle water into a silky sauce.', emphasis: 'middle' },
      { text: 'Toss the noodles through the sauce with sesame oil until every strand shines.', emphasis: 'middle' },
      { text: 'Top with scallions and a jammy egg; crack pepper over everything.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'zero-proof', name: 'Iced jasmine tea', note: 'Floral and clean against the salty butter.' },
      { kind: 'cocktail', name: 'Espresso Martini', note: 'For cozy-night-in energy after the bowl is empty.' },
    ],
    museNote: 'Miso loses its soul at a boil — always whisk it in off the heat.',
  },
  {
    title: 'Lemon Ricotta Pasta with Arugula',
    category: 'food',
    emoji: '🍋',
    hue: 'butter',
    blurb: 'A no-red-sauce weeknight hero: whipped lemony ricotta clinging to twirly pasta.',
    servings: 'Serves 2',
    prep: 12,
    cook: 12,
    skill: 'easy',
    diets: ['vegetarian'],
    occasion: 'everyday',
    tags: ['fresh', 'light'],
    keywords: ['pasta', 'lemon', 'parmesan', 'basil', 'arugula', 'garlic', 'olive oil'],
    ingredients: [
      ing('8 oz', 'rigatoni or shells', 'pantry'),
      ing('3/4 cup', 'ricotta', 'dairy'),
      ing('1', 'lemon', 'produce', 'zest + juice'),
      ing('1/2 cup', 'parmesan', 'dairy', 'grated'),
      ing('2 cups', 'arugula', 'produce'),
      ing('1 clove', 'garlic', 'produce'),
      ing('2 tbsp', 'olive oil', 'pantry'),
      ing('6 leaves', 'basil', 'produce'),
    ],
    steps: [
      { text: 'Boil the pasta in well-salted water; reserve a mug of pasta water.', emphasis: 'start' },
      { text: 'Stir ricotta, lemon zest, juice, parmesan and olive oil into a loose cream.', emphasis: 'middle' },
      { text: 'Toss hot pasta with the ricotta cream and splashes of pasta water until glossy.', emphasis: 'middle' },
      { text: 'Fold in arugula so it just wilts in the steam.', emphasis: 'middle' },
      { text: 'Serve in warm bowls with torn basil and a final zip of lemon.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Pinot Grigio', note: 'Lean citrus keeps the ricotta from feeling heavy.' },
      { kind: 'side', name: 'Charred sourdough', note: 'Rub with raw garlic and olive oil for saucing duty.' },
    ],
    museNote: 'Zest before you juice — you can’t zest a squeezed lemon.',
  },
  {
    title: 'Charred Broccoli & Tahini Grain Bowl',
    category: 'food',
    emoji: '🥦',
    hue: 'sage',
    blurb: 'Charred florets, warm quinoa and a lemon-tahini drizzle that you will want on everything.',
    servings: 'Serves 2',
    prep: 15,
    cook: 20,
    skill: 'easy',
    diets: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['fresh', 'light'],
    keywords: ['broccoli', 'quinoa', 'chickpeas', 'lemon', 'avocado', 'garlic'],
    ingredients: [
      ing('1 cup', 'quinoa', 'pantry', 'rinsed'),
      ing('1 head', 'broccoli', 'produce', 'in florets'),
      ing('1 cup', 'cooked chickpeas', 'pantry', 'patted dry'),
      ing('3 tbsp', 'tahini', 'pantry'),
      ing('1', 'lemon', 'produce'),
      ing('1', 'avocado', 'produce'),
      ing('2 cloves', 'garlic', 'produce', 'grated'),
      ing('2 tbsp', 'olive oil', 'pantry'),
    ],
    steps: [
      { text: 'Simmer the quinoa with 2 cups water until fluffy, about 15 minutes.', emphasis: 'start', minutes: 15 },
      { text: 'Roast broccoli and chickpeas at 425°F with olive oil until deeply charred at the tips.', emphasis: 'middle', minutes: 18 },
      { text: 'Whisk tahini, lemon, garlic and cold water into a pourable drizzle.', emphasis: 'middle' },
      { text: 'Build the bowls on quinoa, then fan the avocado over the top.', emphasis: 'middle' },
      { text: 'Flood with tahini sauce and crack black pepper generously.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'zero-proof', name: 'Cucumber mint cooler', note: 'Cool and green — the bowl’s quieter twin.' },
      { kind: 'wine', name: 'Grüner Veltliner', note: 'White pepper notes love charred brassicas.' },
    ],
    museNote: 'Dry the chickpeas well — damp chickpeas steam instead of crisping.',
  },
  {
    title: 'Smoky Black Bean Tacos',
    category: 'food',
    emoji: '🌮',
    hue: 'clay',
    blurb: 'Charred-edge beans, quick-pickled onion, and lime — a 25-minute taco night that needs nothing else.',
    servings: 'Makes 6',
    prep: 10,
    cook: 15,
    skill: 'easy',
    diets: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['smoky', 'fresh'],
    keywords: ['black beans', 'tortillas', 'onion', 'bell peppers', 'lime', 'avocado', 'cilantro'],
    ingredients: [
      ing('1 can', 'black beans', 'pantry', 'drained'),
      ing('6', 'corn tortillas', 'pantry'),
      ing('1', 'red onion', 'produce', 'thin sliced'),
      ing('1', 'bell pepper', 'produce', 'sliced'),
      ing('2', 'limes', 'produce'),
      ing('1 tsp', 'smoked paprika', 'pantry'),
      ing('1 tsp', 'cumin', 'pantry'),
      ing('1', 'avocado', 'produce'),
      ing('1 handful', 'cilantro', 'produce'),
    ],
    steps: [
      { text: 'Soak the onion in the juice of one lime with a pinch of salt while you cook.', emphasis: 'start' },
      { text: 'Sear the beans dry in a hot skillet until they crackle, then add oil, paprika and cumin.', emphasis: 'middle', minutes: 6 },
      { text: 'Char the peppers in the same pan until blistered.', emphasis: 'middle', minutes: 5 },
      { text: 'Toast tortillas directly over the flame or in a dry pan until pliable.', emphasis: 'middle' },
      { text: 'Load up: beans, peppers, pickled onion, avocado, cilantro, and the second lime.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'cocktail', name: 'Jalapeño Margarita', note: 'Smoke meets heat — an obvious and excellent match.' },
      { kind: 'zero-proof', name: 'Watermelon agua fresca', note: 'Sweet relief for the char and spice.' },
    ],
    museNote: 'Dry-searing the beans first is where the “charred-edge” magic happens.',
  },
  {
    title: 'Sheet-Pan Gnocchi with Burst Tomatoes',
    category: 'food',
    emoji: '🥔',
    hue: 'butter',
    blurb: 'Crisp-outside, pillow-inside gnocchi — no boiling, one pan, barely any dishes.',
    servings: 'Serves 2',
    prep: 10,
    cook: 25,
    skill: 'easy',
    diets: ['vegetarian'],
    occasion: 'everyday',
    tags: ['comfort', 'one-pan'],
    keywords: ['potatoes', 'tomatoes', 'zucchini', 'garlic', 'parmesan', 'basil'],
    ingredients: [
      ing('1 lb', 'shelf-stable gnocchi', 'pantry'),
      ing('2 cups', 'cherry tomatoes', 'produce'),
      ing('1', 'zucchini', 'produce', 'half-moons'),
      ing('3 tbsp', 'olive oil', 'pantry'),
      ing('3 cloves', 'garlic', 'produce', 'smashed'),
      ing('1/2 cup', 'parmesan', 'dairy', 'grated'),
      ing('1 handful', 'basil', 'produce'),
      ing('1 pinch', 'red pepper flakes', 'pantry'),
    ],
    steps: [
      { text: 'Heat the oven to 425°F and toss gnocchi, tomatoes, zucchini, garlic and oil right on the pan.', emphasis: 'start' },
      { text: 'Roast undisturbed until the gnocchi is golden underneath, about 20 minutes.', emphasis: 'middle', minutes: 20 },
      { text: 'Smash a few tomatoes into the pan juices to make a quick sauce.', emphasis: 'middle' },
      { text: 'Shower with parmesan and pepper flakes while everything is steaming.', emphasis: 'end' },
      { text: 'Tear basil over the top and bring the pan to the table.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Sangiovese', note: 'Juicy acidity for the burst tomatoes.' },
      { kind: 'cocktail', name: 'Aperol Spritz', note: 'Bitter-orange sparkle as an appetizer in a glass.' },
    ],
    museNote: 'Skip the boiling step entirely — roasted gnocchi is a different, better food.',
  },
  {
    title: 'Bourbon-Glazed Salmon',
    category: 'food',
    emoji: '🐟',
    hue: 'slate',
    blurb: 'A sticky bourbon-honey lacquer on flaky salmon, ready faster than delivery.',
    servings: 'Serves 2',
    prep: 10,
    cook: 15,
    skill: 'medium',
    diets: ['gluten-free', 'dairy-free'],
    occasion: 'dinner-party',
    tags: ['indulgent', 'spiced'],
    keywords: ['salmon', 'honey', 'garlic', 'rice', 'bourbon'],
    ingredients: [
      ing('2 fillets', 'salmon', 'pantry', 'skin on'),
      ing('2 tbsp', 'bourbon', 'spirits'),
      ing('2 tbsp', 'honey', 'pantry'),
      ing('2 tbsp', 'soy sauce or tamari', 'pantry'),
      ing('2 cloves', 'garlic', 'produce', 'grated'),
      ing('1 tsp', 'ginger', 'produce', 'grated'),
      ing('2', 'scallions', 'produce'),
      ing('1 cup', 'steamed rice', 'pantry'),
    ],
    steps: [
      { text: 'Simmer bourbon, honey, soy, garlic and ginger into a syrupy glaze.', emphasis: 'start', minutes: 5 },
      { text: 'Sear the salmon skin-side down until the skin releases, about 5 minutes.', emphasis: 'middle', minutes: 5 },
      { text: 'Flip, paint with half the glaze, and baste for 4 more minutes.', emphasis: 'middle', minutes: 4 },
      { text: 'Rest briefly, then spoon the last of the glaze over the top.', emphasis: 'middle' },
      { text: 'Serve over rice with scallions and pan juices.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Oregon Pinot Noir', note: 'Soft tannins, red fruit — classic with lacquered fish.' },
      { kind: 'cocktail', name: 'Rye Highball', note: 'Tall, cold and clean between rich bites.' },
    ],
    museNote: 'Let the glaze get syrupy before it meets the pan — it should coat a spoon.',
  },
  {
    title: 'Sunday Beef Ragù',
    category: 'food',
    emoji: '🍝',
    hue: 'clay',
    blurb: 'A slow afternoon in a pot: dark, glossy ragù that makes the whole house smell like home.',
    servings: 'Serves 4',
    prep: 15,
    cook: 45,
    skill: 'medium',
    diets: [],
    occasion: 'dinner-party',
    tags: ['comfort', 'indulgent'],
    keywords: ['ground beef', 'tomatoes', 'onion', 'garlic', 'pasta', 'parmesan', 'carrots'],
    ingredients: [
      ing('1 lb', 'ground beef', 'pantry'),
      ing('28 oz', 'crushed tomatoes', 'pantry'),
      ing('1', 'yellow onion', 'produce', 'diced'),
      ing('1', 'carrot', 'produce', 'finely diced'),
      ing('4 cloves', 'garlic', 'produce'),
      ing('2 tbsp', 'tomato paste', 'pantry'),
      ing('12 oz', 'pappardelle', 'pantry'),
      ing('1 cup', 'parmesan', 'dairy'),
    ],
    steps: [
      { text: 'Brown the beef hard in a wide pot — you want crust, not gray — then set it aside.', emphasis: 'start', minutes: 8 },
      { text: 'Sweat onion, carrot and garlic in the beef fat until sweet and soft.', emphasis: 'middle', minutes: 8 },
      { text: 'Add tomato paste and cook until it darkens to rust.', emphasis: 'middle', minutes: 2 },
      { text: 'Return the beef with tomatoes; simmer low until the oil rises and the sauce turns brick-red.', emphasis: 'middle', minutes: 30 },
      { text: 'Toss with pappardelle and a splash of pasta water; blanket with parmesan.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Chianti Classico', note: 'Sangiovese acid cuts right through the beef.' },
      { kind: 'cocktail', name: 'Negroni', note: 'The aperitivo before the ragù is the point of Sunday.' },
    ],
    museNote: 'The ragù is done when the oil pools at the edges — that’s flavor arriving.',
  },
  {
    title: 'Shakshuka for Two',
    category: 'food',
    emoji: '🍳',
    hue: 'clay',
    blurb: 'Eggs poached in smoky pepper stew, right in the pan, with bread for mopping.',
    servings: 'Serves 2',
    prep: 10,
    cook: 25,
    skill: 'medium',
    diets: ['vegetarian', 'gluten-free'],
    occasion: 'brunch',
    tags: ['comfort', 'one-pan'],
    keywords: ['eggs', 'tomatoes', 'bell peppers', 'onion', 'garlic', 'feta', 'bread'],
    ingredients: [
      ing('4', 'eggs', 'dairy'),
      ing('28 oz', 'crushed tomatoes', 'pantry'),
      ing('1', 'red bell pepper', 'produce', 'sliced'),
      ing('1', 'onion', 'produce', 'sliced'),
      ing('3 cloves', 'garlic', 'produce'),
      ing('1 tsp', 'cumin', 'pantry'),
      ing('1 tsp', 'smoked paprika', 'pantry'),
      ing('2 oz', 'feta', 'dairy', 'crumbled'),
      ing('4 slices', 'crusty bread', 'pantry'),
    ],
    steps: [
      { text: 'Soften pepper and onion in olive oil until silky, about 10 minutes.', emphasis: 'start', minutes: 10 },
      { text: 'Add garlic and spices; bloom until fragrant.', emphasis: 'middle', minutes: 1 },
      { text: 'Pour in tomatoes and simmer until slightly thickened.', emphasis: 'middle', minutes: 10 },
      { text: 'Make four wells and crack an egg into each; cover and cook to your jam.', emphasis: 'middle', minutes: 6 },
      { text: 'Crumble feta over, then eat straight from the pan with toast.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'cocktail', name: 'Aperol Spritz', note: 'Brunch law: bitter, bubbly, orange.' },
      { kind: 'zero-proof', name: 'Mint tea', note: 'Sweet and cooling over the spice.' },
    ],
    museNote: 'Cover the pan — steam sets the whites while the yolks stay loose.',
  },
  {
    title: 'Crispy Tofu Peanut Noodles',
    category: 'food',
    emoji: '🥜',
    hue: 'sage',
    blurb: 'Cornstarch-crisped tofu tumbled through a glossy, chili-flecked peanut sauce.',
    servings: 'Serves 2',
    prep: 20,
    cook: 15,
    skill: 'medium',
    diets: ['vegan', 'vegetarian', 'dairy-free'],
    occasion: 'everyday',
    tags: ['indulgent', 'spiced'],
    keywords: ['tofu', 'peanut butter', 'noodles', 'cucumber', 'lime', 'garlic'],
    ingredients: [
      ing('14 oz', 'extra-firm tofu', 'pantry', 'pressed & cubed'),
      ing('3 tbsp', 'cornstarch', 'pantry'),
      ing('1/3 cup', 'peanut butter', 'pantry'),
      ing('2 tbsp', 'soy sauce', 'pantry'),
      ing('1 tbsp', 'rice vinegar', 'pantry'),
      ing('8 oz', 'noodles', 'pantry'),
      ing('1/2', 'cucumber', 'produce', 'julienned'),
      ing('1', 'lime', 'produce'),
      ing('2 cloves', 'garlic', 'produce', 'grated'),
      ing('1 tsp', 'chili crisp', 'pantry'),
    ],
    steps: [
      { text: 'Toss tofu cubes in cornstarch until chalky, then pan-fry in oil until golden on all sides.', emphasis: 'start', minutes: 12 },
      { text: 'Whisk peanut butter, soy, vinegar, garlic and hot water into a pourable sauce.', emphasis: 'middle' },
      { text: 'Cook noodles, drain, and rinse briefly under cool water.', emphasis: 'middle' },
      { text: 'Toss noodles with sauce, then pile on the tofu while it still crackles.', emphasis: 'middle' },
      { text: 'Finish with cucumber, lime and chili crisp.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'zero-proof', name: 'Thai iced tea', note: 'Sweet cream to calm the chili.' },
      { kind: 'cocktail', name: 'Basil Gimlet', note: 'Herbal snap against the rich peanut sauce.' },
    ],
    museNote: 'Press the tofu 10 minutes under a plate — crispness is mostly water removal.',
  },
  {
    title: 'Coconut Red Lentil Dal',
    category: 'food',
    emoji: '🍲',
    hue: 'butter',
    blurb: 'A pot of golden, coconut-swirled dal with a sizzling spice tempering poured over the top.',
    servings: 'Serves 3',
    prep: 10,
    cook: 30,
    skill: 'easy',
    diets: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    occasion: 'cozy-night-in',
    tags: ['comfort', 'spiced'],
    keywords: ['lentils', 'coconut milk', 'onion', 'garlic', 'spinach', 'rice'],
    ingredients: [
      ing('1 cup', 'red lentils', 'pantry', 'rinsed'),
      ing('1 can', 'coconut milk', 'pantry'),
      ing('1', 'onion', 'produce', 'diced'),
      ing('3 cloves', 'garlic', 'produce'),
      ing('1 tbsp', 'ginger', 'produce', 'grated'),
      ing('1 tsp', 'ground cumin', 'pantry'),
      ing('1 tsp', 'turmeric', 'pantry'),
      ing('2 cups', 'spinach', 'produce'),
      ing('1 cup', 'steamed rice', 'pantry'),
    ],
    steps: [
      { text: 'Soften onion in oil until translucent, then add garlic and ginger.', emphasis: 'start', minutes: 6 },
      { text: 'Stir in cumin and turmeric and toast until the kitchen smells like spice.', emphasis: 'middle', minutes: 1 },
      { text: 'Add lentils, coconut milk and 2 cups water; simmer until lentils collapse into velvet.', emphasis: 'middle', minutes: 25 },
      { text: 'Wilt in the spinach and season boldly with salt and lime.', emphasis: 'middle' },
      { text: 'Serve over rice with an extra swirl of coconut on top.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'zero-proof', name: 'Mango lassi', note: 'Cool and fruity beside the warm spice.' },
      { kind: 'wine', name: 'Off-dry Riesling', note: 'A little sweetness for the turmeric heat.' },
    ],
    museNote: 'Red lentils need no soaking — just a good rinse until the water runs clear.',
  },
  {
    title: 'Feta & Herb Omelet',
    category: 'food',
    emoji: '🌿',
    hue: 'sage',
    blurb: 'The 10-minute lunch: custardy eggs, salty feta and whatever herbs are on the windowsill.',
    servings: 'Serves 1',
    prep: 5,
    cook: 10,
    skill: 'easy',
    diets: ['vegetarian', 'gluten-free'],
    occasion: 'brunch',
    tags: ['fresh', 'light'],
    keywords: ['eggs', 'feta', 'spinach', 'herbs', 'bread'],
    ingredients: [
      ing('3', 'eggs', 'dairy'),
      ing('1 oz', 'feta', 'dairy', 'crumbled'),
      ing('1 handful', 'spinach or herbs', 'produce'),
      ing('1 tbsp', 'olive oil', 'pantry'),
      ing('1 slice', 'sourdough', 'pantry', 'toasted'),
    ],
    steps: [
      { text: 'Beat the eggs until completely uniform — no streaks — with a pinch of salt.', emphasis: 'start' },
      { text: 'Cook gently in olive oil, stirring in curds, until barely set and still glossy.', emphasis: 'middle', minutes: 4 },
      { text: 'Scatter feta and greens over one half while the top is still wet.', emphasis: 'middle' },
      { text: 'Fold, slide onto toast, and eat immediately.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'zero-proof', name: 'Fresh orange juice', note: 'Brunch without the queue.' },
      { kind: 'cocktail', name: 'Aperol Spritz', note: 'Because some days deserve the real thing.' },
    ],
    museNote: 'Low heat and patience — an omelet should tremble, not squeak.',
  },
  {
    title: 'Garlic Butter Shrimp Orzo',
    category: 'food',
    emoji: '🦐',
    hue: 'slate',
    blurb: 'One skillet, fifteen minutes: buttery orzo that drinks up lemony shrimp juices.',
    servings: 'Serves 2',
    prep: 10,
    cook: 15,
    skill: 'medium',
    diets: [],
    occasion: 'dinner-party',
    tags: ['indulgent', 'one-pan'],
    keywords: ['shrimp', 'orzo', 'garlic', 'butter', 'lemon', 'parmesan'],
    ingredients: [
      ing('3/4 lb', 'shrimp', 'pantry', 'peeled & deveined'),
      ing('1 cup', 'orzo', 'pantry'),
      ing('4 cloves', 'garlic', 'produce', 'sliced'),
      ing('3 tbsp', 'butter', 'dairy'),
      ing('1', 'lemon', 'produce'),
      ing('1/3 cup', 'parmesan', 'dairy'),
      ing('1 handful', 'parsley', 'produce'),
      ing('1 pinch', 'red pepper flakes', 'pantry'),
    ],
    steps: [
      { text: 'Toast the orzo dry in a slick of oil until it smells nutty.', emphasis: 'start', minutes: 2 },
      { text: 'Simmer in 2 cups stock until al dente, stirring now and then.', emphasis: 'middle', minutes: 10 },
      { text: 'Meanwhile, sizzle garlic in butter with pepper flakes just until pale gold.', emphasis: 'middle', minutes: 2 },
      { text: 'Add shrimp to the garlic butter and cook until just opaque, flipping once.', emphasis: 'middle', minutes: 3 },
      { text: 'Fold shrimp and butter into the orzo with lemon, parmesan and parsley.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Albariño', note: 'Atlantic salinity — shrimp’s best friend.' },
      { kind: 'cocktail', name: 'Grapefruit Paloma', note: 'Citrus on citrus, bubbles for lift.' },
    ],
    museNote: 'Pull the shrimp the second they curl — carryover heat finishes them.',
  },
  {
    title: 'Cacio e Pepe with Charred Broccolini',
    category: 'food',
    emoji: '🧀',
    hue: 'slate',
    blurb: 'Three ingredients doing impossibly delicious work, plus charred greens for virtue.',
    servings: 'Serves 2',
    prep: 10,
    cook: 15,
    skill: 'medium',
    diets: ['vegetarian'],
    occasion: 'cozy-night-in',
    tags: ['comfort', 'indulgent'],
    keywords: ['pasta', 'parmesan', 'black pepper', 'butter', 'broccoli'],
    ingredients: [
      ing('8 oz', 'spaghetti', 'pantry'),
      ing('1 1/2 cups', 'pecorino or parmesan', 'dairy', 'finely grated'),
      ing('2 tsp', 'black pepper', 'pantry', 'coarsely cracked'),
      ing('2 tbsp', 'butter', 'dairy'),
      ing('1 bunch', 'broccolini', 'produce'),
      ing('2 tbsp', 'olive oil', 'pantry'),
    ],
    steps: [
      { text: 'Boil spaghetti in lightly salted water — the cheese brings plenty of salt.', emphasis: 'start' },
      { text: 'Char broccolini in a screaming-hot pan with oil until blistered; salt and set aside.', emphasis: 'middle', minutes: 6 },
      { text: 'Toast cracked pepper in butter, then add a ladle of starchy pasta water to a simmer.', emphasis: 'middle', minutes: 2 },
      { text: 'Toss pasta in the peppery water, then off heat add cheese in batches until creamy.', emphasis: 'middle' },
      { text: 'Twirl into bowls with broccolini on top and more pepper.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Frascati', note: 'The Roman answer to the Roman pasta.' },
      { kind: 'cocktail', name: 'Smoked Old Fashioned', note: 'Pepper on pepper, in a good way.' },
    ],
    museNote: 'Off the heat before the cheese — heat above 140°F and it clumps instead of melting.',
  },
  {
    title: 'Honey Mustard Chicken & Potatoes',
    category: 'food',
    emoji: '🍯',
    hue: 'butter',
    blurb: 'Sticky, tangy thighs roasting over potatoes that soak up every drop of the glaze.',
    servings: 'Serves 4',
    prep: 15,
    cook: 40,
    skill: 'easy',
    diets: ['gluten-free'],
    occasion: 'everyday',
    tags: ['comfort', 'one-pan'],
    keywords: ['chicken', 'potatoes', 'honey', 'garlic', 'rosemary'],
    ingredients: [
      ing('8', 'bone-in chicken thighs', 'pantry'),
      ing('1 1/2 lb', 'baby potatoes', 'produce', 'halved'),
      ing('3 tbsp', 'honey', 'pantry'),
      ing('2 tbsp', 'dijon mustard', 'pantry'),
      ing('4 cloves', 'garlic', 'produce', 'smashed'),
      ing('4 sprigs', 'rosemary', 'produce'),
      ing('2 tbsp', 'olive oil', 'pantry'),
    ],
    steps: [
      { text: 'Whisk honey, mustard, garlic, oil and a splash of vinegar into a glaze.', emphasis: 'start' },
      { text: 'Toss potatoes with oil and salt; nestle chicken skin-side up among them on a sheet pan.', emphasis: 'middle' },
      { text: 'Roast at 425°F for 20 minutes, then brush everything with half the glaze.', emphasis: 'middle', minutes: 20 },
      { text: 'Roast 15 more minutes until lacquered and the potatoes are creamy inside.', emphasis: 'middle', minutes: 15 },
      { text: 'Rest 5 minutes with rosemary scattered over; serve straight from the pan.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Viognier', note: 'Apricot notes for the honey-mustard gloss.' },
      { kind: 'cocktail', name: 'Rum Honey Hot Toddy', note: 'Stay in the honey family all evening.' },
    ],
    museNote: 'Bone-in thighs are nearly impossible to overcook — the skin is your timer.',
  },
  {
    title: 'Greek Chopped Salad with Crispy Chickpeas',
    category: 'food',
    emoji: '🥗',
    hue: 'sage',
    blurb: 'No-cook, knife-only crunch with marinated feta and chickpeas roasted until they pop.',
    servings: 'Serves 2',
    prep: 20,
    cook: 0,
    skill: 'easy',
    diets: ['vegetarian', 'gluten-free'],
    occasion: 'brunch',
    tags: ['fresh', 'light', 'no-cook'],
    keywords: ['cucumber', 'tomatoes', 'chickpeas', 'feta', 'onion', 'olive oil', 'lemon'],
    ingredients: [
      ing('1', 'cucumber', 'produce', 'chopped'),
      ing('1 cup', 'cherry tomatoes', 'produce', 'halved'),
      ing('1 can', 'chickpeas', 'pantry', 'roasted crispy'),
      ing('4 oz', 'feta', 'dairy', 'in slabs'),
      ing('1/4', 'red onion', 'produce', 'thin sliced'),
      ing('1', 'lemon', 'produce'),
      ing('3 tbsp', 'olive oil', 'pantry'),
      ing('1 tsp', 'dried oregano', 'pantry'),
    ],
    steps: [
      { text: 'Roast chickpeas at 425°F with oil and oregano until they rattle, about 20 minutes.', emphasis: 'start', minutes: 20 },
      { text: 'Marinate the feta slabs in olive oil, lemon and oregano while they crisp.', emphasis: 'middle' },
      { text: 'Chop cucumber and tomatoes big and honest; toss with onion and salt.', emphasis: 'middle' },
      { text: 'Add warm chickpeas so the tomatoes blush slightly at the edges.', emphasis: 'middle' },
      { text: 'Top with marinated feta, pour over the oil, and eat with a spoon.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Assyrtiko', note: 'Volcanic and saline — Santorini in a glass.' },
      { kind: 'zero-proof', name: 'Sparkling lemonade', note: 'Bright and simple, like the salad.' },
    ],
    museNote: 'Salting the tomatoes 10 minutes ahead builds dressing out of nothing.',
  },
]

const DRINKS: RecipeTemplate[] = [
  {
    title: 'Smoked Old Fashioned',
    category: 'drink',
    emoji: '🥃',
    hue: 'slate',
    blurb: 'Deep caramel, orange oils and a wisp of smoke — the fireside classic, done properly.',
    servings: '1 drink',
    prep: 5,
    cook: 0,
    skill: 'advanced',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'cozy-night-in',
    tags: ['smoky', 'spiced'],
    keywords: ['bourbon', 'angostura bitters', 'orange', 'sugar cube'],
    ingredients: [
      ing('2 oz', 'bourbon', 'spirits'),
      ing('1', 'sugar cube', 'pantry'),
      ing('3 dashes', 'angostura bitters', 'pantry'),
      ing('1 strip', 'orange peel', 'produce', 'wide'),
      ing('1', 'luxardo cherry', 'pantry', 'optional'),
    ],
    steps: [
      { text: 'Muddle the sugar cube with bitters and a teaspoon of water in a mixing glass.', emphasis: 'start' },
      { text: 'Add bourbon and plenty of ice; stir 30 seconds until the glass frosts.', emphasis: 'middle', minutes: 1 },
      { text: 'Strain over one big cube in a rocks glass.', emphasis: 'middle' },
      { text: 'Express the orange peel over the surface, rub the rim, then drop it in.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Dark chocolate & smoked almonds', note: 'Bitter and salty — the classic fireside tray.' },
      { kind: 'cocktail', name: 'A second, smaller one', note: 'The best pairing for a well-built first.' },
    ],
    glassware: 'Rocks glass',
    museNote: 'Stir, never shake — clarity is the whole point of an old fashioned.',
  },
  {
    title: 'Grapefruit Paloma',
    category: 'drink',
    emoji: '🍊',
    hue: 'clay',
    blurb: 'Blushing, bittersweet and salt-rimmed — summer regardless of the weather.',
    servings: '1 drink',
    prep: 5,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['citrusy', 'fresh'],
    keywords: ['tequila', 'grapefruit', 'lime', 'simple syrup', 'soda water'],
    ingredients: [
      ing('2 oz', 'blanco tequila', 'spirits'),
      ing('2 oz', 'grapefruit juice', 'produce', 'fresh'),
      ing('1/2 oz', 'lime juice', 'produce'),
      ing('1/2 oz', 'simple syrup', 'pantry'),
      ing('2 oz', 'soda water', 'pantry'),
      ing('1 pinch', 'flaky salt', 'pantry', 'for the rim'),
    ],
    steps: [
      { text: 'Rub half the glass rim with grapefruit and dip in salt.', emphasis: 'start' },
      { text: 'Fill with ice, then pour tequila, grapefruit, lime and syrup.', emphasis: 'middle' },
      { text: 'Top with soda and stir once, gently, from the bottom.', emphasis: 'middle' },
      { text: 'Garnish with a grapefruit wedge squeezed over the drink.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Fish tacos', note: 'The Paloma’s destiny, honestly.' },
      { kind: 'zero-proof', name: 'Grapefruit soda spritz', note: 'Same sunrise, no spirits.' },
    ],
    glassware: 'Highball',
    museNote: 'Fresh grapefruit only — bottled goes flat and bitter within the hour.',
  },
  {
    title: 'Garden Gin & Tonic',
    category: 'drink',
    emoji: '🌿',
    hue: 'sage',
    blurb: 'Gin and tonic, promoted: cucumber ribbons, mint and a proper hard pour of tonic.',
    servings: '1 drink',
    prep: 4,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['fresh', 'herbal', 'no-cook'],
    keywords: ['gin', 'tonic', 'cucumber', 'mint', 'lime'],
    ingredients: [
      ing('2 oz', 'gin', 'spirits'),
      ing('4 oz', 'good tonic', 'pantry', 'chilled'),
      ing('3 slices', 'cucumber', 'produce'),
      ing('4 leaves', 'mint', 'produce', 'slapped'),
      ing('1 wedge', 'lime', 'produce'),
    ],
    steps: [
      { text: 'Pack a highball with ice to the brim — dilution is part of the drink.', emphasis: 'start' },
      { text: 'Slide cucumber down the inside walls of the glass.', emphasis: 'middle' },
      { text: 'Pour gin, then tonic down a bar spoon to keep the bubbles alive.', emphasis: 'middle' },
      { text: 'Slap the mint once and float it; squeeze the lime in and stir once.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Salted marcona almonds', note: 'Salty-soft against all that fizz.' },
      { kind: 'zero-proof', name: 'Cucumber tonic on its own', note: 'The designated driver’s G&T.' },
    ],
    glassware: 'Highball',
    museNote: 'Small-batch tonic in a newly opened bottle is the difference between fine and transcendent.',
  },
  {
    title: 'Jalapeño Margarita',
    category: 'drink',
    emoji: '🌶️',
    hue: 'clay',
    blurb: 'A controlled burn: bright lime, orange, and just enough jalapeño heat to keep things honest.',
    servings: '1 drink',
    prep: 6,
    cook: 0,
    skill: 'medium',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'dinner-party',
    tags: ['spiced', 'citrusy'],
    keywords: ['tequila', 'jalapeño', 'lime', 'cointreau', 'simple syrup'],
    ingredients: [
      ing('2 oz', 'blanco tequila', 'spirits'),
      ing('3 slices', 'jalapeño', 'produce'),
      ing('1 oz', 'lime juice', 'produce'),
      ing('3/4 oz', 'cointreau', 'spirits'),
      ing('1/2 oz', 'simple syrup', 'pantry'),
    ],
    steps: [
      { text: 'Muddle two jalapeño slices in the shaker — gently, you’re bruising not crushing.', emphasis: 'start' },
      { text: 'Add tequila, lime, cointreau and syrup with ice.', emphasis: 'middle' },
      { text: 'Shake hard 12 seconds until the tin is frostbitten.', emphasis: 'middle', minutes: 1 },
      { text: 'Double-strain into a salt-rimmed glass over fresh ice.', emphasis: 'middle' },
      { text: 'Float the last jalapeño slice for those who dare.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Smoky black bean tacos', note: 'Twin flames, best friends.' },
      { kind: 'zero-proof', name: 'Agua de jamaica', note: 'Tart hibiscus cools the burn.' },
    ],
    glassware: 'Rocks glass',
    museNote: 'Heat scales with time, not amount — taste at 30 seconds and pull the slices.',
  },
  {
    title: 'Espresso Martini',
    category: 'drink',
    emoji: '☕',
    hue: 'slate',
    blurb: 'The after-dinner engine: cold, bittersweet and crowned with a stubborn crema.',
    servings: '1 drink',
    prep: 6,
    cook: 0,
    skill: 'medium',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'dinner-party',
    tags: ['indulgent'],
    keywords: ['vodka', 'espresso', 'coffee', 'simple syrup'],
    ingredients: [
      ing('2 oz', 'vodka', 'spirits'),
      ing('1 oz', 'fresh espresso', 'pantry', 'hot'),
      ing('1/2 oz', 'coffee liqueur', 'spirits'),
      ing('1/4 oz', 'simple syrup', 'pantry'),
      ing('3', 'coffee beans', 'pantry', 'to garnish'),
    ],
    steps: [
      { text: 'Pull the espresso fresh and let it sit exactly 1 minute — hot enough for crema, cool enough to shake.', emphasis: 'start', minutes: 1 },
      { text: 'Add everything to a shaker packed with ice.', emphasis: 'middle' },
      { text: 'Shake violently 15 seconds — the foam is forced emulsion, not luck.', emphasis: 'middle', minutes: 1 },
      { text: 'Double-strain into a chilled coupe and wait for the head to set.', emphasis: 'middle' },
      { text: 'Lay three beans in the center: health, wealth, happiness.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Salted dark chocolate', note: 'Same shelf of the flavor pantry.' },
      { kind: 'cocktail', name: 'One is plenty', note: 'It’s an espresso. Respect it.' },
    ],
    glassware: 'Coupe',
    museNote: 'No fresh espresso, no espresso martini — instant coffee foam collapses.',
  },
  {
    title: 'The Negroni',
    category: 'drink',
    emoji: '🧡',
    hue: 'clay',
    blurb: 'Equal parts gin, Campari and sweet vermouth — bitter, balanced and endlessly civilized.',
    servings: '1 drink',
    prep: 3,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'dinner-party',
    tags: ['herbal', 'indulgent'],
    keywords: ['campari', 'gin', 'vermouth', 'negroni', 'orange'],
    ingredients: [
      ing('1 oz', 'gin', 'spirits'),
      ing('1 oz', 'campari', 'spirits'),
      ing('1 oz', 'sweet vermouth', 'spirits'),
      ing('1 strip', 'orange peel', 'produce'),
    ],
    steps: [
      { text: 'Combine gin, Campari and vermouth in a mixing glass with plenty of ice.', emphasis: 'start' },
      { text: 'Stir 30 seconds until the glass frosts and the drink is properly chilled.', emphasis: 'middle', minutes: 1 },
      { text: 'Strain over one big cube in a rocks glass.', emphasis: 'middle' },
      { text: 'Express the orange peel over the top and drop it in.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Marinated olives & cured meats', note: 'Salt and fat for the bitterness to argue with.' },
      { kind: 'cocktail', name: 'Aperol Spritz', note: 'If the Negroni is too much, its gentler cousin waits.' },
    ],
    glassware: 'Rocks glass',
    museNote: 'Stir, don’t shake — clarity keeps the bitterness elegant.',
  },
  {
    title: 'Aperol Spritz',
    category: 'drink',
    emoji: '🍸',
    hue: 'butter',
    blurb: 'The 3-2-1 golden hour ritual: bitter, bright and unapologetically orange.',
    servings: '1 drink',
    prep: 3,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'brunch',
    tags: ['citrusy', 'light', 'no-cook'],
    keywords: ['aperol', 'prosecco', 'soda water', 'orange'],
    ingredients: [
      ing('3 oz', 'prosecco', 'spirits', 'chilled'),
      ing('2 oz', 'aperol', 'spirits'),
      ing('1 oz', 'soda water', 'pantry'),
      ing('1 slice', 'orange', 'produce'),
      ing('1 cup', 'ice cubes', 'pantry', 'large'),
    ],
    steps: [
      { text: 'Fill a wine glass with ice — bigger cubes, slower melt.', emphasis: 'start' },
      { text: 'Pour prosecco first, then Aperol in the classic 3-2-1 order.', emphasis: 'middle' },
      { text: 'Add the splash of soda and give one lazy stir.', emphasis: 'middle' },
      { text: 'Crown with the orange slice and carry it to the sunniest seat.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Potato chips & olives', note: 'The Venetian bar snack, unchanged since forever.' },
      { kind: 'zero-proof', name: 'Blood orange soda', note: 'Same color, gentler soul.' },
    ],
    glassware: 'Balloon wine glass',
    museNote: 'Prosecco before Aperol — pouring in order keeps the layers blending softly.',
  },
  {
    title: 'Rosemary Whiskey Sour',
    category: 'drink',
    emoji: '🌹',
    hue: 'slate',
    blurb: 'Woody rosemary syrup under lemon and rye — a sour that wears a cardigan.',
    servings: '1 drink',
    prep: 7,
    cook: 0,
    skill: 'medium',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'cozy-night-in',
    tags: ['herbal', 'citrusy'],
    keywords: ['rye', 'whiskey', 'lemon', 'rosemary', 'simple syrup'],
    ingredients: [
      ing('2 oz', 'rye whiskey', 'spirits'),
      ing('1 oz', 'lemon juice', 'produce'),
      ing('3/4 oz', 'rosemary simple syrup', 'pantry'),
      ing('1 sprig', 'rosemary', 'produce', 'to garnish'),
      ing('1', 'luxardo cherry', 'pantry', 'optional'),
    ],
    steps: [
      { text: 'Make rosemary syrup: simmer equal parts sugar and water with a rosemary sprig for 5 minutes, then cool.', emphasis: 'start', minutes: 5 },
      { text: 'Combine whiskey, lemon and syrup in a shaker with ice.', emphasis: 'middle' },
      { text: 'Shake 12 seconds until well-chilled.', emphasis: 'middle', minutes: 1 },
      { text: 'Strain into a rocks glass over one big cube.', emphasis: 'middle' },
      { text: 'Smack the rosemary sprig between your palms and lay it across the rim.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Aged cheddar & crackers', note: 'Sharp dairy meets wooded citrus.' },
      { kind: 'zero-proof', name: 'Rosemary lemonade', note: 'The same garden, teetotal edition.' },
    ],
    glassware: 'Rocks glass',
    museNote: 'Smacking the sprig releases the oils — that first nose is half the drink.',
  },
  {
    title: 'Mezcal Mule',
    category: 'drink',
    emoji: '🌵',
    hue: 'clay',
    blurb: 'Smoke riding a ginger-beer toboggan, lime wedged in between. Dangerously drinkable.',
    servings: '1 drink',
    prep: 4,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['smoky', 'spiced'],
    keywords: ['mezcal', 'ginger beer', 'lime', 'angostura bitters'],
    ingredients: [
      ing('2 oz', 'mezcal', 'spirits'),
      ing('4 oz', 'ginger beer', 'pantry', 'spicy kind'),
      ing('3/4 oz', 'lime juice', 'produce'),
      ing('2 dashes', 'angostura bitters', 'pantry'),
      ing('1', 'lime wheel', 'produce'),
    ],
    steps: [
      { text: 'Fill a copper mug or highball with ice to the very top.', emphasis: 'start' },
      { text: 'Add mezcal, lime and bitters; stir to wake the smoke.', emphasis: 'middle' },
      { text: 'Top with ginger beer poured down the side of the glass.', emphasis: 'middle' },
      { text: 'Squeeze the lime wheel over and drop it in.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Grilled corn with cotija', note: 'Char and crema against smoke and fizz.' },
      { kind: 'zero-proof', name: 'Ginger-lime soda', note: 'The mule’s milder cousin.' },
    ],
    glassware: 'Copper mug',
    museNote: 'Ginger beer, not ginger ale — you need the burn to stand up to the smoke.',
  },
  {
    title: 'Basil Gimlet',
    category: 'drink',
    emoji: '🍃',
    hue: 'sage',
    blurb: 'Silky gin, sharp lime and basil that smells like August — precision in a coupe.',
    servings: '1 drink',
    prep: 6,
    cook: 0,
    skill: 'medium',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'dinner-party',
    tags: ['herbal', 'fresh', 'citrusy'],
    keywords: ['gin', 'lime', 'basil', 'simple syrup'],
    ingredients: [
      ing('2 1/4 oz', 'gin', 'spirits'),
      ing('3/4 oz', 'lime juice', 'produce'),
      ing('3/4 oz', 'simple syrup', 'pantry'),
      ing('6 leaves', 'basil', 'produce'),
    ],
    steps: [
      { text: 'Press (don’t tear) the basil into the shaker with the syrup and let it sit 1 minute.', emphasis: 'start', minutes: 1 },
      { text: 'Add gin and lime with ice.', emphasis: 'middle' },
      { text: 'Shake 12 seconds — hard enough to chill, not so hard you tear the basil bitter.', emphasis: 'middle', minutes: 1 },
      { text: 'Double-strain into a chilled coupe so no flecks cloud the drink.', emphasis: 'middle' },
      { text: 'Float a single perfect leaf on the surface.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Burrata with tomatoes', note: 'Cream needs acidity; gimlet obliges.' },
      { kind: 'cocktail', name: 'Negroni', note: 'A bitter nightcap after a green opener.' },
    ],
    glassware: 'Coupe',
    museNote: 'Pressing the basil flat wakes the oils; tearing it up releases the chlorophyll.',
  },
  {
    title: 'Rum Honey Hot Toddy',
    category: 'drink',
    emoji: '🍯',
    hue: 'butter',
    blurb: 'Warm, honeyed and rosemary-scented — the blanket of the cocktail world.',
    servings: '1 drink',
    prep: 5,
    cook: 3,
    skill: 'easy',
    diets: ['vegan', 'gluten-free', 'dairy-free'],
    occasion: 'cozy-night-in',
    tags: ['spiced', 'herbal'],
    keywords: ['dark rum', 'whiskey', 'honey syrup', 'lemon', 'rosemary'],
    ingredients: [
      ing('2 oz', 'aged dark rum', 'spirits'),
      ing('3/4 oz', 'honey syrup', 'pantry'),
      ing('3/4 oz', 'lemon juice', 'produce'),
      ing('5 oz', 'hot water', 'pantry'),
      ing('1 sprig', 'rosemary', 'produce'),
      ing('1', 'lemon wheel', 'produce'),
    ],
    steps: [
      { text: 'Warm a mug with boiling water, then discard the water.', emphasis: 'start' },
      { text: 'Add rum, honey syrup and lemon; stir to dissolve the honey completely.', emphasis: 'middle' },
      { text: 'Top with hot water (not boiling — around 160°F keeps the honey delicate).', emphasis: 'middle' },
      { text: 'Float the rosemary and lemon wheel so the steam carries the aromatics up.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Buttered toast with cinnamon', note: 'Match warmth with warmth.' },
      { kind: 'zero-proof', name: 'Honey-lemon-ginger tea', note: 'Same comfort, no proof.' },
    ],
    glassware: 'Heatproof mug',
    museNote: 'Rum brings brown-sugar depth that whiskey’s bark can crowd out — try both ways.',
  },
  {
    title: 'Cucumber Mint Cooler',
    category: 'drink',
    emoji: '🥒',
    hue: 'sage',
    blurb: 'Zero-proof and somehow still the most interesting drink at the table.',
    servings: '1 drink',
    prep: 5,
    cook: 0,
    skill: 'easy',
    diets: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    occasion: 'everyday',
    tags: ['fresh', 'light', 'no-cook'],
    keywords: ['cucumber', 'mint', 'lime', 'simple syrup', 'soda water'],
    ingredients: [
      ing('6 slices', 'cucumber', 'produce'),
      ing('8 leaves', 'mint', 'produce'),
      ing('3/4 oz', 'lime juice', 'produce'),
      ing('1/2 oz', 'simple syrup', 'pantry'),
      ing('4 oz', 'soda water', 'pantry'),
    ],
    steps: [
      { text: 'Muddle cucumber and mint softly in the base of a tall glass.', emphasis: 'start' },
      { text: 'Add lime and syrup, then fill with crushed ice.', emphasis: 'middle' },
      { text: 'Swizzle with a bar spoon until the glass frosts over.', emphasis: 'middle' },
      { text: 'Top with soda, stir once, and garnish with a mint crown.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Feta & herb omelet', note: 'A green-on-green brunch match.' },
      { kind: 'cocktail', name: 'Garden Gin & Tonic', note: 'Serve both; let guests choose their path.' },
    ],
    glassware: 'Highball',
    museNote: 'Crushed ice dilutes fast and rightly so — the drink is meant to soften.',
  },
]

export const ALL_TEMPLATES = [...FOOD, ...DRINKS]

/* ------------------------------------------------------------------ */
/* Matching + generation                                               */
/* ------------------------------------------------------------------ */

const ALIASES: Record<string, string> = {
  'greekl yogurt': 'greek yogurt',
  'yogurt': 'greek yogurt',
  'rum': 'white rum',
  'scotch': 'whiskey',
  'bitters': 'angostura bitters',
  'noodles': 'pasta',
  'spaghetti': 'pasta',
  'noodle': 'pasta',
  'tomato': 'tomatoes',
  'peppers': 'bell peppers',
  'pepper': 'bell peppers',
  'chickpea': 'chickpeas',
  'bean': 'black beans',
  'berries': 'strawberries',
  'soda': 'soda water',
  'tonic water': 'tonic',
  'syrup': 'simple syrup',
  'honey': 'honey syrup',
  'campari': 'negroni',
  'triple sec': 'negroni',
}

export const normalizeIngredient = (raw: string): string => {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  return ALIASES[key] ?? key
}

/* ------------------------------------------------------------------ */
/* Fuzzy matching — lets free-text ingredients find real recipes        */
/* ------------------------------------------------------------------ */

/** words too generic (or pure prep descriptors) to identify an ingredient */
const STOP_WORDS = new Set([
  'fresh', 'frozen', 'dried', 'chopped', 'sliced', 'diced', 'minced', 'ground',
  'shredded', 'grated', 'organic', 'large', 'small', 'medium', 'ripe', 'raw',
  'cooked', 'leftover', 'extra', 'virgin', 'canned', 'bottled', 'jar', 'bunch',
  'handful', 'splash', 'good', 'spicy', 'hot', 'cold', 'of', 'the', 'a', 'an',
  'some', 'my', 'and', 'with', 'for', 'in', 'on', 'kind', 'pieces', 'piece',
])

const singular = (w: string): string => {
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`
  if (w.length > 3 && w.endsWith('es') && !w.endsWith('ses')) return w.slice(0, -2)
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

/** canonical form of a single word for comparison */
const canonWord = (w: string): string => singular(w.replace(/[^a-z0-9]/g, ''))

/** meaningful words of a phrase, canonicalized and stop-word-filtered */
const contentWords = (phrase: string): string[] =>
  normalizeIngredient(phrase)
    .split(' ')
    .map(canonWord)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

interface ChipMatch {
  /** capped contribution of this chip to the recipe's score */
  points: number
  /** 1 when the chip identifies the recipe at all */
  hit: boolean
}

/** how strongly one chip identifies one template (exported for tests) */
export const matchChip = (t: RecipeTemplate, chip: string): ChipMatch => {
  const chipWords = [...new Set(contentWords(chip))]
  if (chipWords.length === 0) return { points: 0, hit: false }

  const OPTIONAL_NOTE = /optional|garnish|if (using|on hand)|for serving/
  const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((w) => b.includes(w))

  // an ingredient that IS the chip (same canonical word set, not a garnish)
  // is the strongest signal: 'eggs' matches a recipe built on eggs, not one
  // that merely uses egg noodles or offers an optional soft-boiled egg
  const core = t.ingredients.some((i) => {
    const iw = contentWords(i.name)
    return sameSet(iw, chipWords) && !OPTIONAL_NOTE.test(i.note ?? '')
  })
  if (core) return { points: 3, hit: true }

  // chip contained inside another ingredient ('egg' in 'egg noodles',
  // 'tomato' in 'cherry tomatoes') or listed only as an optional finish —
  // real but secondary, and never allowed to outrank a core match
  const inside = t.ingredients.some((i) => {
    const iw = contentWords(i.name)
    return chipWords.every((w) => iw.includes(w))
  })
  if (inside) return { points: 2, hit: true }

  const c = normalizeIngredient(chip)
  if (t.keywords.some((k) => normalizeIngredient(k) === c)) return { points: 2, hit: true }

  const haystack = new Set<string>([
    ...contentWords(t.title),
    ...t.keywords.flatMap((k) => contentWords(k)),
    ...t.ingredients.flatMap((i) => contentWords(`${i.name} ${i.note ?? ''}`)),
  ])

  const overlap = chipWords.filter((w) => haystack.has(w)).length
  if (overlap === 0) return { points: 0, hit: false }

  // multi-word chips ("chicken breast", "sweet potato") must mostly match
  const strong = chipWords.length === 1 ? overlap >= 1 : overlap >= Math.ceil(chipWords.length / 2)
  return { points: strong ? Math.min(2, overlap) : 1, hit: true }
}

/** total match strength of a template against all chips (0 = no connection) */
const matchScore = (t: RecipeTemplate, chips: string[]): { score: number; hits: number } => {
  let score = 0
  let hits = 0
  for (const chip of chips) {
    const m = matchChip(t, chip)
    if (m.hit) {
      hits++
      score += m.points
    }
  }
  return { score, hits }
}

const filterTemplates = (state: MuseState): RecipeTemplate[] => {
  const skills: Skill[] = state.skill === 'easy'
    ? ['easy']
    : state.skill === 'medium'
      ? ['easy', 'medium']
      : ['easy', 'medium', 'advanced']

  return ALL_TEMPLATES.filter((t) => {
    if (t.category !== state.category) return false
    if (!skills.includes(t.skill)) return false
    if (t.prep + t.cook > state.prepTime) return false
    if (state.diets.some((d) => !t.diets.includes(d) && !(d === 'vegetarian' && t.diets.includes('vegan')))) return false
    return true
  })
}

/** deterministic shuffle so the same hand-picked list regenerates sanely */
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const a = [...arr]
  let s = seed || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296
    const j = Math.floor((s / 4294967296) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface GenerateResult {
  recipes: Recipe[]
  /** true when no pick matched the chips, so the Muse improvised around them */
  fallback: boolean
}

export const generateResult = (state: MuseState, count = 6, seed = Date.now()): GenerateResult => {
  const pool = filterTemplates(state)
  const chips = state.ingredients.map(normalizeIngredient).filter(Boolean)

  if (pool.length === 0) return { recipes: [], fallback: false }

  const finish = (ranked: RecipeTemplate[], fallback: boolean): GenerateResult => ({
    recipes: ranked.slice(0, count).map((t) => buildRecipe(t)),
    fallback,
  })

  if (chips.length === 0) return finish(seededShuffle(pool, seed), false)

  const scored = pool
    .map((t) => ({ t, ...matchScore(t, chips) }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.score - a.score || b.hits - a.hits)

  if (scored.length === 0) {
    // nothing in the filtered pool connects to the chips — improvise around them
    return finish(improvise(state, chips, pool, seed, count), true)
  }

  // a chip with no identity-level match anywhere (only weak word overlap) is a
  // custom / off-list ingredient: weave IT into improvised recipes while real
  // matches stay as the supporting cast — instead of silently ignoring it
  const weakChips = chips.filter((c) => !pool.some((t) => matchChip(t, c).points >= 2))
  if (weakChips.length > 0) {
    const rest = pool.filter((t) => !scored.some((s) => s.t === t))
    const filler = [...scored.map((x) => x.t), ...seededShuffle(rest, seed + 1)]
    return finish(improvise(state, weakChips, pool, seed, count, filler), true)
  }

  let ranked = scored.map((x) => x.t)
  if (ranked.length < count) {
    const extra = seededShuffle(pool.filter((t) => !ranked.includes(t)), seed)
    ranked = [...ranked, ...extra]
  }
  return finish(ranked, false)
}

/* ------------------------------------------------------------------ */
/* Improv engine — weaves custom / off-list ingredients into recipes   */
/* ------------------------------------------------------------------ */

const titleCase = (phrase: string): string =>
  phrase
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')

/** best-guess shopping aisle for an arbitrary user-typed ingredient */
export const guessCategory = (name: string): IngredientCategory => {
  const wordList = contentWords(name)
  const words = wordList.join(' ')
  if (/(cheese|yogurt|butter|egg|milk|cream|feta|parmesan|ricotta|mozzarella|cheddar|halloumi|ghee)\b/.test(words) || wordList.includes('eggs')) return 'dairy'
  if (/(?<![a-z])(flour|sugar|rice|pasta|noodle|oat|quinoa|bean|lentil|chickpea|stock|broth|oil|vinegar|salt|honey|maple|mustard|soy|sauce|spice|cumin|paprika|turmeric|cinnamon|cornstarch|crumb|tortilla|bread|tofu|tempeh|seed|nut)\b/.test(words)) return 'pantry'
  if (/(?<![a-z])(vodka|gin|rum|whiskey|bourbon|rye|tequila|mezcal|cognac|liqueur|cordial|vermouth|aperol|campari|wine|prosecco|champagne|sake|sherry|marsala|beer|ale|cider|bitters|syrup|juice|water|tonic|cola|coffee|espresso|kombucha)\b/.test(words)) return 'spirits'
  return 'produce'
}

const guessQuantity = (name: string, category: IngredientCategory): string => {
  const words = contentWords(name).join(' ')
  if (category === 'spirits') return '2 oz'
  if (/(egg)/.test(words)) return '3'
  if (/(onion|pepper|carrot|zucchini|cucumber|avocado|lemon|lime|orange|apple|banana|tomato|potato|head|clove)/.test(words)) return '2'
  if (category === 'dairy') return '1 cup'
  if (category === 'pantry') return '2 tbsp'
  return '1 cup'
}

interface ImprovBase {
  pattern: (star: string) => string
  emoji: string
  hue: RecipeHue
  prep: number
  cook: number
  occasion: RecipeTemplate['occasion']
  tags: ShelfTag[]
  blurb: string
  glassware?: string
  steps: TemplateStep[]
  pairings: Pairing[]
}

const FOOD_BASES: ImprovBase[] = [
  {
    pattern: (s) => `${s} & Everything Skillet`,
    emoji: '🍳', hue: 'clay', prep: 10, cook: 15,
    occasion: 'everyday', tags: ['one-pan'],
    blurb: 'A flexible one-pan built around your list — hardest items sear first, delicate ones finish last.',
    steps: [
      { text: 'Get a heavy pan properly hot over medium-high while you chop your starred ingredients into even, bite-size pieces.', emphasis: 'start' },
      { text: 'Sear the heartiest items undisturbed until golden, then work in the aromatics — garlic first, softest things last.', emphasis: 'middle', minutes: 8 },
      { text: 'Deglaze with a splash of water or stock, scraping the browned bits into a quick pan sauce.', emphasis: 'middle', minutes: 3 },
      { text: 'Wilt in any greens and fold everything through the fat and juices.', emphasis: 'middle', minutes: 4 },
      { text: 'Finish off the heat with lemon and salt — taste and adjust before it leaves the pan.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Crusty bread', note: 'For the pan sauce — non-negotiable.' },
      { kind: 'zero-proof', name: 'Sparkling water with lime', note: 'Palate reset between rich bites.' },
    ],
  },
  {
    pattern: (s) => `${s} Harvest Bowl`,
    emoji: '🥗', hue: 'sage', prep: 15, cook: 15,
    occasion: 'everyday', tags: ['fresh'],
    blurb: 'Bowls forgive everything: a grain base, charred vegetables, your list on top, quick lemon dressing over all.',
    steps: [
      { text: 'Cook your grain or base according to the package while you chop the rest.', emphasis: 'start' },
      { text: 'Roast or char the sturdy vegetables at 425°F with olive oil until caramelized at the edges.', emphasis: 'middle', minutes: 14 },
      { text: 'Whisk a quick dressing: lemon, olive oil, something creamy if you have it, salt, pepper.', emphasis: 'middle' },
      { text: 'Build the bowls — base first, then vegetables, then anything delicate, briny or soft.', emphasis: 'middle' },
      { text: 'Flood with dressing and finish with crunch: toasted nuts or seeds.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'wine', name: 'Grüner Veltliner', note: 'White-pepper notes love roasted vegetables.' },
      { kind: 'side', name: 'Warm flatbread', note: 'Turns the bowl into a spread.' },
    ],
  },
  {
    pattern: (s) => `${s} Comfort Stew`,
    emoji: '🍲', hue: 'butter', prep: 15, cook: 30,
    occasion: 'cozy-night-in', tags: ['comfort'],
    blurb: 'One pot, layered in stages so every ingredient keeps its character — the safest way to honor a random list.',
    steps: [
      { text: 'Sweat onion and garlic in olive oil until translucent and sweet.', emphasis: 'start', minutes: 6 },
      { text: 'Toast the spices in the pot until the kitchen smells like spice.', emphasis: 'middle', minutes: 1 },
      { text: 'Add the hearty items and enough water or stock to cover; simmer until tender.', emphasis: 'middle', minutes: 20 },
      { text: 'Add quick-cooking items for the last minutes so nothing turns to mush.', emphasis: 'middle', minutes: 5 },
      { text: 'Season aggressively at the end and brighten with lemon; serve over grains or with bread.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Buttered crusty bread', note: 'The official stew utensil.' },
      { kind: 'wine', name: 'Syrah', note: 'Black-pepper notes for deep, dark stews.' },
    ],
  },
  {
    pattern: (s) => `${s} Melt`,
    emoji: '🧀', hue: 'butter', prep: 5, cook: 5,
    occasion: 'everyday', tags: ['comfort'],
    blurb: 'Anything between two buttered slices under a weighted pan — the fastest honest meal your list can become.',
    steps: [
      { text: 'Butter the outside of two slices of bread.', emphasis: 'start' },
      { text: 'Layer cheese, then your chopped ingredients, then cheese again — cheese glue holds the melt together.', emphasis: 'middle' },
      { text: 'Griddle over medium-low until deeply golden, pressing gently; flip once.', emphasis: 'middle', minutes: 4 },
      { text: 'Rest a minute, slice on the diagonal, and salt the crusts.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Tomato soup', note: 'The legally required companion.' },
      { kind: 'zero-proof', name: 'Dill pickle brine shot', note: 'Trust the process.' },
    ],
  },
]

const DRINK_BASES: ImprovBase[] = [
  {
    pattern: (s) => `${s} Highball`,
    emoji: '🥃', hue: 'slate', prep: 5, cook: 0,
    occasion: 'everyday', tags: ['no-cook'],
    glassware: 'Highball',
    blurb: 'The most forgiving drink there is: spirit, fizz, citrus to taste — your list does the talking.',
    steps: [
      { text: 'Fill a tall glass completely with ice.', emphasis: 'start' },
      { text: 'Add your featured spirits and juices over the ice.', emphasis: 'middle' },
      { text: 'Top with soda water, pouring down the side to keep the fizz.', emphasis: 'middle' },
      { text: 'Stir once, taste, adjust citrus or sweetness, and garnish with what you have.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Salted nuts', note: 'Salt makes both the drink and the snack disappear.' },
      { kind: 'zero-proof', name: 'The same build, minus spirits', note: 'Everyone gets a glass.' },
    ],
  },
  {
    pattern: (s) => `${s} Garden Smash`,
    emoji: '🌿', hue: 'sage', prep: 5, cook: 0,
    occasion: 'brunch', tags: ['fresh', 'no-cook'],
    glassware: 'Rocks glass',
    blurb: 'Muddle something tender, add your spirit and citrus — a smash accepts almost any ingredient gracefully.',
    steps: [
      { text: 'Muddle tender herbs or fruit gently in the base of the shaker.', emphasis: 'start' },
      { text: 'Add spirits, citrus and syrup with ice; shake hard 12 seconds.', emphasis: 'middle', minutes: 1 },
      { text: 'Double-strain over fresh ice.', emphasis: 'middle' },
      { text: 'Garnish with whatever you muddled — smell is half the drink.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Fried chicken', note: 'Herbal, crisp, cold — the classic trio.' },
      { kind: 'zero-proof', name: 'Mint-lime cooler', note: 'Same garden, gentler path.' },
    ],
  },
  {
    pattern: (s) => `${s} Spritz`,
    emoji: '🍊', hue: 'butter', prep: 4, cook: 0,
    occasion: 'brunch', tags: ['citrusy', 'no-cook'],
    glassware: 'Balloon wine glass',
    blurb: 'Bubbly, bitter or bright — the 3-2-1 formula turns your ingredients into golden hour.',
    steps: [
      { text: 'Fill a wine glass with ice.', emphasis: 'start' },
      { text: 'Pour 3 parts bubbly, 2 parts your featured bitter or spirit, 1 part soda.', emphasis: 'middle' },
      { text: 'Give one lazy stir to combine without killing the bubbles.', emphasis: 'middle' },
      { text: 'Crown with an orange slice or whatever citrus is around.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Olives & potato chips', note: 'The Venetian standard, unchanged.' },
      { kind: 'zero-proof', name: 'Blood orange soda', note: 'Same color, softer soul.' },
    ],
  },
  {
    pattern: (s) => `${s} Rickey`,
    emoji: '🍸', hue: 'slate', prep: 4, cook: 0,
    occasion: 'everyday', tags: ['citrusy', 'no-cook'],
    glassware: 'Highball',
    blurb: 'Spirit, real lime, nothing sweet to hide behind — the cleanest possible frame for a new ingredient.',
    steps: [
      { text: 'Squeeze half a lime into a tall glass, then drop the shell in.', emphasis: 'start' },
      { text: 'Add your featured spirit over plenty of ice.', emphasis: 'middle' },
      { text: 'Top with soda water and lift once with a bar spoon.', emphasis: 'middle' },
      { text: 'Taste before sweetening — a rickey should feel bright, not sour.', emphasis: 'end' },
    ],
    pairings: [
      { kind: 'side', name: 'Grilled anything', note: 'Char and citrus are old friends.' },
      { kind: 'zero-proof', name: 'Lime rickey, zero-proof', note: 'Just skip the spirit.' },
    ],
  },
]

/**
 * diet-conflict guard: a chip that contradicts an active dietary need is never
 * woven into improvised recipes — the diet filter stays a hard promise
 */
const CONFLICT_WORDS: Partial<Record<Diet, RegExp>> = {
  vegan: /(chicken|beef|pork|bacon|fish|salmon|shrimp|tuna|cod|meat|steak|egg|dairy|milk|butter|cheese|cream|yogurt|feta|parmesan|ricotta|mozzarella|cheddar|honey|worcester)/,
  vegetarian: /(chicken|beef|pork|bacon|fish|salmon|shrimp|tuna|cod|meat|steak|gelatin)/,
  'dairy-free': /(dairy|milk|butter|cheese|cream|yogurt|feta|parmesan|ricotta|mozzarella|cheddar)/,
  'gluten-free': /(wheat|flour|bread|bulgur|couscous|barley|semolina|pasta|noodle|soy sauce)/,
  'nut-free': /(peanut|almond|cashew|walnut|pecan|pistachio|hazelnut|marcona|nut)/,
}

const conflictsWithDiets = (chip: string, diets: Diet[]): boolean =>
  diets.some((d) => CONFLICT_WORDS[d]?.test(chip) ?? false)

/** neutral supporting cast that keeps an improvised dish/drink coherent; respects diet needs */
const improvAnchors = (isDrink: boolean, diets: Diet[]) => {
  const noDairy = diets.includes('vegan') || diets.includes('dairy-free')
  const anchors = isDrink
    ? [
        ing('2 oz', 'soda water', 'pantry', 'to top'),
        ing('3/4 oz', 'lime juice', 'produce'),
        ing('1/2 oz', 'simple syrup', 'pantry'),
      ]
    : [
        ing('2 tbsp', 'olive oil', 'pantry'),
        ing('3 cloves', 'garlic', 'produce'),
        ing('1', 'lemon', 'produce', 'brightens everything'),
        ing('to taste', 'salt & black pepper', 'pantry'),
      ]
  if (!isDrink && !noDairy) anchors.push(ing('2 tbsp', 'butter', 'dairy'))
  if (!isDrink && !diets.includes('vegan')) anchors.push(ing('1/2 cup', 'parmesan', 'dairy', 'optional'))
  return anchors
}

const improvise = (state: MuseState, chips: string[], pool: RecipeTemplate[], seed: number, count = 6, filler?: RecipeTemplate[]): RecipeTemplate[] => {
  const isDrink = state.category === 'drink'

  // woven bases must respect the user's time budget where possible — the Muse
  // bends around unknown ingredients, not around stated constraints
  const qualifying = (isDrink ? DRINK_BASES : FOOD_BASES).filter((b) => b.prep + b.cook <= state.prepTime)
  // a prep limit below the quickest base would otherwise yield only filler —
  // keep the nearest matches so improvisation still names the ingredient
  const bases = seededShuffle(qualifying.length > 0 ? qualifying : isDrink ? DRINK_BASES : FOOD_BASES, seed)

  // only weave chips that respect the active dietary needs
  const weave = chips.filter((c) => !conflictsWithDiets(c, state.diets))
  if (weave.length === 0) return filler ?? seededShuffle(pool, seed + 1)

  const woven: RecipeTemplate[] = bases.map((base) => ({
    title: base.pattern(titleCase(weave[0])),
    category: state.category,
    emoji: base.emoji,
    hue: base.hue,
    blurb: base.blurb,
    servings: isDrink ? '1 drink' : 'Serves 2',
    prep: base.prep,
    cook: base.cook,
    skill: 'easy',
    diets: [],
    occasion: base.occasion,
    tags: base.tags,
    keywords: [...weave],
    ingredients: [
      ...weave.slice(0, 4).map((name) => ing(guessQuantity(name, guessCategory(name)), name, guessCategory(name))),
      ...weave.slice(4).map((name) => ing(guessQuantity(name, guessCategory(name)), name, guessCategory(name), 'use if on hand')),
      ...improvAnchors(isDrink, state.diets),
    ],
    steps: base.steps,
    pairings: base.pairings,
    glassware: base.glassware,
    museNote: `Improvised around ${weave.join(', ')} — quantities are starting points; taste as you go.`,
  }))

  // filler stays inside the user's filter envelope (skill, prep, diet, category)
  // — improv adds recipes around the chips; it never breaks the stated filters
  const blended = [...woven, ...(filler ?? seededShuffle(pool, seed + 1))]
  const seen = new Set<string>()
  const out: RecipeTemplate[] = []
  for (const t of blended) {
    if (seen.has(t.title)) continue
    seen.add(t.title)
    out.push(t)
    if (out.length >= count) break
  }
  return out
}

export const generateRecipes = (state: MuseState, count = 6, seed = Date.now()): Recipe[] =>
  generateResult(state, count, seed).recipes

/**
 * The one canonical recipe identity — used by buildRecipe (generation),
 * seedData, and the store's load-time healing. Changing this changes what
 * counts as "the same recipe" across the app.
 */
export const canonicalRecipeId = (category: string, title: string): string =>
  `${category}-${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

export const buildRecipe = (t: RecipeTemplate): Recipe => ({
  // stable identity: the same template must always map to the same shelf entry,
  // regardless of which generation produced it
  id: canonicalRecipeId(t.category, t.title),
  title: t.title,
  category: t.category,
  blurb: t.blurb,
  emoji: t.emoji,
  hue: t.hue,
  servings: t.servings,
  prepMinutes: t.prep,
  cookMinutes: t.cook,
  skill: t.skill,
  diets: t.diets,
  occasion: t.occasion,
  tags: t.tags,
  ingredients: t.ingredients,
  steps: t.steps.map((s) => ({ text: s.text })),
  pairings: t.pairings,
  glassware: t.glassware,
  favorite: false,
  createdAt: Date.now(),
  museNote: t.museNote,
})

export const totalMinutes = (r: Recipe): number => r.prepMinutes + r.cookMinutes

/* ------------------------------------------------------------------ */
/* Surprise Me presets                                                 */
/* ------------------------------------------------------------------ */

export const SURPRISE_STATES: MuseState[] = [
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['chicken', 'tomatoes', 'garlic'], prepTime: 45, diets: [], skill: 'medium' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['pasta', 'lemon'], prepTime: 30, diets: ['vegetarian'], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['tofu', 'peanut butter'], prepTime: 45, diets: ['vegan'], skill: 'medium' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['eggs', 'feta'], prepTime: 30, diets: ['vegetarian'], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['black beans', 'tortillas'], prepTime: 30, diets: ['vegan'], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['salmon', 'honey'], prepTime: 30, diets: [], skill: 'medium' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['lentils', 'coconut milk'], prepTime: 45, diets: ['vegan', 'gluten-free'], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['gin', 'tonic'], prepTime: 15, diets: [], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['tequila', 'lime'], prepTime: 15, diets: [], skill: 'medium' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['bourbon', 'angostura bitters'], prepTime: 15, diets: [], skill: 'advanced' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['negroni', 'aperol'], prepTime: 15, diets: [], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['gin', 'campari'], prepTime: 15, diets: [], skill: 'medium' },
  { ...DEFAULT_MUSE, category: 'drink', ingredients: ['mezcal', 'ginger beer'], prepTime: 15, diets: [], skill: 'easy' },
  { ...DEFAULT_MUSE, category: 'food', ingredients: ['potatoes', 'honey'], prepTime: 60, diets: ['gluten-free'], skill: 'easy' },
]

/* ------------------------------------------------------------------ */
/* Seed shelf                                                          */
/* ------------------------------------------------------------------ */

const seedFrom = (title: string): Recipe => {
  const t = ALL_TEMPLATES.find((x) => x.title === title)
  if (!t) throw new Error(`Unknown seed template: ${title}`)
  return buildRecipe(t)
}

export const seedData = (): AppData => {
  const pasta = seedFrom('Lemon Ricotta Pasta with Arugula')
  const gin = seedFrom('Garden Gin & Tonic')
  const dal = seedFrom('Coconut Red Lentil Dal')
  const spritz = seedFrom('Aperol Spritz')
  pasta.favorite = true
  gin.favorite = true
  return {
    version: 1,
    recipes: [pasta, gin, dal, spritz],
    basket: [],
    muse: { ...DEFAULT_MUSE },
    onboarded: false,
  }
}
