'use client';

import React, { createContext, use, useState, ReactNode } from 'react';
import AuthModal from '@/components/common/auth-modal/auth-modal';

interface AuthModalContextType {
  showAuthModal: () => void;
  hideAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showAuthModal = () => setIsModalOpen(true);
  const hideAuthModal = () => setIsModalOpen(false);

  return (
    <AuthModalContext.Provider
      value={{
        showAuthModal,
        hideAuthModal,
        isAuthModalOpen: isModalOpen,
      }}
    >
      {children}
      {isModalOpen && <AuthModal isOpen={isModalOpen} onCloseAction={hideAuthModal} />}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = use(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
