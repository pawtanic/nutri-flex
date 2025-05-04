'use client';

import { Ingredient } from './recipe-types';

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <div>
      <h4 className="font-medium mb-2">Ingredients</h4>
      <ul className="space-y-1">
        {ingredients.map((ingredient, index) => (
          <IngredientItem key={index} ingredient={ingredient} />
        ))}
      </ul>
    </div>
  );
}

interface IngredientItemProps {
  ingredient: Ingredient;
}

function IngredientItem({ ingredient }: IngredientItemProps) {
  return (
    <li className="text-sm flex items-start">
      <span className="mr-2">•</span>
      <span>
        <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
      </span>
    </li>
  );
}