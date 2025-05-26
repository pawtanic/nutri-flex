import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calculator, Calendar, CircleHelp, Scale } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useActionState, useState } from 'react';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { saveProteinIntakeAction } from '@/app/(frontend)/settings/_actions/protein-intake';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { useFocusError } from '@/hooks/use-focus-error';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { UserFitnessData } from '@/app/(frontend)/settings/_components/fitness-goals';
import ActivityLevelPopup from '@/app/(frontend)/settings/_components/activity-level-popup';
import Link from 'next/link';

interface CalculateProteinIntakeModalProps {
  onUpdateFormDataWithCalculatedProteinValue: (value: string | undefined) => void;
  fitnessData: UserFitnessData;
}

function createInitialState(fitnessData: UserFitnessData) {
  return {
    errors: {
      weight: '',
      sex: '',
      activity: '',
    },
    message: '',
    success: false,
    inputs: {
      weight: fitnessData.weight,
      sex: fitnessData.sex,
      activity: fitnessData.activityLevel,
    },
    calculatedGoal: null as number | null,
  };
}

function getProteinState(state: ActionResponse) {
  return {
    weight: state?.inputs?.weight || 70,
    sex: (state?.inputs?.sex as 'male' | 'female') || 'male',
    activity: state?.inputs?.activity || 'moderate',
    calculatedGoal: state?.calculatedGoal,
    showResult: !!state?.calculatedGoal,
  };
}

export function CalculateProteinIntakeModal({
  onUpdateFormDataWithCalculatedProteinValue,
  fitnessData,
}: CalculateProteinIntakeModalProps) {
  const initialState = createInitialState(fitnessData);
  const [state, action, isPending] = useActionState(saveProteinIntakeAction, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useFocusError(state.errors);

  const toggleCalculateProteinModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const { weight, sex, activity, calculatedGoal, showResult } = getProteinState(state);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={toggleCalculateProteinModal}>
        <DialogContent className="max-w-[375px] max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-bold">
              Calculate Protein Intake
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center"
                    aria-label="Learn more about protein calculation"
                  >
                    <CircleHelp className="h-4 w-4 ml-2 mb-2 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <p className="text-sm text-balance">
                    Protein intake is calculated based on your weight, sex, and activity level. The
                    general recommendation is 1.2-2.0g of protein per kg of body weight, with higher
                    amounts for more active individuals.
                  </p>
                  <p className="mt-2 text-sm">Source:</p>
                  <Link
                    className="underline text-sm"
                    href="https://pubmed.ncbi.nlm.nih.gov/22150425/"
                    target="_blank"
                  >
                    Dietary protein for athletes: from requirements to optimum adaptation (2011)
                  </Link>
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
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="age">Your Age (years)</Label>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={fitnessData.age}
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
              <Label className="mb-2 block text-base" htmlFor="activity-group">
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

            {showResult && calculatedGoal && (
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-medium">Your recommended daily protein intake:</p>
                <p className="text-2xl font-bold">{calculatedGoal}g</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your weight and activity level
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
                    onUpdateFormDataWithCalculatedProteinValue(calculatedGoal?.toString());
                    toggleCalculateProteinModal();
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
        onClick={toggleCalculateProteinModal}
        className="self-end"
        type="button"
        variant="outline"
        aria-label="Calculate protein intake"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculate
      </Button>
    </>
  );
}
