'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NutritionSummaryProps {
  period: string;
}

export function NutritionSummary({ period }: NutritionSummaryProps) {
  // Sample data - in a real app, this would be calculated based on the period
  const nutritionStats = {
    averageCalories: 1850,
    averageProtein: 95,
    averageCarbs: 180,
    averageFat: 60,
    goalAchievement: 85, // percentage
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nutrition summary per {period}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. Calories</span>
            <span className="font-medium">{nutritionStats.averageCalories} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. Protein</span>
            <span className="font-medium">{nutritionStats.averageProtein}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. Carbs</span>
            <span className="font-medium">{nutritionStats.averageCarbs}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. Fat</span>
            <span className="font-medium">{nutritionStats.averageFat}g</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground">Goal Achievement</span>
            <span className="font-medium">{nutritionStats.goalAchievement}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
