'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Thermometer, Save } from 'lucide-react';
import { WaterIntakeHistory } from '@/components/water-intake-history';
import { WaterGoalSetting } from '@/components/water-goal-setting';
import { WaterQuickAdd } from '@/components/water-quick-add';
import { DateHeader } from '@/components/date-header';
import { CircularWaterTracker } from '@/components/circular-water-tracker';
import { WaterSuggestion } from '@/components/water-suggestion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WaterPage() {
  const [waterIntake, setWaterIntake] = useState(5);
  const [waterGoal, setWaterGoal] = useState(8);
  const [lastDrink, setLastDrink] = useState<Date | null>(null);
  const [temperature, setTemperature] = useState(28); // Celsius, simulated

  // Calculate percentage for progress
  const waterPercentage = Math.min(Math.round((waterIntake / waterGoal) * 100), 100);

  // Function to add water intake
  const addWater = (amount: number) => {
    setWaterIntake(prev => {
      const newValue = Math.max(0, prev + amount);
      if (amount > 0) {
        setLastDrink(new Date());
      }
      return newValue;
    });
  };

  // Function to update water goal
  const updateWaterGoal = (newGoal: number) => {
    setWaterGoal(newGoal);
  };

  // Simulate time since last drink
  useEffect(() => {
    // In a real app, you would load the last drink time from storage
    if (!lastDrink) {
      // Set a default last drink time (3 hours ago)
      const threeHoursAgo = new Date();
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
      setLastDrink(threeHoursAgo);
    }
  }, [lastDrink]);

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Water Intake" />

      {/* Main Water Tracker */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4">
            <h2 className="font-semibold">Today's Hydration</h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <Thermometer className="h-3 w-3 mr-1" />
              <span>{temperature}°C</span>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center">
            <CircularWaterTracker
              percentage={waterPercentage}
              current={waterIntake}
              goal={waterGoal}
            />

            <div className="flex gap-3 mt-6 w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() => addWater(-1)}
                disabled={waterIntake <= 0}
                className="h-12 w-12"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <Button
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600"
                // onClick={() => addWater(1)}
              >
                <Save className="h-5 w-5 mr-2" />
                Save daily intake
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => addWater(1)}
                className="h-12 w-12"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Suggestion */}
      <WaterSuggestion
        percentage={waterPercentage}
        temperature={temperature}
        lastDrink={lastDrink}
      />

      <Tabs defaultValue="quick-add" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick-add">Quick Add</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-add" className="mt-4">
          <WaterQuickAdd onAddWater={addWater} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <WaterIntakeHistory />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <WaterGoalSetting currentGoal={waterGoal} onUpdateGoal={updateWaterGoal} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
