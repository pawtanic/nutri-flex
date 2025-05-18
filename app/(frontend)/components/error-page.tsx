'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Home, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  title?: string;
  message?: string;
  code?: string | number;
  backUrl?: string;
}

export function ErrorPage({
  title = 'Access Restricted',
  message = "You don't have permission to access this page or resource.",
  code = '403',
  backUrl = '/',
}: ErrorPageProps) {
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Lock
              key={i}
              className="absolute text-primary"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5,
                transform: `rotate(${Math.random() * 360}deg)`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className="mx-auto mb-6 relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-3 h-3 bg-primary rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
            </div>
          </div>

          <div>
            <div className="text-4xl font-bold mb-2">{code}</div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground mb-6">{message}</p>

            <div className="flex flex-col gap-3">
              <Link href={backUrl} className="w-full">
                <Button className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  <span>Return to Home</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>
            </div>

            {countdown > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Redirecting to home in{' '}
                <span className="font-medium text-primary">
                  {countdown} second{countdown !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>
          If you believe you should have access to this page, please contact support or try logging
          in with different credentials.
        </p>
      </div>
    </div>
  );
}
