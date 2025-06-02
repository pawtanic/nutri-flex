import { useAuthModal } from '@/app/(frontend)/context/auth-modal-context';
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session } = useSession();
  const isUserAuthenticated = true;
  // const isUserAuthenticated = !!session?.user;
  const { showAuthModal } = useAuthModal();

  return { isUserAuthenticated, showAuthModal };
}
