'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MealTypeSelectorProps {
  defaultValue?: MealType;
  onChange: (value: MealType) => void;
}

export function MealTypeSelector({ defaultValue = 'breakfast', onChange }: MealTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<MealType>(defaultValue);

  const handleChange = (value: string) => {
    const mealType = value as MealType;
    setSelectedType(mealType);
    onChange(mealType);
  };

  return (
    <div>
      <Label>Meal Type</Label>
      <RadioGroup
        defaultValue={defaultValue}
        className="grid grid-cols-3 gap-2 mt-1"
        onValueChange={handleChange}
      >
        <Label
          htmlFor="breakfast"
          className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
            selectedType === 'breakfast' ? 'bg-primary text-white' : ''
          }`}
        >
          <RadioGroupItem value="breakfast" id="breakfast" className="sr-only" />
          Breakfast
        </Label>
        <Label
          htmlFor="lunch"
          className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
            selectedType === 'lunch' ? 'bg-primary text-white' : ''
          }`}
        >
          <RadioGroupItem value="lunch" id="lunch" className="sr-only" />
          Lunch
        </Label>
        <Label
          htmlFor="dinner"
          className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
            selectedType === 'dinner' ? 'bg-primary text-white' : ''
          }`}
        >
          <RadioGroupItem value="dinner" id="dinner" className="sr-only" />
          Dinner
        </Label>
      </RadioGroup>
    </div>
  );
}