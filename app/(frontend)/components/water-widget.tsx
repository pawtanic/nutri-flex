'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function WaterWidget() {
  const [waterIntake, setWaterIntake] = useState(5);
  const waterGoal = 8;

  // Calculate percentage for progress bar
  const waterPercentage = Math.min(Math.round((waterIntake / waterGoal) * 100), 100);

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Water Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Droplet className="h-6 w-6 mr-2 stroke-primary fill-quinary" />
            <span>
              {waterIntake}/{waterGoal} glasses
            </span>
          </div>
        </div>
        <Progress value={waterPercentage} className="h-2 progress" />
      </CardContent>
    </Card>
  );
}
