'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/common/auth-modal/auth-modal';

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    } else if (status === 'unauthenticated') {
      setIsOpen(true);
    }
  }, [status, router]);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthModal isOpen={isOpen} onCloseAction={handleClose} />
    </div>
  );
}
