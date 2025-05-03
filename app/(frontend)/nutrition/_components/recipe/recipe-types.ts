export interface Ingredient {
  name: string;
  amount: string;
}

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionValues;
  prepTime: string;
  cookTime: string;
  mealType: string;
}

export const sampleRecipes = {
  balanced: {
    name: 'Protein-Packed Quinoa Bowl',
    description:
      'A nutritious and filling bowl with a perfect balance of protein, carbs, and healthy fats.',
    ingredients: [
      { name: 'Quinoa', amount: '1 cup, cooked' },
      { name: 'Grilled chicken breast', amount: '4 oz' },
      { name: 'Avocado', amount: '1/4, sliced' },
      { name: 'Cherry tomatoes', amount: '1/2 cup, halved' },
      { name: 'Cucumber', amount: '1/4 cup, diced' },
      { name: 'Feta cheese', amount: '2 tbsp, crumbled' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Lemon juice', amount: '1 tbsp' },
      { name: 'Salt and pepper', amount: 'to taste' },
    ],
    instructions: [
      'Cook quinoa according to package instructions and let it cool.',
      'Grill the chicken breast and slice it into strips.',
      'In a bowl, combine quinoa, chicken, avocado, tomatoes, cucumber, and feta cheese.',
      'Whisk together olive oil, lemon juice, salt, and pepper to make the dressing.',
      'Drizzle the dressing over the bowl and gently toss to combine.',
      'Serve immediately or refrigerate for later.',
    ],
    nutrition: {
      calories: 420,
      protein: 30,
      carbs: 35,
      fat: 18,
    },
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    mealType: 'lunch',
  },
  highProtein: {
    name: 'High-Protein Greek Yogurt Parfait',
    description:
      "A protein-rich breakfast parfait that's quick to prepare and perfect for muscle recovery.",
    ingredients: [
      { name: 'Greek yogurt', amount: '1 cup, plain' },
      { name: 'Protein powder', amount: '1 scoop, vanilla' },
      { name: 'Mixed berries', amount: '1/2 cup' },
      { name: 'Almonds', amount: '2 tbsp, sliced' },
      { name: 'Chia seeds', amount: '1 tsp' },
      { name: 'Honey', amount: '1 tsp (optional)' },
    ],
    instructions: [
      'In a bowl, mix Greek yogurt with protein powder until well combined.',
      'Layer half of the yogurt mixture in a glass or jar.',
      'Add a layer of mixed berries.',
      'Add the remaining yogurt mixture.',
      'Top with more berries, sliced almonds, and chia seeds.',
      'Drizzle with honey if desired.',
    ],
    nutrition: {
      calories: 350,
      protein: 40,
      carbs: 20,
      fat: 12,
    },
    prepTime: '5 minutes',
    cookTime: '0 minutes',
    mealType: 'breakfast',
  },
  lowCarb: {
    name: 'Zucchini Noodles with Pesto Chicken',
    description: "A low-carb alternative to pasta that's packed with flavor and nutrients.",
    ingredients: [
      { name: 'Zucchini', amount: '2 medium' },
      { name: 'Chicken breast', amount: '6 oz' },
      { name: 'Basil pesto', amount: '2 tbsp' },
      { name: 'Cherry tomatoes', amount: '1/2 cup, halved' },
      { name: 'Parmesan cheese', amount: '2 tbsp, grated' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Salt and pepper', amount: 'to taste' },
      { name: 'Red pepper flakes', amount: 'pinch (optional)' },
    ],
    instructions: [
      'Using a spiralizer, turn the zucchini into noodles (zoodles).',
      'Season chicken breast with salt and pepper, then cook in olive oil until done.',
      'Slice the chicken into strips.',
      'In a pan, lightly sauté the zoodles for 2-3 minutes until slightly tender.',
      'Toss the zoodles with pesto and top with chicken, tomatoes, and Parmesan.',
      'Add red pepper flakes if desired.',
    ],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 8,
      fat: 22,
    },
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    mealType: 'dinner',
  },
};