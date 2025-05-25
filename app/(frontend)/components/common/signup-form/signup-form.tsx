'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signupAction } from '@/app/(frontend)/auth/auth-actions';
import { FormFooter } from '@/components/common/form-footer/form-footer';
import { SocialLoginButtons } from '@/components/common/social-login-button/social-login-button';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import { useFocusError } from '@/hooks/use-focus-error';

const initialState = {
  errors: {},
  message: '',
  success: false,
};

export default function SignupForm({ onTabChangeAction }: { onTabChangeAction: () => void }) {
  const [state, action, isPending] = useActionState(signupAction, initialState);
  useFocusError(state.errors);
  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state?.inputs?.email}
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? 'signup-email-error' : undefined}
          />
          {state?.errors?.email && (
            <FormErrorMessage id="signup-email-error" errorMessage={state.errors?.email} />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            defaultValue={state?.inputs?.password}
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? 'signup-password-error' : undefined}
          />
          {state?.errors?.password && (
            <FormErrorMessage id="signup-password-error" errorMessage={state.errors?.password} />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            defaultValue={state?.inputs?.confirmPassword}
            aria-invalid={!!state?.errors?.confirmPassword}
            aria-describedby={
              state?.errors?.confirmPassword ? 'signup-confirm-password-error' : undefined
            }
          />
          {state?.errors?.confirmPassword && (
            <FormErrorMessage
              id="signup-confirm-password-error"
              errorMessage={state.errors?.confirmPassword}
            />
          )}
        </div>

        {state?.message && !state.success && <WarningAlert description={state.message} />}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      {/* Temporarily disable Social auth */}
      {/*<SocialLoginButtons />*/}
      <FormFooter
        text="Already have an account?"
        linkText="Log in here"
        onClick={onTabChangeAction}
      />
    </div>
  );
}
