'use client';

import React, { createContext, use, useState, ReactNode } from 'react';
import AuthModal from '@/components/common/auth-modal/auth-modal';
// TODO: use new hook USE for context consumption !! check docs

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
      {isModalOpen && (
        // <Modal isOpen={isModalOpen} onClose={hideAuthModal} title="Authentication Required">
        //   <div>
        //     <p>Please log in to continue with this action.</p>
        //     {/* Login form or buttons */}
        //     <button
        //       onClick={() => {
        //         /* login logic */
        //       }}
        //     >
        //       Log In
        //     </button>
        //     <button
        //       onClick={() => {
        //         /* signup logic */
        //       }}
        //     >
        //       Sign Up
        //     </button>
        //     <button onClick={hideAuthModal}>Cancel</button>
        //   </div>
        // </Modal>
        <AuthModal isOpen={isModalOpen} onCloseAction={hideAuthModal} />
      )}
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
