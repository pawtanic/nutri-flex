'use client';

import { Badge } from '@/components/ui/badge';
import { Recipe } from './recipe-types';
import { capitalize } from '@/app/(frontend)/utils/helpers';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  return (
    <div>
      <h3 className="text-xl font-bold">{recipe.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        <RecipeBadge label={capitalize(recipe.mealType)} />
        <RecipeBadge label={`Prep: ${recipe.prepTime}`} />
        <RecipeBadge label={`Cook: ${recipe.cookTime}`} />
      </div>
    </div>
  );
}

interface RecipeBadgeProps {
  label: string;
}

function RecipeBadge({ label }: RecipeBadgeProps) {
  return (
    <Badge variant="outline" className="bg-primary/5">
      {label}
    </Badge>
  );
}
