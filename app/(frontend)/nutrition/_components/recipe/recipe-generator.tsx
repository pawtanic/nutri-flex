'use client';

import { useState } from 'react';
import { RecipeForm } from './recipe-form';
import { RecipeDisplay } from './recipe-display';
import { Recipe } from './recipe-types';
import { useRecipeGenerator } from '@/app/(frontend)/nutrition/hooks/use-recipe-generator';
import RecipeDietaryPreferenceSelect, {
  dietaryPreferenceLabels,
} from '@/app/(frontend)/nutrition/_components/recipe/recipe-dietary-preference-select';
// import { useSaveRecipe } from '@/app/(frontend)/nutrition/hooks/save-recipe';

export function RecipeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState(dietaryPreferenceLabels[0].value);

  const { generateRecipe, isGenerating } = useRecipeGenerator();
  // const { handleSaveMeal } = useSaveRecipe();

  const handleGenerateRecipe = async () => {
    if (!prompt.trim()) return;

    const generatedRecipe = await generateRecipe({
      query: prompt,
      goal: dietaryPreference,
    });
    setRecipe(generatedRecipe);
  };

  const handleGenerateAnotherRecipe = () => {
    setRecipe(null);
  };

  return (
    <div className="space-y-4">
      {!recipe ? (
        <>
          <RecipeDietaryPreferenceSelect
            onSetDietaryPreference={setDietaryPreference}
            dietaryPreference={dietaryPreference}
          />
          <RecipeForm
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            onGenerate={handleGenerateRecipe}
          />
          <div className="text-center text-sm text-muted-foreground mt-6">
            <p>AI will generate a recipe with detailed nutrition information</p>
          </div>
        </>
      ) : (
        <RecipeDisplay
          recipe={recipe!}
          // recipe={recipe}
          onGenerateAnotherAction={handleGenerateAnotherRecipe}
        />
      )}
    </div>
  );
}
