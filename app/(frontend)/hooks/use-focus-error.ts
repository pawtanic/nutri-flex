'use client';

import { useEffect, useRef } from 'react';

export function useFocusError(errors: Record<string, any> | null | undefined) {
  const previousErrorKeys = useRef<string[]>([]);
  const errorKeys = errors ? Object.keys(errors).filter(key => !!errors[key]) : [];

  useEffect(() => {
    // If no errors or empty errors object, nothing to focus
    if (errorKeys.length === 0) {
      previousErrorKeys.current = [];
      return;
    }

    const currentErrorKeys = errors ? Object.keys(errors) : [];

    // Check if the errors are the same as before
    const sameErrors =
      previousErrorKeys.current.length === currentErrorKeys.length &&
      previousErrorKeys.current.every(key => currentErrorKeys.includes(key));

    // Don't attempt to focus if we have the same errors as before
    if (sameErrors) return;

    // Save current errors for next comparison
    previousErrorKeys.current = currentErrorKeys;

    // Get the first error field
    const [firstErrorField] = currentErrorKeys;
    if (!firstErrorField) return;

    // Find and focus the input
    const firstInvalidInput = document.querySelector(
      `[name="${firstErrorField}"]`
    ) as HTMLInputElement;

    console.log(firstInvalidInput, 'firstInvalidInput');

    if (firstInvalidInput) {
      console.log('focusing on', firstErrorField);
      firstInvalidInput.focus();
    }
  }, [errors]);
}
