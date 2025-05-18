import { LoadingButton } from '@/components/common/loading-button/loading-button';
import React from 'react';
import { useAuth } from '@/app/(frontend)/context/auth';

interface AuthRequiredButtonProps extends React.PropsWithChildren {
  loadingText?: string;
  className?: string;
  isBusy: boolean;
}

export function AuthRequiredButton({
  loadingText,
  className,
  isBusy,
  children,
  ...props
}: AuthRequiredButtonProps) {
  const { isUserAuthenticated, showAuthModal } = useAuth();

  const handleClick = () => {
    if (!isUserAuthenticated) {
      showAuthModal();
      return;
    }
  };

  return (
    <LoadingButton
      type={isUserAuthenticated ? 'submit' : 'button'}
      onClick={handleClick}
      loadingText={loadingText}
      className={className}
      isBusy={isBusy}
      {...props}
    >
      {children}
    </LoadingButton>
  );
}
