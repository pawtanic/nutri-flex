'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { initialState, saveFitnessGoals } from '@/app/(frontend)/settings/_actions/fitness-goals';
import { useFocusError } from '@/hooks/use-focus-error';
import { UserFitnessData } from '@/app/(frontend)/settings/_components/fitness-goals';
import { FormFieldWithCalculationModal } from '@/app/(frontend)/settings/_components/form-field-with-calculation-modal';
import { CalculateHydrationIntakeModal } from '@/app/(frontend)/settings/_components/calculate-hydration-intake-modal';
import { CalculateProteinIntakeModal } from '@/app/(frontend)/settings/_components/calculate-protein-intake-modal';
import { CalculateCaloriesIntakeModal } from '@/app/(frontend)/settings/_components/calculate-calories-intake-modal';

function updateFormValue(
  formRef: React.RefObject<HTMLFormElement | null>,
  value: string | undefined,
  formFieldName: string
) {
  if (!formRef.current) return;
  if (!value) return;

  const formData = new FormData(formRef.current);
  formData.set(formFieldName, value);

  const hydrationInput = formRef.current.elements.namedItem(formFieldName) as HTMLInputElement;
  if (hydrationInput) {
    hydrationInput.value = value;
  }
}

export function FitnessGoalsForm({ fitnessData }: { fitnessData: UserFitnessData }) {
  const [state, action, isPending] = useActionState(saveFitnessGoals, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusError(state.errors);

  // find better approach than UE in entire app !
  useEffect(() => {
    if (state.success) {
      showSuccessToast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state]);

  const handleHydrationValueUpdate = (value: string | undefined) =>
    updateFormValue(formRef, value, 'hydration');

  const handleProteinValueUpdate = (value: string | undefined) =>
    updateFormValue(formRef, value, 'protein');

  const handleCaloriesValueUpdate = (value: string | undefined) =>
    updateFormValue(formRef, value, 'calories');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
        <CardDescription>Set your fitness and nutrition goals</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
          <FormFieldWithCalculationModal
            fieldId="calories"
            state={state}
            label="Daily Calories Target"
            input={{ id: 'calories', type: 'number', placeholder: '2000' }}
            errorMessageId="calories-error"
          >
            <CalculateCaloriesIntakeModal
              fitnessData={fitnessData}
              onUpdateFormDataWithCalculatedCaloriesValue={handleCaloriesValueUpdate}
            />
          </FormFieldWithCalculationModal>

          <FormFieldWithCalculationModal
            fieldId="protein"
            state={state}
            label="Daily Protein Target (g) "
            input={{ id: 'protein', type: 'number', placeholder: '120' }}
            errorMessageId="protein-error"
          >
            <CalculateProteinIntakeModal
              fitnessData={fitnessData}
              onUpdateFormDataWithCalculatedProteinValue={handleProteinValueUpdate}
            />
          </FormFieldWithCalculationModal>

          <FormFieldWithCalculationModal
            fieldId="hydration"
            state={state}
            label="Daily hydration target (ml)"
            input={{
              id: 'hydration',
              type: 'number',
              placeholder: '400',
              value: state.inputs?.hydration,
            }}
            errorMessageId="hydration-error"
          >
            <CalculateHydrationIntakeModal
              fitnessData={fitnessData}
              onUpdateFormDataWithCalculatedHydrationValue={handleHydrationValueUpdate}
            />
          </FormFieldWithCalculationModal>

          <div className="grid gap-2">
            <Label htmlFor="workouts">Weekly Workout Target</Label>
            <Input
              className="col-span-2"
              id="workouts"
              name="workouts"
              type="number"
              placeholder="4"
              defaultValue={state.inputs?.workouts}
              aria-invalid={!!state.errors?.workouts}
              aria-describedby={state.errors?.workouts ? 'workouts-error' : undefined}
            />
            {state.errors?.workouts && (
              <FormErrorMessage id="workouts-error" errorMessage={state.errors.workouts} />
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Goals'}
          </Button>
        </form>
        <br />
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </CardContent>
    </Card>
  );
}
