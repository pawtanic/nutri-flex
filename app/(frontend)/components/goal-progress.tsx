'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getFillColor } from '@/app/(frontend)/utils/helpers';

// Sample data - in a real app, this would be calculated based on the period
const goals = [
  {
    name: 'Weekly Workouts',
    current: 3,
    target: 4,
    percentage: 75,
    unit: '',
  },
  {
    name: 'Daily Water',
    current: 600,
    target: 1800,
    percentage: 75,
    unit: 'ml',
  },
  {
    name: 'Calories Goal',
    current: 1800,
    target: 2000,
    percentage: 90,
    unit: 'kcal',
  },
  {
    name: 'Protein Intake',
    current: 100,
    target: 120,
    percentage: 83,
    unit: 'g',
  },
] as const;

export function GoalProgress() {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Goal progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => (
          <div key={goal.name} className="space-y-1">
            <div className="flex justify-between">
              <p>{goal.name}</p>
              <p>
                {goal.current} / {goal.target} {goal.unit}
              </p>
            </div>
            <Progress
              value={goal.percentage}
              className="h-2 progress"
              progressFill={getFillColor(goal.name)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
