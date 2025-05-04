'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Heart, Zap, Calendar, TrendingUp, Clock } from 'lucide-react';

interface WorkoutStatsProps {
  period: string;
  workoutType: string;
}

export function WorkoutStats({ period, workoutType }: WorkoutStatsProps) {
  // Sample statistics - in a real app, these would be calculated from your workout data
  const stats = {
    totalWorkouts: 15,
    averagePerWeek: 3.5,
    mostFrequentType: 'Strength',
    longestStreak: 5,
    totalDuration: '18h 30m',
    improvement: '+12%',
  };

  return (
    <div className="space-y-4">
      <Card className="card-shadow border-none overflow-hidden">
        <CardHeader className="pb-2 workout-gradient text-white">
          <CardTitle className="text-lg">Workout Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Total Workouts</span>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span className="font-bold">{stats.totalWorkouts}</span>
              </div>
            </div>
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Weekly Average</span>
              <div className="flex items-center mt-1">
                <Zap className="h-4 w-4 mr-1 text-primary" />
                <span className="font-bold">{stats.averagePerWeek}</span>
              </div>
            </div>
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Longest Streak</span>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                <span className="font-bold">{stats.longestStreak} days</span>
              </div>
            </div>
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Total Time</span>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                <span className="font-bold">{stats.totalDuration}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow border-none overflow-hidden">
        <CardHeader className="pb-2 workout-gradient text-white">
          <CardTitle className="text-lg">Workout Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <Dumbbell className="h-4 w-4 mr-1" />
                  Strength
                </span>
                <span>60%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-workout" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  Cardio
                </span>
                <span>30%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-workout" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Flexibility
                </span>
                <span>10%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-workout" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow border-none overflow-hidden">
        <CardHeader className="pb-2 workout-gradient text-white">
          <CardTitle className="text-lg">Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-40 flex items-end justify-between px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-8 bg-workout rounded-t-md"
                  style={{
                    height: `${[30, 45, 25, 60, 40][i]}%`,
                    opacity: i === 4 ? 1 : 0.7,
                  }}
                ></div>
                <span className="text-xs mt-2">{month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
