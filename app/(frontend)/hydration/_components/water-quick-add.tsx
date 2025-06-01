'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, GlassWater, Coffee, Citrus, Wine, Milk } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { saveWaterIntakeAction } from '@/app/(frontend)/hydration/_actions/save-water-intake-action';
import { showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { useDate } from '@/app/(frontend)/context/date-context';

const waterButtonsConfig = [
  {
    id: 'glass',
    amount: 250,
    label: 'Glass',
    description: '250ml',
    icon: <GlassWater className="h-6 w-6 mb-2 text-blue-500" />,
    className: 'border-blue-200 hover:bg-blue-50 hover:text-blue-700',
  },
  {
    id: 'bottle',
    amount: 500,
    label: 'Bottle',
    description: '500ml',
    icon: <Milk className="h-6 w-6 mb-2 text-blue-500" />,
    className: 'border-blue-200 hover:bg-blue-50 hover:text-blue-700',
  },
  {
    id: 'large',
    amount: 1000,
    label: 'Large',
    description: '1L',
    icon: <Droplet className="h-6 w-6 mb-2 text-blue-500" />,
    className: 'border-blue-200 hover:bg-blue-50 hover:text-blue-700',
  },
  {
    id: 'coffee',
    amount: 125,
    label: 'Coffee',
    description: '125ml',
    icon: <Coffee className="h-6 w-6 mb-2 text-amber-700" />,
    className: 'border-amber-200 hover:bg-amber-50 hover:text-amber-700',
  },
  {
    id: 'juice',
    amount: 50,
    label: 'Juice',
    description: '50ml',
    icon: <Citrus className="h-6 w-6 mb-2 text-purple-500" />,
    className: 'border-purple-200 hover:bg-purple-50 hover:text-purple-700',
  },
  {
    id: 'tea',
    amount: 125,
    label: 'Tea',
    description: '125ml',
    icon: <Wine className="h-6 w-6 mb-2 text-green-600" />,
    className: 'border-green-200 hover:bg-green-50 hover:text-green-700',
  },
] as const;

interface WaterQuickAddProps {
  onAddWaterAction: (amount: number) => void;
  goalReached: boolean;
  waterIntake: number;
  onHandleManualInput: (amount: string) => void;
  onHandleReset: () => void;
}

const initialState = {
  errors: {},
  message: '',
  success: false,
  inputs: {},
};

export function WaterQuickAdd({
  onAddWaterAction,
  goalReached,
  waterIntake,
  onHandleReset,
  onHandleManualInput,
}: WaterQuickAddProps) {
  const { selectedDate } = useDate();
  const [state, action, isPending] = useActionState(saveWaterIntakeAction, initialState);
  const handleAction = async (formData: FormData): Promise<void> => {
    formData.set('waterIntake', waterIntake.toString());
    formData.set('date', selectedDate.toISOString());
    return action(formData);
  };

  useEffect(() => {
    if (state.success) {
      showSuccessToast({
        title: 'Success',
        description: state.message,
      });
    }
  }, [state]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Add</CardTitle>
        <p>How much water did you drink today?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {waterButtonsConfig.map(({ id, amount, label, description, icon, className }) => (
            <Button
              key={id}
              disabled={goalReached}
              variant="outline"
              className={`flex flex-col h-auto py-4 ${className}`}
              onClick={() => onAddWaterAction(amount)}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </Button>
          ))}
        </div>

        <form action={handleAction}>
          <Label className="mt-4 mb-1 block text-sm font-medium leading-6 text-gray-900">
            Custom amount (ml)
          </Label>
          <Input
            id="waterIntake"
            type="number"
            name="waterIntake"
            placeholder="Enter the amount of water you drank in ml"
            disabled={goalReached}
            defaultValue={state.inputs.waterIntake || waterIntake}
            onChange={e => onHandleManualInput(e.target.value)}
          />
          {state?.errors?.waterIntake && (
            <FormErrorMessage id="waterIntake" errorMessage={state.errors?.waterIntake} />
          )}
          <AuthRequiredButton
            loadingText="Saving water intake..."
            className="w-full mt-4"
            isBusy={isPending}
          >
            Save water intake
          </AuthRequiredButton>
          {goalReached && (
            <Button
              onClick={onHandleReset}
              type="reset"
              className="w-full mt-4 bg-transparent border border-black text-black hover:text-white"
            >
              Reset
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
