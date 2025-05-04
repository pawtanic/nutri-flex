'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WaterIntakeHistory } from '@/app/(frontend)/water/_components/water-intake-history';
import { WaterGoalSetting } from '@/app/(frontend)/water/_components/water-goal-setting';
import { WaterQuickAdd } from '@/app/(frontend)/water/_components/water-quick-add';
import { DateHeader } from '@/components/date-header';
import { CircularWaterTracker } from '@/app/(frontend)/water/_components/circular-water-tracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WaterPage() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);
  const waterPercentage = Math.min(Math.round((waterIntake / waterGoal) * 100), 100);
  const validatedWaterPercentage = isNaN(waterPercentage) ? 0 : waterPercentage;

  const handleWaterChange = (amount: number) => {
    setWaterIntake(amount);
  };

  const updateWaterGoal = (newGoal: number) => {
    setWaterGoal(newGoal);
  };

  console.log(!!waterGoal);

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Water Intake" />
      {/* Main Water Tracker */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4">
            <h2 className="font-semibold">Today&apos;s Hydration</h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <CircularWaterTracker
              percentage={validatedWaterPercentage}
              current={waterIntake}
              goal={waterGoal}
            />
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue={!!waterGoal ? 'quick-add' : 'settings'} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger disabled={!Boolean(waterGoal)} value="quick-add">
            Today&apos;s intake
          </TabsTrigger>
          <TabsTrigger disabled={!Boolean(waterGoal)} value="history">
            History
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-add" className="mt-4">
          <WaterQuickAdd onAddWaterAction={handleWaterChange} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <WaterIntakeHistory />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <WaterGoalSetting
            currentGoal={waterGoal}
            currentIntake={waterIntake}
            onUpdateGoal={updateWaterGoal}
            onUpdateIntake={handleWaterChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
