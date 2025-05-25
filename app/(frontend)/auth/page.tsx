'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/common/auth-modal/auth-modal';
import { useAuth } from '@/app/(frontend)/context/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {isUserAuthenticated, loading} = useAuth();

  useEffect(() => {
    if (isUserAuthenticated) {
      router.replace('/');
    } else {
      setIsOpen(true);
    }
  }, [router]);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthModal isOpen={isOpen} onCloseAction={handleClose} />
    </div>
  );
}
