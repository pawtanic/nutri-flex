import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Check, Loader, X } from 'lucide-react';
import { toast } from 'sonner';

const useAuth = () => {
  // const { isUserAuthenticated, openLoginModal } = useContext(AuthContext);
  const isUserAuthenticated = true;
  const promptLogin = () => {
    // e.g., openLoginModal();
    alert('Please log in to perform this action.');
  };
  return { isUserAuthenticated, promptLogin };
};

interface AuthRequiredButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * The action to perform when the button is clicked and the user IS authenticated.
   * Should return a Promise if it's an async operation to handle loading state automatically.
   */
  onAuthenticatedClick: () => Promise<unknown> | unknown;
  /**
   * Optional: Custom content to display while the authenticated action is loading.
   * Defaults to a spinner and "Loading...".
   */
  loadingContent?: React.ReactNode;
  /**
   * Optional: Action to perform if the user is NOT authenticated.
   * Defaults to calling `promptLogin` from the `useAuth` hook.
   */
  onUnauthenticatedClick?: () => void;
  loadingText?: string;
}

export function AuthRequiredButton({
  children,
  onAuthenticatedClick,
  loadingContent,
  disabled = false,
  className,
  loadingText,
  ...props
}: AuthRequiredButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isUserAuthenticated, promptLogin } = useAuth();

  const handleClick = async () => {
    if (isUserAuthenticated) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await onAuthenticatedClick();
        // create a success toast component/hook
        toast('Meal saved successfully!', {
          // todo: create a success class and variable success clr
          className: 'bg-green-50 border-green-200 text-green-900',
          description: 'You can now view your meal in nutrition page',
          position: 'top-center',
          icon: (
            <div className="rounded-full p-1 bg-green-700">
              <Check className="h-3 w-3 text-white" />
            </div>
          ),
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          // create a success toast component/hook
          toast('We could not save your meal.', {
            description: error.message || 'Unknown error occurred. Please try again later',
            position: 'top-center',
            className: 'bg-red-50 border-red-200',
            icon: (
              <div className="rounded-full p-1 bg-red-700">
                <X className="h-3 w-3 text-white" />
              </div>
            ),
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      promptLogin();
    }
  };

  const defaultLoadingContent = (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      {loadingText ?? 'Loading...'}
    </>
  );

  return (
    <Button onClick={handleClick} disabled={disabled || isLoading} className={className} {...props}>
      {isLoading ? (loadingContent ?? defaultLoadingContent) : children}
    </Button>
  );
}
