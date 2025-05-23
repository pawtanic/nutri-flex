import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  type: 'submit' | 'button';
  onClick: () => Promise<unknown> | unknown;
  loadingContent?: React.ReactNode;
  loadingText?: string;
  isBusy?: boolean;
}

export function LoadingButton({
  type = 'button',
  children,
  onClick,
  loadingContent,
  loadingText = 'Loading...',
  isBusy,
  ...props
}: LoadingButtonProps) {
  const defaultLoadingContent = (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      {loadingText}
    </>
  );

  return (
    <Button type={type} onClick={onClick} disabled={isBusy} {...props}>
      {isBusy ? (loadingContent ?? defaultLoadingContent) : children}
    </Button>
  );
}
