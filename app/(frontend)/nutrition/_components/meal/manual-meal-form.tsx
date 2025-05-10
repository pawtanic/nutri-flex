'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { MacroSlider } from './macro-slider';
import { MealTypeSelector, MealType } from './meal-type-selector';
import { MacroValues } from './meal-types';
import { Save } from 'lucide-react';

export function ManualMealForm() {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [macros, setMacros] = useState<MacroValues>({
    protein: 20,
    carbs: 30,
    fat: 15,
  });

  const handleMacroChange = (type: keyof MacroValues, value: number) => {
    setMacros(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="meal-name">Meal Name</Label>
        <div className="relative mt-1">
          <Input
            id="meal-name"
            placeholder="Enter your meal name..."
            value={mealName}
            onChange={e => setMealName(e.target.value)}
          />
        </div>
      </div>

      <MealTypeSelector defaultValue={mealType} onChange={setMealType} />

      <MacroSlider
        label="Total Protein"
        value={macros.protein}
        max={50}
        rangeColor="bg-quaternary"
        onChange={value => handleMacroChange('protein', value)}
      />

      <MacroSlider
        label="Total Carbs"
        value={macros.carbs}
        max={100}
        rangeColor="bg-quinary"
        onChange={value => handleMacroChange('carbs', value)}
      />

      <MacroSlider
        label="Total Fat"
        value={macros.fat}
        max={50}
        rangeColor="bg-tertiary"
        onChange={value => handleMacroChange('fat', value)}
      />

      <AuthRequiredButton isBusy={false} loadingText="Saving meal..." className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Meal
      </AuthRequiredButton>
    </div>
  );
}
