'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Scale, User } from 'lucide-react';

interface WaterGoalSettingProps {
  currentGoal: number;
  onUpdateGoal: (goal: number) => void;
}

export function WaterGoalSetting({ currentGoal, onUpdateGoal }: WaterGoalSettingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(currentGoal.toString());
  const [weight, setWeight] = useState(70); // kg
  const [activity, setActivity] = useState('moderate');

  const handleSave = () => {
    const newGoal = Number.parseInt(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      onUpdateGoal(newGoal);
    } else {
      setGoalInput(currentGoal.toString());
    }
    setIsEditing(false);
  };

  const calculateGoalFromWeight = () => {
    // Simple calculation: weight in kg * activity factor / 30 (to get glasses)
    const activityFactor = activity === 'low' ? 30 : activity === 'moderate' ? 35 : 40;
    const recommendedMl = weight * activityFactor;
    const recommendedGlasses = Math.round(recommendedMl / 250);
    setGoalInput(recommendedGlasses.toString());
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Water Goal</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2 mb-4">
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
                <Label htmlFor="water-goal">Glasses of water (250ml each)</Label>
                <Input
                  id="water-goal"
                  type="number"
                  min="1"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 8 glasses (2 liters) per day
                </p>
              </div>
            </TabsContent>

            <TabsContent value="calculate" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
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
                      className={activity === 'low' ? 'bg-blue-500' : ''}
                      onClick={() => setActivity('low')}
                    >
                      Low
                    </Button>
                    <Button
                      type="button"
                      variant={activity === 'moderate' ? 'default' : 'outline'}
                      className={activity === 'moderate' ? 'bg-blue-500' : ''}
                      onClick={() => setActivity('moderate')}
                    >
                      Moderate
                    </Button>
                    <Button
                      type="button"
                      variant={activity === 'high' ? 'default' : 'outline'}
                      className={activity === 'high' ? 'bg-blue-500' : ''}
                      onClick={() => setActivity('high')}
                    >
                      High
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={calculateGoalFromWeight}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Calculate Recommendation
                </Button>

                {goalInput !== currentGoal.toString() && (
                  <div className="text-sm text-center">
                    Recommended: {goalInput} glasses per day
                  </div>
                )}
              </div>
            </TabsContent>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setGoalInput(currentGoal.toString());
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleSave}>
                Save
              </Button>
            </div>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{currentGoal} glasses per day</p>
                <p className="text-sm text-muted-foreground">{currentGoal * 250}ml total</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Change
              </Button>
            </div>

            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <p className="text-blue-700">
                <span className="font-medium">Pro tip:</span> Drinking water regularly throughout
                the day is better than all at once.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
