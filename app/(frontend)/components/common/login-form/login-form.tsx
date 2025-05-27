'use client';

import { useActionState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/app/(frontend)/auth/auth-actions';
import { FormFooter } from '@/components/common/form-footer/form-footer';
import { SocialLoginButtons } from '@/components/common/social-login-button/social-login-button';
import { useFocusError } from '@/hooks/use-focus-error';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import AuthClientService from '@/lib/services/AuthClientService';

const initialState = {
  errors: {},
  success: false,
  message: '',
};

export default function LoginForm({ onTabChangeAction }: { onTabChangeAction: () => void }) {
  const [state, action, isPending] = useActionState(loginAction, initialState);
  useFocusError(state.errors);
  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={state?.inputs?.email}
            autoComplete="email"
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          />
          {state?.errors?.email && (
            <FormErrorMessage id="signup-email-error" errorMessage={state.errors?.email} />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue={state?.inputs?.password}
            autoComplete="current-password"
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? 'password-error' : undefined}
          />
          {state?.errors?.password && (
            <FormErrorMessage id="signup-password-error" errorMessage={state.errors?.password} />
          )}
        </div>

        {/*// add server response message here - check what state is once u have response !*/}
        {state?.message && !state.success && <WarningAlert description={state.message} />}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
      <SocialLoginButtons action={AuthClientService.login}/>
      <FormFooter
        text="Don't have an account?"
        linkText="Sign up here"
        onClick={onTabChangeAction}
      />
    </div>
  );
}
