'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { cn } from '@/app/(frontend)/lib/utils';

interface StreakCardProps {
  className?: string;
}

const totalWorkouts = 32;

export function StreakCard({ className }: StreakCardProps) {
  return (
    <Card className={cn('card-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="border p-2 rounded-full mr-3">
              {/*todo: color var*/}
              <Flame className="h-8 w-8 text-[#FF5C2B]" />
            </div>
            <div>
              <p className="text-muted-foreground">Current Streak</p>
              <p className="text-xl font-bold">{totalWorkouts} workouts</p>
              <p>since joined at 12/03/2024</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
