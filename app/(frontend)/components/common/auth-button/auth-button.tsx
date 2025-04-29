import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button'; // Assuming ButtonProps are exported
import { Loader } from 'lucide-react';

// --- Conceptual Authentication Hook ---
// Replace this with your actual authentication context/hook implementation
const useAuth = () => {
  // const { isUserAuthenticated, openLoginModal } = useContext(AuthContext);
  // Example implementation:
  const isUserAuthenticated = true; // <-- Replace with your actual auth state
  const promptLogin = () => {
    // <-- Replace with your login trigger logic
    console.log('User not authenticated, prompting login...');
    // e.g., openLoginModal();
    alert('Please log in to perform this action.');
  };
  return { isUserAuthenticated, promptLogin };
};
// --- End Conceptual Hook ---

// Define Props, extending ButtonProps but omitting 'onClick'
interface AuthRequiredButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * The action to perform when the button is clicked and the user IS authenticated.
   * Should return a Promise if it's an async operation to handle loading state automatically.
   */
  onAuthenticatedClick: () => Promise<unknown> | unknown;
  /**
   * Optional: Custom content to display while the authenticated action is loading.
   * Defaults to a spinner and "Loading...".
   */
  loadingContent?: React.ReactNode;
  /**
   * Optional: Action to perform if the user is NOT authenticated.
   * Defaults to calling `promptLogin` from the `useAuth` hook.
   */
  onUnauthenticatedClick?: () => void;
}

export function AuthRequiredButton({
  children,
  onAuthenticatedClick,
  onUnauthenticatedClick,
  loadingContent,
  disabled = false, // Default disabled state
  className,
  ...props // Pass remaining ButtonProps down
}: AuthRequiredButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isUserAuthenticated, promptLogin } = useAuth();

  const handleClick = async () => {
    if (isUserAuthenticated) {
      setIsLoading(true);
      try {
        await onAuthenticatedClick();
      } catch (error) {
        console.error('Error during authenticated action:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      promptLogin();
    }
  };

  const defaultLoadingContent = (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  );

  return (
    <Button
      onClick={handleClick}
      // Disable the button if explicitly passed `disabled={true}` OR if it's currently loading
      disabled={disabled || isLoading}
      className={className}
      {...props} // Spread the rest of the ButtonProps (variant, size, etc.)
    >
      {isLoading ? (loadingContent ?? defaultLoadingContent) : children}
    </Button>
  );
}
