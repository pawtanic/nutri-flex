'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { saveUserProfile } from '@/app/(frontend)/settings/_actions/manage-measurements';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { showSuccessToast } from '@/app/(frontend)/utils/helpers';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { useFocusError } from '@/hooks/use-focus-error';

export const initialState = {
  errors: {},
  message: '',
  success: false,
  inputs: {},
};

// for now hardcoded values
// waiting for api
const heightUnit = 'metric';
const weightUnit = 'metric';

export function UserProfileForm() {
  const [state, action, isPending] = useActionState(saveUserProfile, initialState);
  useFocusError(state.errors);

  useEffect(() => {
    if (state.success) {
      showSuccessToast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state.success, state.message]);

  async function handleAction(formData: FormData): Promise<void> {
    formData.append('heightUnit', heightUnit);
    formData.append('weightUnit', weightUnit);
    return action(formData);
  }

  const nameError = state.errors?.name;
  const emailError = state.errors?.email;
  const heightError = state.errors?.height;
  const weightError = state.errors?.weight;
  const heightFtError = state.errors?.['height-ft'];
  const heightInError = state.errors?.['height-in'];
  const weightStError = state.errors?.['weight-st'];
  const weightLbError = state.errors?.['weight-lb'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleAction} className="space-y-4">
          <FormField
            id="name"
            label="Name"
            placeholder="Your name"
            defaultValue={state?.inputs?.name}
            error={nameError}
            className="col-span-2"
          />

          <FormField
            id="email"
            label="Email"
            placeholder="Your email"
            defaultValue={state?.inputs?.email}
            error={emailError}
            className="col-span-2"
          />

          {heightUnit === 'metric' ? (
            <FormField
              id="height"
              label="Height (cm)"
              type="number"
              placeholder="175"
              defaultValue={state?.inputs?.height}
              error={heightError}
              className="col-span-2"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="height-ft"
                label="Height (ft)"
                type="number"
                placeholder="5"
                defaultValue={state?.inputs?.['height-ft']}
                error={heightFtError}
                className="col-span-2"
              />
              <FormField
                id="height-in"
                label="Height (in)"
                type="number"
                placeholder="9"
                defaultValue={state?.inputs?.['height-in']}
                error={heightInError}
                className="col-span-2"
              />
            </div>
          )}

          {weightUnit === 'metric' ? (
            <FormField
              id="weight"
              label="Weight (kg)"
              type="number"
              placeholder="70"
              defaultValue={state?.inputs?.weight}
              error={weightError}
              className="col-span-2"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="weight-st"
                label="Weight (st)"
                type="number"
                placeholder="11"
                defaultValue={state?.inputs?.['weight-st']}
                error={weightStError}
                className="col-span-2"
              />
              <FormField
                id="weight-lb"
                label="Weight (lb)"
                type="number"
                placeholder="0"
                defaultValue={state?.inputs?.['weight-lb']}
                error={weightLbError}
                className="col-span-2"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
        <br />
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </CardContent>
    </Card>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number;
  error?: string;
  className?: string;
}

function FormField({
  id,
  label,
  placeholder,
  type = 'text',
  defaultValue,
  error,
  className = '',
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className={className} htmlFor={id}>
        {label}
      </Label>
      <Input
        className={className}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        defaultValue={defaultValue}
      />
      {error && <FormErrorMessage errorMessage={error} />}
    </div>
  );
}
