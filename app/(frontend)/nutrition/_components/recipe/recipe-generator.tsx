'use client';

import { useState } from 'react';
import { RecipeForm } from './recipe-form';
import { RecipeDisplay } from './recipe-display';
import { Recipe, sampleRecipes } from './recipe-types';

export function RecipeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleGenerateRecipe = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // In a real app, this would call an API to generate a recipe
    // For now, we're using sample data
    setTimeout(() => {
      setRecipe(sampleRecipes.balanced);
      setIsGenerating(false);
    }, 1000);
  };

  const handleSaveMeal = () => {
    // In a real app, you would save the recipe to your database
    // and navigate back to the nutrition page
    alert('Meal saved successfully!');
  };

  const handleGenerateAnother = () => {
    setRecipe(null);
  };

  return (
    <div className="space-y-4">
      {!recipe ? (
        <>
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
          recipe={recipe}
          onGenerateAnother={handleGenerateAnother}
          onSaveMeal={handleSaveMeal}
        />
      )}
    </div>
  );
}