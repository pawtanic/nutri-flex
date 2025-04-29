'use client';

import { NutritionValues as NutritionValuesType } from './recipe-types';

interface NutritionValuesProps {
  nutrition: NutritionValuesType;
}

export function NutritionValues({ nutrition }: NutritionValuesProps) {
  return (
    <div className="p-3 rounded-lg">
      <h4 className="font-medium mb-2">Nutrition Values</h4>
      <div className="grid grid-cols-4 gap-2 text-center">
        <NutritionItem 
          value={nutrition.calories} 
          label="calories" 
          bgClass="bg-backgroundSecondary" 
        />
        <NutritionItem 
          value={`${nutrition.protein}g`} 
          label="protein" 
          bgClass="bg-tertiary" 
        />
        <NutritionItem 
          value={`${nutrition.carbs}g`} 
          label="carbs" 
          bgClass="bg-quinary" 
        />
        <NutritionItem 
          value={`${nutrition.fat}g`} 
          label="fat" 
          bgClass="bg-quaternary" 
        />
      </div>
    </div>
  );
}

interface NutritionItemProps {
  value: string | number;
  label: string;
  bgClass: string;
}

function NutritionItem({ value, label, bgClass }: NutritionItemProps) {
  return (
    <div className={`shadow rounded-md p-2 space-y-1 ${bgClass}`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}