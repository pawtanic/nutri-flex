import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<unknown> | unknown;
  loadingContent?: React.ReactNode;
  loadingText?: string;
}

export function LoadingButton({
  children,
  onClick,
  loadingContent,
  loadingText = 'Loading...',
  disabled = false,
  ...props
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const defaultLoadingContent = (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      {loadingText}
    </>
  );

  return (
    <Button onClick={handleClick} disabled={disabled || isLoading} {...props}>
      {isLoading ? (loadingContent ?? defaultLoadingContent) : children}
    </Button>
  );
}
