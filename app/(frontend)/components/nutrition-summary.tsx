'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NutritionSummaryProps {
  period: string;
}

const nutritionStats = {
  averageCalories: 1850,
  averageProtein: 95,
  averageCarbs: 180,
  averageFat: 60,
  goalAchievement: 85, // percentage
};

const nutritionSummaryItems = [
  { label: 'Avg. Protein', value: nutritionStats.averageProtein, unit: 'g' },
  { label: 'Avg. Carbs', value: nutritionStats.averageCarbs, unit: 'g' },
  { label: 'Avg. Fat', value: nutritionStats.averageFat, unit: 'g' },
  {
    label: 'Goal Achievement',
    value: nutritionStats.goalAchievement,
    unit: '%',
    hasBorder: true,
  },
];

export function NutritionSummary({ period }: NutritionSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nutrition summary per {period}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p>Avg. Calories</p>
            <p className="font-medium">{nutritionStats.averageCalories} kcal</p>
          </div>
          {nutritionSummaryItems.map(({ label, value, unit, hasBorder }) => (
            <div key={label} className={`flex justify-between ${hasBorder ? 'pt-2 border-t' : ''}`}>
              <p>{label}</p>
              <p className="font-medium">
                {value}
                {unit}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
