"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Heart, Zap } from "lucide-react"

interface WorkoutSummaryProps {
  period: string
}

export function WorkoutSummary({ period }: WorkoutSummaryProps) {
  // Sample data - in a real app, this would be calculated based on the period
  const workoutStats = {
    total: 12,
    byType: {
      strength: 7,
      cardio: 3,
      flexibility: 2,
    },
    averagePerWeek: 3,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Workout Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Dumbbell className="h-5 w-5 mb-1 text-primary" />
            <span className="text-xs text-muted-foreground">Strength</span>
            <span className="font-bold">{workoutStats.byType.strength}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Heart className="h-5 w-5 mb-1 text-primary" />
            <span className="text-xs text-muted-foreground">Cardio</span>
            <span className="font-bold">{workoutStats.byType.cardio}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <Zap className="h-5 w-5 mb-1 text-primary" />
            <span className="text-xs text-muted-foreground">Flexibility</span>
            <span className="font-bold">{workoutStats.byType.flexibility}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Workouts</span>
          <span className="font-medium">{workoutStats.total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Average Per Week</span>
          <span className="font-medium">{workoutStats.averagePerWeek}</span>
        </div>
      </CardContent>
    </Card>
  )
}
