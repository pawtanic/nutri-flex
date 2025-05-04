'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/common/login-form/login-form';
import SignupForm from '@/components/common/signup-form/signup-form';

interface AuthModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function AuthModal({ isOpen, onCloseAction }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm onTabChangeAction={() => setActiveTab('signup')} />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignupForm onTabChangeAction={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
