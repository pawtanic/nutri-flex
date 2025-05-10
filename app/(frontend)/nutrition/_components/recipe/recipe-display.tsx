'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Recipe } from './recipe-types';
import { RecipeHeader } from './recipe-header';
import { NutritionValues } from './nutrition-values';
import { IngredientsList } from './ingredients-list';
import { InstructionsList } from './instructions-list';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnotherAction: () => void;
}

export function RecipeDisplay({ recipe, onGenerateAnotherAction }: RecipeDisplayProps) {
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
        <Button variant="outline" className="flex-1" onClick={onGenerateAnotherAction}>
          Generate Another
        </Button>
        <AuthRequiredButton loadingText="Saving meal..." isBusy={false}>
          <Plus className="h-4 w-4 mr-2" />
          Save Meal
        </AuthRequiredButton>
      </div>
    </div>
  );
}
