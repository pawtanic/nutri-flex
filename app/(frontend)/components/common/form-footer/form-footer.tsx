'use client';

import { Button } from '@/components/ui/button';

interface FormFooterProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

export function FormFooter({ text, linkText, onClick }: FormFooterProps) {
  return (
    <div className="text-center text-sm">
      <p className="text-muted-foreground">
        {text}{' '}
        <Button variant="link" className="p-0 h-auto font-normal" onClick={onClick}>
          {linkText}
        </Button>
      </p>
    </div>
  );
}
