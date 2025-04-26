'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Dumbbell } from 'lucide-react';

interface WorkoutSummaryProps {
  period: string;
}

// Sample data - in a real app, this would be calculated based on the period
const workoutStats = {
  total: 12,
  byType: {
    strength: 7,
    cardio: 3,
    flexibility: 2,
  },
  averagePerWeek: 3,
};

export function WorkoutSummary({ period }: WorkoutSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Workout Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between my-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="small-icon" />
            <p>Total workouts</p>
          </div>
          <p className="font-medium">{workoutStats.total}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="small-icon" />
            <p>Average per {period}</p>
          </div>
          <p className="font-medium">{workoutStats.averagePerWeek}</p>
        </div>
      </CardContent>
    </Card>
  );
}
