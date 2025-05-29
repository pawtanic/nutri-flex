import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';

interface FormFieldProps extends React.PropsWithChildren {
  state: any;
  label: string;
  input: { id: string; type: string; placeholder: string; value?: number | undefined };
  errorMessageId: string;
  fieldId: string;
}
export function FormFieldWithCalculationModal({
  state,
  label,
  input,
  errorMessageId,
  fieldId,
  children,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="hydration">{label}</Label>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            id={input.id}
            name={input.id}
            type={input.type}
            placeholder={input.placeholder}
            defaultValue={input?.value || state.inputs?.[fieldId]}
            aria-invalid={!!state.errors?.[fieldId]}
            aria-describedby={state.errors?.[fieldId] ? errorMessageId : undefined}
          />
          {state.errors?.[fieldId] && (
            <FormErrorMessage id={errorMessageId} errorMessage={state.errors[fieldId]} />
          )}
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}
