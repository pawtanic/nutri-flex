import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calculator, CircleHelp, Scale, Ruler, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useActionState, useState, useEffect } from 'react';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { saveCaloriesIntakeAction } from '@/app/(frontend)/settings/_actions/calories-intake';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { useFocusError } from '@/hooks/use-focus-error';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { UserFitnessData } from '@/app/(frontend)/settings/_components/fitness-goals';
import ActivityLevelPopup from '@/app/(frontend)/settings/_components/activity-level-popup';
import Link from 'next/link';

interface CalculateCaloriesIntakeModalProps {
  onUpdateFormDataWithCalculatedCaloriesValue: (value: string | undefined) => void;
  fitnessData: UserFitnessData;
}

function createInitialState(fitnessData: UserFitnessData) {
  return {
    errors: {
      weight: '',
      height: '',
      age: '',
      sex: '',
      activity: '',
      goal: '',
    },
    message: '',
    success: false,
    inputs: {
      weight: fitnessData.weight,
      height: fitnessData.height,
      age: fitnessData.age || 30,
      sex: fitnessData.sex,
      activity: fitnessData.activityLevel,
      goal: 'maintain',
    },
    calculatedGoal: null as number | null,
  };
}

function getCaloriesState(state: ActionResponse) {
  return {
    weight: state?.inputs?.weight || 70,
    height: state?.inputs?.height || 170,
    age: state?.inputs?.age || 30,
    sex: (state?.inputs?.sex as 'male' | 'female') || 'male',
    activity: state?.inputs?.activity || 'moderate',
    goal: (state?.inputs?.goal as 'lose' | 'maintain' | 'gain') || 'maintain',
    calculatedGoal: state?.calculatedGoal,
    showResult: !!state?.calculatedGoal,
  };
}

