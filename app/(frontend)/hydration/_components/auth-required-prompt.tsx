import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/app/(frontend)/context/auth';

export function AuthRequiredPrompt() {
  const { showAuthModal } = useAuth();

  return (
    <Card>
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto rounded-full bg-amber-50 p-3">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <CardTitle className="text-lg font-semibold">Sign In Required</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground px-6 pb-4">
        <p className="mb-4">
          To track your water intake and access all features, please sign in or create an account.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pb-6 px-6">
        <Button onClick={() => showAuthModal()} variant="default" className="w-full gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
