'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar } from 'lucide-react';

export function WaterIntakeHistory() {
  // Sample data for the past week
  const weekHistory = [
    { day: 'Mon', amount: 6, goal: 8 },
    { day: 'Tue', amount: 8, goal: 8 },
    { day: 'Wed', amount: 7, goal: 8 },
    { day: 'Thu', amount: 5, goal: 8 },
    { day: 'Fri', amount: 8, goal: 8 },
    { day: 'Sat', amount: 4, goal: 8 },
    { day: 'Sun', amount: 5, goal: 8 },
  ];

  // Calculate weekly average
  const weeklyTotal = weekHistory.reduce((sum, day) => sum + day.amount, 0);
  const weeklyAverage = (weeklyTotal / weekHistory.length).toFixed(1);
  const weeklyGoalTotal = weekHistory.reduce((sum, day) => sum + day.goal, 0);
  const weeklyPercentage = Math.round((weeklyTotal / weeklyGoalTotal) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Weekly History</CardTitle>
          <div className="text-sm text-muted-foreground">Avg: {weeklyAverage} glasses/day</div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Chart View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {weekHistory.map(day => (
              <div key={day.day} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{day.day}</span>
                  <span>
                    {day.amount} / {day.goal} glasses
                  </span>
                </div>
                <Progress
                  value={(day.amount / day.goal) * 100}
                  className="h-2 bg-blue-100"
                  // indicatorClassName={`${day.amount >= day.goal ? 'bg-green-500' : 'bg-blue-500'}`}
                />
              </div>
            ))}

            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between text-sm font-medium">
                <span>Weekly Total</span>
                <span>{weeklyPercentage}% of goal</span>
              </div>
              <Progress
                value={weeklyPercentage}
                className="h-2 mt-1 bg-blue-100"
                // indicatorClassName="bg-blue-600"
              />
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <div className="h-48 flex items-end justify-between px-2">
              {weekHistory.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.amount}/{day.goal}
                  </div>
                  <div
                    className={`w-8 rounded-t-md ${day.amount >= day.goal ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{
                      height: `${(day.amount / 8) * 100}%`,
                      minHeight: '4px',
                    }}
                  ></div>
                  <span className="text-xs mt-2 font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
