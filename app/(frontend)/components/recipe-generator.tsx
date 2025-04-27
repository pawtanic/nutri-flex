'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Ingredient {
  name: string;
  amount: string;
}

interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionValues;
  prepTime: string;
  cookTime: string;
  mealType: string;
}

export function RecipeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState('balanced');
  const [showInstructions, setShowInstructions] = useState(false);

  // Sample recipe data - in a real app, this would come from an AI API
  const sampleRecipes = {
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

  const handleGenerateRecipe = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      // In a real app, you would call an AI API here
      // For now, we'll use sample data based on dietary preference
      if (dietaryPreference === 'balanced') {
        setRecipe(sampleRecipes.balanced);
      } else if (dietaryPreference === 'highProtein') {
        setRecipe(sampleRecipes.highProtein);
      } else {
        setRecipe(sampleRecipes.lowCarb);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveMeal = () => {
    // In a real app, you would save the recipe to your database
    // and navigate back to the nutrition page
    alert('Meal saved successfully!');
  };

  return (
    <div className="space-y-4">
      {!recipe ? (
        <>
          <div className="space-y-2">
            <Label>Dietary Preference</Label>
            <RadioGroup
              defaultValue="balanced"
              className="grid grid-cols-3 gap-2"
              onValueChange={setDietaryPreference}
            >
              <Label
                htmlFor="balanced"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  dietaryPreference === 'balanced' ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <RadioGroupItem value="balanced" id="balanced" className="sr-only" />
                Balanced
              </Label>
              <Label
                htmlFor="highProtein"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  dietaryPreference === 'highProtein' ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <RadioGroupItem value="highProtein" id="highProtein" className="sr-only" />
                High Protein
              </Label>
              <Label
                htmlFor="lowCarb"
                className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
                  dietaryPreference === 'lowCarb' ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                <RadioGroupItem value="lowCarb" id="lowCarb" className="sr-only" />
                Low Carb
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipe-prompt">What would you like to cook?</Label>
            <Textarea
              id="recipe-prompt"
              placeholder="E.g., A quick high-protein breakfast, A vegetarian dinner with quinoa, etc."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleGenerateRecipe}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{recipe.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/5">
                      {recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                      Prep: {recipe.prepTime}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                      Cook: {recipe.cookTime}
                    </Badge>
                  </div>
                </div>

                {/* Nutrition Values - Highlighted as most important */}
                <div className="bg-primary/5 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Nutrition Values</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-muted-foreground">calories</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {recipe.nutrition.protein}g
                      </div>
                      <div className="text-xs text-muted-foreground">protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {recipe.nutrition.carbs}g
                      </div>
                      <div className="text-xs text-muted-foreground">carbs</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-600">
                        {recipe.nutrition.fat}g
                      </div>
                      <div className="text-xs text-muted-foreground">fat</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ingredients</h4>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center text-sm font-medium text-primary w-full justify-between"
                  >
                    <span>Cooking Instructions</span>
                    {showInstructions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showInstructions && (
                    <ol className="mt-2 space-y-1 list-decimal list-inside">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="text-sm pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRecipe(null)}>
              Generate Another
            </Button>
            <Button className="flex-1" onClick={handleSaveMeal}>
              <Plus className="h-4 w-4 mr-2" />
              Save Meal
            </Button>
          </div>
        </div>
      )}

      {!recipe && (
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>AI will generate a recipe with detailed nutrition information</p>
        </div>
      )}
    </div>
  );
}
