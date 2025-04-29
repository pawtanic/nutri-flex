'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MacroSliderProps {
  label: string;
  value: number;
  max: number;
  rangeColor: string;
  onChange: (value: number) => void;
}

export function MacroSlider({ label, value, max, rangeColor, onChange }: MacroSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <Label>{label}</Label>
        <span className="text-sm">{value}g</span>
      </div>
      <Slider
        rangeColor={rangeColor}
        defaultValue={[value]}
        value={[value]}
        max={max}
        step={1}
        className="my-4"
        onValueChange={handleValueChange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0g</span>
        <span>{max}g</span>
      </div>
    </div>
  );
}