export function CalculateCaloriesIntakeModal({
  onUpdateFormDataWithCalculatedCaloriesValue,
  fitnessData,
}: CalculateCaloriesIntakeModalProps) {
  const initialState = createInitialState(fitnessData);
  const [state, action, isPending] = useActionState(saveCaloriesIntakeAction, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useFocusError(state.errors);

  const toggleCalculateCaloriesModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const { weight, height, age, sex, activity, goal, calculatedGoal, showResult } =
    getCaloriesState(state);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={toggleCalculateCaloriesModal}>
        <DialogContent className="max-w-[375px] max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-bold">
              Calculate Calorie Intake
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center"
                    aria-label="Learn more about calorie calculation"
                  >
                    <CircleHelp className="h-4 w-4 ml-2 mb-2 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <p className="text-sm text-balance">
                    Calorie intake is calculated using the Harris-Benedict equation, which estimates
                    your Basal Metabolic Rate (BMR) based on your weight, height, age, and sex. This
                    is then adjusted for your activity level and fitness goal to determine your
                    daily calorie needs.
                    <p className="mt-2 text-sm">Source:</p>
                    <Link
                      className="underline"
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9967803/"
                      target="_blank"
                    >
                      Revised Harris–Benedict Equation: New Human Resting Metabolic Rate Equation (
                      2008)
                    </Link>
                  </p>
                </PopoverContent>
              </Popover>
            </DialogTitle>
          </DialogHeader>
          <form action={action} className="space-y-4">
            <div className="flex flex-col mb-2">
              <Label htmlFor="sex-group">Your Sex</Label>
              <RadioGroup
                name="sex"
                id="sex-group"
                defaultValue={sex}
                className="flex my-2"
                aria-invalid={!!state?.errors?.sex}
                aria-describedby={state?.errors?.sex ? 'sex-error' : undefined}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-normal">
                    Female
                  </Label>
                </div>
              </RadioGroup>
              {state?.errors?.sex && (
                <FormErrorMessage id="sex-error" errorMessage={state.errors.sex} />
              )}
            </div>
            <hr />
            <div>
              <div className="flex items-center mb-2">
                <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="weight">Your Weight (kg)</Label>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min={20}
                  max={200}
                  step={0.1}
                  defaultValue={weight}
                  className="w-full"
                  aria-invalid={!!state?.errors?.weight}
                  aria-describedby={state?.errors?.weight ? 'weight-error' : undefined}
                />
              </div>
              {state?.errors?.weight && (
                <FormErrorMessage id="weight-error" errorMessage={state?.errors.weight} />
              )}
            </div>
            <hr />
            <div>
              <div className="flex items-center mb-2">
                <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="height">Your Height (cm)</Label>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min={100}
                  max={250}
                  step={1}
                  defaultValue={height}
                  className="w-full"
                  aria-invalid={!!state?.errors?.height}
                  aria-describedby={state?.errors?.height ? 'height-error' : undefined}
                />
              </div>
              {state?.errors?.height && (
                <FormErrorMessage id="height-error" errorMessage={state?.errors.height} />
              )}
            </div>
            <hr />
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="age">Your Age (years)</Label>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={18}
                  max={120}
                  step={1}
                  defaultValue={age}
                  className="w-full"
                  aria-invalid={!!state?.errors?.age}
                  aria-describedby={state?.errors?.age ? 'age-error' : undefined}
                />
              </div>
              {state?.errors?.age && (
                <FormErrorMessage id="age-error" errorMessage={state?.errors.age} />
              )}
            </div>
            <hr />
            <div className="flex flex-col">
              <Label className="mb-2 block" htmlFor="activity-group">
                Activity Level
                <ActivityLevelPopup />
              </Label>
              <RadioGroup
                name="activity"
                id="activity-group"
                defaultValue={activity}
                className="space-y-2"
                aria-invalid={!!state?.errors?.activity}
                aria-describedby={state?.errors?.activity ? 'activity-error' : undefined}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal">
                    None
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal">
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className="font-normal">
                    Moderate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="heavy" id="heavy" />
                  <Label htmlFor="heavy" className="font-normal">
                    Heavy
                  </Label>
                </div>
              </RadioGroup>
              {state?.errors?.activity && (
                <FormErrorMessage id="activity-error" errorMessage={state.errors.activity} />
              )}
            </div>
            <hr />
            <div className="flex flex-col">
              <Label className="mb-2 block" htmlFor="goal-group">
                Your Goal
              </Label>
              <RadioGroup
                name="goal"
                id="goal-group"
                defaultValue={goal}
                className="space-y-2"
                aria-invalid={!!state?.errors?.goal}
                aria-describedby={state?.errors?.goal ? 'goal-error' : undefined}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lose" id="lose" />
                  <Label htmlFor="lose" className="font-normal">
                    Lose Weight
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain" className="font-normal">
                    Maintain Weight
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gain" id="gain" />
                  <Label htmlFor="gain" className="font-normal">
                    Gain Weight
                  </Label>
                </div>
              </RadioGroup>
              {state?.errors?.goal && (
                <FormErrorMessage id="goal-error" errorMessage={state.errors.goal} />
              )}
            </div>

            {showResult && calculatedGoal && (
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-medium">Your recommended daily calorie intake:</p>
                <p className="text-2xl font-bold">{calculatedGoal} kcal</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your stats and{' '}
                  {goal === 'lose'
                    ? 'weight loss'
                    : goal === 'gain'
                      ? 'weight gain'
                      : 'maintenance'}{' '}
                  goal
                </p>
              </div>
            )}

            {state.message && !state.success && <WarningAlert description={state.message} />}

            {showResult ? (
              <>
                <Button
                  type="button"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => {
                    onUpdateFormDataWithCalculatedCaloriesValue(calculatedGoal?.toString());
                    toggleCalculateCaloriesModal();
                  }}
                >
                  Save and Close
                </Button>
                <Button className="w-full mt-2 bg-transparent border border-black text-black hover:text-white">
                  Recalculate
                </Button>
              </>
            ) : (
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Calculating...' : 'Calculate'}
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={toggleCalculateCaloriesModal}
        className="self-end"
        type="button"
        variant="outline"
        aria-label="Calculate calorie intake"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculate
      </Button>
    </>
  );
}
