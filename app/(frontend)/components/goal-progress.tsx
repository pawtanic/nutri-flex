'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Sample data - in a real app, this would be calculated based on the period
const goals = [
  {
    name: 'Weekly Workouts',
    current: 3,
    target: 4,
    percentage: 75,
  },
  {
    name: 'Daily Water',
    current: 6,
    target: 8,
    percentage: 75,
    unit: 'glasses',
  },
  {
    name: 'Calorie Goal',
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
];

interface GoalProgressProps {
  period: string;
}

export function GoalProgress({ period }: GoalProgressProps) {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Goal Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => (
          <div key={goal.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{goal.name}</span>
              <span>
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <Progress value={goal.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
