'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { showSuccessToast, showErrorToast } from '@/app/(frontend)/utils/helpers';
import { initialState, saveFitnessGoals } from '@/app/(frontend)/settings/_actions/fitness-goals';
import { useFocusError } from '@/hooks/use-focus-error';

// The component
export function FitnessGoalsForm() {
  const [state, action, isPending] = useActionState(saveFitnessGoals, initialState);
  useFocusError(state.errors);

  useEffect(() => {
    if (state.success) {
      showSuccessToast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state.success, state.message]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
        <CardDescription>Set your fitness and nutrition goals</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="calories">Daily Calorie Target</Label>
            <Input
              className="col-span-2"
              id="calories"
              name="calories"
              type="number"
              placeholder="2000"
              defaultValue={state.inputs?.calories}
              aria-invalid={!!state.errors?.calories}
              aria-describedby={state.errors?.calories ? 'calories-error' : undefined}
            />
            {state.errors?.calories && (
              <FormErrorMessage id="calories-error" errorMessage={state.errors.calories} />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="protein">Daily Protein Target (g)</Label>
            <Input
              className="col-span-2"
              id="protein"
              name="protein"
              type="number"
              placeholder="120"
              defaultValue={state.inputs?.protein}
              aria-invalid={!!state.errors?.protein}
              aria-describedby={state.errors?.protein ? 'protein-error' : undefined}
            />
            {state.errors?.protein && (
              <FormErrorMessage id="protein-error" errorMessage={state.errors.protein} />
            )}
          </div>

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

          <div className="grid gap-2">
            <Label htmlFor="workouts">Daily hydration target (ml)</Label>
            <Input
              className="col-span-2"
              id="hydration"
              name="hydration"
              type="number"
              placeholder="400"
              defaultValue={state.inputs?.hydration}
              aria-invalid={!!state.errors?.hydration}
              aria-describedby={state.errors?.hydration ? 'workouts-error' : undefined}
            />
            {state.errors?.hydration && (
              <FormErrorMessage id="hydration-error" errorMessage={state.errors.hydration} />
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
