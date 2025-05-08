import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RecipeDietaryPreferenceSelectProps {
  onSetDietaryPreference: (value: string) => void;
  dietaryPreference: string;
}

export const dietaryPreferenceLabels = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'highProtein', label: 'High Protein' },
  { value: 'lowCarb', label: 'Low Carb' },
];

function RecipeDietaryPreferenceSelect({
  onSetDietaryPreference,
  dietaryPreference,
}: RecipeDietaryPreferenceSelectProps) {
  return (
    <>
      <Label>Dietary Preference</Label>
      <RadioGroup
        defaultValue="balanced"
        className="grid grid-cols-3 gap-2"
        onValueChange={onSetDietaryPreference}
      >
        {dietaryPreferenceLabels.map(({ value, label }) => (
          <Label
            key={value}
            htmlFor={value}
            className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${
              dietaryPreference === value ? 'bg-primary text-white' : ''
            }`}
          >
            <RadioGroupItem value={value} id={value} className="sr-only" />
            {label}
          </Label>
        ))}
      </RadioGroup>
    </>
  );
}

export default RecipeDietaryPreferenceSelect;
