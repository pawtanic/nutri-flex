import { LoadingButton } from '@/components/common/loading-button/loading-button';
import { showErrorToast, showSuccessToast } from '@/app/(frontend)/utils/helpers';
import React from 'react';
import { useAuthModal } from '@/app/(frontend)/context/auth-modal-context';

const useAuthModalState = () => {
  // const { isUserAuthenticated } = use(AuthContext);
  const { showAuthModal } = useAuthModal();
  const isUserAuthenticated = true;

  return { isUserAuthenticated, showAuthModal };
};

interface AuthRequiredButtonProps
  extends Omit<React.ComponentProps<typeof LoadingButton>, 'onClick'> {
  onAuthenticatedClick?: any;
  // onAuthenticatedClick: () => Promise<unknown> | unknown;
  successMessageText: string;
  successMessageDescription: string;
  errorMessageText: string;
}

export function AuthRequiredButton({
  onAuthenticatedClick,
  successMessageText,
  successMessageDescription,
  errorMessageText,
  ...props
}: AuthRequiredButtonProps) {
  const { isUserAuthenticated, showAuthModal } = useAuthModalState();

  const handleClick = async () => {
    if (!isUserAuthenticated) {
      showAuthModal();
      return;
    }

    try {
      await onAuthenticatedClick();
      showSuccessToast({ title: successMessageText, description: successMessageDescription });
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast({
          title: errorMessageText,
          description: error.message || 'Unknown error occurred',
        });
      }
    }
  };

  return <LoadingButton onClick={handleClick} {...props} />;
}
