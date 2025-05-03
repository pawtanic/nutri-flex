'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Recipe } from './recipe-types';
import { RecipeHeader } from './recipe-header';
import { NutritionValues } from './nutrition-values';
import { IngredientsList } from './ingredients-list';
import { InstructionsList } from './instructions-list';

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnother: () => void;
  onSaveMeal: () => void;
}

export function RecipeDisplay({ 
  recipe, 
  onGenerateAnother, 
  onSaveMeal 
}: RecipeDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <RecipeHeader recipe={recipe} />
            <NutritionValues nutrition={recipe.nutrition} />
            <IngredientsList ingredients={recipe.ingredients} />
            <InstructionsList instructions={recipe.instructions} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onGenerateAnother}>
          Generate Another
        </Button>
        <Button className="flex-1" onClick={onSaveMeal}>
          <Plus className="h-4 w-4 mr-2" />
          Save Meal
        </Button>
      </div>
    </div>
  );
}