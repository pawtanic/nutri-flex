'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signupAction } from '@/app/(frontend)/auth/auth-actions';
// import { SocialLoginButtons } from '@/components/common/social-login-button/social-login-button';
import { FormFooter } from '@/components/common/form-footer/form-footer';

const initialState = {
  errors: {},
  message: '',
  success: false,
};

export default function SignupForm({ onTabChangeAction }: { onTabChangeAction: () => void }) {
  const [state, action, isPending] = useActionState(signupAction, initialState);

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
            required
            aria-invalid={!!state?.errors?.email}
            aria-describedby={state?.errors?.email ? 'signup-email-error' : undefined}
          />
          {state?.errors?.email && (
            <p id="signup-email-error" className="text-sm text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={!!state?.errors?.password}
            aria-describedby={state?.errors?.password ? 'signup-password-error' : undefined}
          />
          {state?.errors?.password && (
            <p id="signup-password-error" className="text-sm text-destructive">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={!!state?.errors?.confirmPassword}
            aria-describedby={
              state?.errors?.confirmPassword ? 'signup-confirm-password-error' : undefined
            }
          />
          {state?.errors?.confirmPassword && (
            <p id="signup-confirm-password-error" className="text-sm text-destructive">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {state?.message && !state.success && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/*<SocialLoginButtons />*/}

      <FormFooter
        text="Already have an account?"
        linkText="Log in here"
        onClick={onTabChangeAction}
      />
    </div>
  );
}
