import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Check, Loader, X } from 'lucide-react';
import { toast } from 'sonner';

const useAuth = () => {
  // const { isUserAuthenticated, openLoginModal } = useContext(AuthContext);
  const isUserAuthenticated = false;
  const promptLogin = () => {
    // e.g., openLoginModal();
    alert('Please log in to perform this action.');
  };
  return { isUserAuthenticated, promptLogin };
};

interface AuthRequiredButtonProps extends Omit<ButtonProps, 'onClick'> {
  onAuthenticatedClick: () => Promise<unknown> | unknown;
  loadingContent?: React.ReactNode;
  onUnauthenticatedClick?: () => void;
  loadingText?: string;
  successMessageText: string;
  errorMessageText: string;
  successMessageDescription: string;
}

export function AuthRequiredButton({
  children,
  onAuthenticatedClick,
  loadingContent,
  disabled = false,
  className,
  loadingText,
  successMessageText,
  successMessageDescription,
  errorMessageText,
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
        toast(successMessageText, {
          // todo: create a success class and variable success clr
          className: 'bg-green-50 border-green-200 text-green-900',
          description: successMessageDescription,
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
          toast(errorMessageText, {
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
