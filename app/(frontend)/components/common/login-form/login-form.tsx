'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginAction } from '@/app/(frontend)/auth/auth-actions';
import { FormFooter } from '@/components/common/form-footer/form-footer';
import { SocialLoginButtons } from '@/components/common/social-login-button/social-login-button';

const initialState = {
  errors: {},
  success: false,
  message: '',
};

export default function LoginForm({ onTabChangeAction }: { onTabChangeAction: () => void }) {
  const [state, action, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          />
          {state?.errors?.email && (
            <p id="email-error" className="text-sm text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? 'password-error' : undefined}
          />
          {state?.errors?.password && (
            <p id="password-error" className="text-sm text-destructive">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {state?.message && !state.success && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
      <SocialLoginButtons />
      <FormFooter
        text="Don't have an account?"
        linkText="Sign up here"
        onClick={onTabChangeAction}
      />
    </div>
  );
}
