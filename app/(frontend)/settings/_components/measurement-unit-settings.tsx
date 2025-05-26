'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import React, { useActionState } from 'react';
import { saveMeasurementPreferences } from '@/app/(frontend)/settings/_actions/manage-measurements';
import { useEffect } from 'react';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { showErrorToast, showSuccessToast } from '@/app/(frontend)/utils/helpers';

export const initialState = {
  message: '',
  success: false,
};

// for now hardcoded values
// waiting for api
const heightUnit = 'metric';
const weightUnit = 'metric';

export function MeasurementUnitSettings() {
  const [state, formAction, isPending] = useActionState(saveMeasurementPreferences, initialState);

  useEffect(() => {
    const hasError = !state.success && state.message;
    if (state.success) {
      showSuccessToast({
        title: 'Success',
        description: state.message,
      });
    }
    if (hasError) {
      showErrorToast({
        title: 'Error',
        description: state.message,
      });
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Measurement Units</CardTitle>
        <CardDescription>Choose your preferred units of measurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Height</Label>
              <RadioGroup
                name="heightUnit"
                defaultValue={heightUnit}
                className="flex flex-col space-y-1 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="height-metric" />
                  <Label htmlFor="height-metric" className="font-normal">
                    Metric (cm)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="height-imperial" />
                  <Label htmlFor="height-imperial" className="font-normal">
                    Imperial (ft, in)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base">Weight</Label>
              <RadioGroup
                name="weightUnit"
                defaultValue={weightUnit}
                className="flex flex-col space-y-1 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="weight-metric" />
                  <Label htmlFor="weight-metric" className="font-normal">
                    Metric (kg)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="weight-imperial" />
                  <Label htmlFor="weight-imperial" className="font-normal">
                    Imperial (st, lb)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </CardContent>
    </Card>
  );
}
