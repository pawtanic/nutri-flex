'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WaterQuickAdd } from '@/app/(frontend)/hydration/_components/water-quick-add';
import { DateHeader } from '@/components/date-header';
import { CircularWaterTracker } from '@/app/(frontend)/hydration/_components/circular-water-tracker';
import { calculateWaterIntakeUpdate, showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { HydrationSetupPrompt } from './hydration-setup-prompt';
import { AuthRequiredPrompt } from './auth-required-prompt';
import { useAuth } from '@/app/(frontend)/context/auth';

// todo: why setting url is so slow only in hydration ? investigate
// need data from api to test data change when date is changed
export default function WaterIntakeClient({ hydration }: { hydration: number }) {
  const { isUserAuthenticated } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const waterPercentage = Math.min(Math.round((waterIntake / hydration) * 100), 100);
  const validatedWaterPercentage = isNaN(waterPercentage) ? 0 : waterPercentage;
  const goalReached = waterIntake >= hydration;
  const validWaterIntake = waterIntake > 0 ? waterIntake : 0;

  const handleQuickAdd = (amount: number) => {
    setWaterIntake(prev => {
      const newIntake = prev + amount;
      const { shouldUpdate, toastMessage } = calculateWaterIntakeUpdate(prev, amount, hydration);
      if (shouldUpdate && toastMessage) {
        showSuccessToast(toastMessage);
      }
      return shouldUpdate ? newIntake : prev;
    });
  };

  const handleManualInput = (value: string) => {
    const parsedValue = parseInt(value) || 0;
    if (parsedValue < 0) return;
    setWaterIntake(parsedValue);
  };

  const handleReset = () => {
    setWaterIntake(0);
  };

  const noHydrationGoalContent = isUserAuthenticated ? (
    <HydrationSetupPrompt />
  ) : (
    <AuthRequiredPrompt />
  );

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Water Intake" />
      {hydration ? (
        <>
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4">
                <h2 className="font-semibold">Today&apos;s Hydration</h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <CircularWaterTracker
                  percentage={validatedWaterPercentage}
                  waterIntake={waterIntake}
                  goal={hydration}
                  goalReached={goalReached}
                />
              </div>
            </CardContent>
          </Card>
          <WaterQuickAdd
            waterIntake={validWaterIntake}
            goalReached={goalReached}
            onAddWaterAction={handleQuickAdd}
            onHandleManualInput={handleManualInput}
            onHandleReset={handleReset}
          />
        </>
      ) : (
        noHydrationGoalContent
      )}
    </div>
  );
}
