'use client';

import { useEffect, useRef } from 'react';

export function useFocusError(errors: Record<string, any> | null | undefined) {
  const hasAttemptedFocus = useRef(false);

  useEffect(() => {
    const shouldFocusFirstError =
      errors && Object.keys(errors).length > 0 && !hasAttemptedFocus.current;

    if (!shouldFocusFirstError) return;
    // TODO: do some check depends on the structure of the errors
    const [firstErrorField] = Object.keys(errors[0]);

    if (!firstErrorField) return;
    const firstInvalidInput = document.querySelector(
      `[name="${firstErrorField}"]`
    ) as HTMLInputElement;

    console.log(firstInvalidInput, 'firstInvalidInput');

    if (!firstInvalidInput) return;
    console.log('focus');
    firstInvalidInput.focus();
    hasAttemptedFocus.current = true;
  }, [errors]);
}
