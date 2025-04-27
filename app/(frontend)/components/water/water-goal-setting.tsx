'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Scale, User } from 'lucide-react';

interface WaterGoalSettingProps {
  currentGoal: number;
  currentIntake: number;
  onUpdateGoal: (goal: number) => void;
  onUpdateIntake: (intake: number) => void;
}

export function WaterGoalSetting({
  currentGoal,
  currentIntake,
  onUpdateGoal,
  onUpdateIntake,
}: WaterGoalSettingProps) {
  const [weight, setWeight] = useState(70); // kg
  const [activity, setActivity] = useState('moderate');

  const handleSliderChange = (value: number[]) => {
    const glassesCount = Math.round(value[0] / 250); // Convert ml to glasses and round
    onUpdateGoal(glassesCount);
  };

  const handleSave = () => {
    // setIsEditing(false);
  };

  const calculateGoalFromWeight = () => {
    const activityFactor = activity === 'low' ? 30 : activity === 'moderate' ? 35 : 40;
    const recommendedMl = weight * activityFactor;
    const recommendedGlasses = Math.round(recommendedMl / 250);
    onUpdateGoal(recommendedGlasses);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Water Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manual" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="calculate" className="flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="water-goal">Set your daily water goal in ml</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    id="water-goal"
                    value={[currentGoal * 250]} // Convert glasses to ml for slider
                    min={0}
                    max={4000}
                    step={100}
                    onValueChange={handleSliderChange}
                    className="flex-1"
                  />
                  <span className="font-medium w-16 text-right">{currentGoal * 250}ml</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <p>min: 0</p>
                  {/*// todo: change max by user ?*/}
                  <p>max: 4000ml</p>
                </div>
                <hr />
                <div className="flex flex-col gap-1">
                  <p className="text-red-600 text-sm">Recommended: 2000ml - 2500ml per day</p>
                  {/*// todo: consider component with x to close tip and save to user setting */}
                  <div className="tip mt-2">
                    <p className="text-md">
                      Tip: Your needs may vary based on activity level and climate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calculate" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                  {/*// todo : grab from settings if provided*/}
                  <Label>Your Weight (kg)</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[weight]}
                    min={40}
                    max={120}
                    step={1}
                    onValueChange={value => setWeight(value[0])}
                  />
                  <span className="font-medium w-8 text-right">{weight}</span>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Activity Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={activity === 'low' ? 'default' : 'outline'}
                    onClick={() => setActivity('low')}
                  >
                    Low
                  </Button>
                  <Button
                    type="button"
                    variant={activity === 'moderate' ? 'default' : 'outline'}
                    onClick={() => setActivity('moderate')}
                  >
                    Moderate
                  </Button>
                  <Button
                    type="button"
                    variant={activity === 'high' ? 'default' : 'outline'}
                    onClick={() => setActivity('high')}
                  >
                    High
                  </Button>
                </div>
              </div>

              <Button onClick={calculateGoalFromWeight} className="w-full">
                Calculate Recommendation
              </Button>

              {currentIntake !== currentGoal && (
                <div className=" text-center">Recommended: {currentGoal} glasses per day</div>
              )}
            </div>
          </TabsContent>
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onUpdateIntake(currentIntake);
              }}
            >
              Cancel
            </Button>
            <Button className="w-full" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
