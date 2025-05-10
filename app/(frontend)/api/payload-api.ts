import { RecipeGeneratorParams } from '@/app/(frontend)/nutrition/hooks/use-recipe-generator';
import { Recipe } from '@/app/(frontend)/nutrition/_components/recipe/recipe-types';

// change for production !
const BACKEND_API_BASE_URL = `http://localhost:3000/api`;
// const BACKEND_API_BASE_URL = process.env.PAYLOAD_API_URL;

// remove and move closer to nutrition ?
export const recipeKeys = {
  all: ['recipes'] as const,
  // recipe: (id: string) => [...recipeKeys.all, id] as const,
};

export const recipeApi = {
  generateRecipe: async (params: RecipeGeneratorParams): Promise<Recipe> => {
    const response = await fetch(`${BACKEND_API_BASE_URL}/ai/recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return response.json();
  },
  saveRecipe: async (recipe: Recipe) => {
    const response = await fetch(`${BACKEND_API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    return response.json();
  },
};
