import React, { useActionState, useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calculator, CircleHelp, Scale } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { saveHydrationIntakeAction } from '@/app/(frontend)/settings/_actions/hydration-intake';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { useFocusError } from '@/hooks/use-focus-error';
import { Checkbox } from '@/components/ui/checkbox';
import { UserFitnessData } from '@/app/(frontend)/settings/_components/fitness-goals';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import ActivityLevelPopup from '@/app/(frontend)/settings/_components/activity-level-popup';

function createInitialState(fitnessData: UserFitnessData) {
  return {
    errors: {
      weight: '',
      sex: '',
      activity: '',
      includeFood: '',
    },
    message: '',
    success: false,
    inputs: {
      weight: fitnessData.weight,
      sex: fitnessData.sex,
      activity: fitnessData.activityLevel,
      includeFood: false,
      // simp;lify to just kcal ?
      initialFoodDataKcal: {
        kcal: fitnessData.calories,
      },
    },
    calculatedGoal: null,
  };
}
function getHydrationState(state: ActionResponse) {
  return {
    weight: state?.inputs?.weight || '',
    sex: (state?.inputs?.sex as 'male' | 'female') || 'male',
    activity: state?.inputs?.activity || 'moderate',
    calculatedGoal: state?.calculatedGoal,
    showResult: !state?.errors?.includeFood && state?.calculatedGoal,
  };
}

interface CalculateHydrationIntakeModalProps {
  fitnessData: UserFitnessData;
  onUpdateFormDataWithCalculatedHydrationValue: (value: string | undefined) => void;
}

export function CalculateHydrationIntakeModal({
  fitnessData,
  onUpdateFormDataWithCalculatedHydrationValue,
}: CalculateHydrationIntakeModalProps) {
  const initialState = createInitialState(fitnessData);
  const [state, action, isPending] = useActionState(saveHydrationIntakeAction, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeFoodChecked, setIncludeFoodChecked] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();

  useFocusError(state.errors);

  const toggleCalculateHydrationModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const { weight, sex, activity, calculatedGoal, showResult } = getHydrationState(state);
  async function handleAction(formData: FormData): Promise<void> {
    const initialFoodDataKcal = initialState.inputs.initialFoodDataKcal?.kcal;
    const isFoodDataPresent = includeFoodChecked && initialFoodDataKcal;

    if (isFoodDataPresent) {
      formData.set('includeFood', 'on');
      formData.set('initialFoodDataKcal', initialFoodDataKcal.toString());
    }

    return action(formData);
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={toggleCalculateHydrationModal}>
        <DialogContent className="max-w-[375px]">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-bold">
              Calculate Hydration Goal
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="h-4 w-4 ml-2 mb-2 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm text-balance">
                    <p className="mb-2 text-sm">Source:</p>
                    <Link
                      href="https://nap.nationalacademies.org/read/10925/chapter/6"
                      target="_blank"
                      className="underline"
                    >
                      Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate
                      (2005)
                    </Link>
                  </p>
                </PopoverContent>
              </Popover>
            </DialogTitle>
          </DialogHeader>
          <form action={handleAction} className="space-y-4">
            <div className="flex flex-col mb-2">
              <Label htmlFor="sex-group">Your Sex</Label>
              <RadioGroup name="sex" id="sex-group" defaultValue={sex} className="flex my-2">
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
                  defaultValue={weight}
                  aria-describedby={state?.errors?.weight ? 'weight-error' : undefined}
                  aria-invalid={!!state?.errors?.weight}
                  step={0.1}
                />
              </div>
              {state?.errors?.weight && (
                <FormErrorMessage id="weight-error" errorMessage={state?.errors.weight} />
              )}
            </div>
            <hr />
            <div>
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
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="includeFood"
                name="includeFood"
                checked={includeFoodChecked}
                onCheckedChange={checked => {
                  const newCheckedState = checked === true;
                  setIncludeFoodChecked(newCheckedState);

                  // If we already have a calculation, recalculate when checkbox changes
                  if (calculatedGoal && showResult) {
                    startTransition(() => {
                      const formData = new FormData();
                      formData.set('sex', sex);
                      formData.set('weight', weight.toString());
                      formData.set('activity', activity);

                      if (newCheckedState && initialState.inputs.initialFoodDataKcal?.kcal) {
                        formData.set('includeFood', 'on');
                        formData.set(
                          'initialFoodDataKcal',
                          initialState.inputs.initialFoodDataKcal.kcal.toString()
                        );
                      }

                      action(formData);
                    });
                  }
                }}
                aria-describedby={state?.errors?.includeFood ? 'include-food-error' : undefined}
                aria-invalid={!!state?.errors?.includeFood}
              />
              <Label htmlFor="includeFood" className="font-normal">
                Include food intake?
              </Label>
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="h-4 w-4 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm">
                    Including food intake will adjust your hydration needs based on your daily
                    calorie intake. Make sure to set your daily calorie goal in your profile
                    settings first.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            {state?.errors?.includeFood && (
              <FormErrorMessage
                id="include-food-error"
                errorMessage={state.errors.includeFood}
                className="mt-1"
              />
            )}
            <hr />
            {showResult && (
              <>
                <div className="p-4 bg-muted/50 rounded-md">
                  <p className="font-medium">Your recommended daily water intake:</p>
                  <p className="text-2xl font-bold">{calculatedGoal} ml</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your weight, activity level
                    {includeFoodChecked && ' and your food intake'}
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  disabled={isPending || isPendingTransition}
                  onClick={() => {
                    onUpdateFormDataWithCalculatedHydrationValue(calculatedGoal?.toString());
                    toggleCalculateHydrationModal();
                  }}
                >
                  Save and Close
                </Button>
                <Button className="w-full mt-2 bg-transparent border border-black text-black hover:text-white">
                  Recalculate
                </Button>
              </>
            )}

            {!showResult && (
              <Button type="submit" className="w-full" disabled={isPending || isPendingTransition}>
                {isPending || isPendingTransition ? 'Calculating...' : 'Calculate'}
              </Button>
            )}

            {!state.success && state.message && <WarningAlert description={state.message} />}
          </form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={toggleCalculateHydrationModal}
        className="self-end"
        type="button"
        variant="outline"
        aria-label="open calculate hydration modal"
      >
        <Calculator aria-hidden="true" className="h-4 w-4 mr-2" />
        Calculate
      </Button>
    </>
  );
}
