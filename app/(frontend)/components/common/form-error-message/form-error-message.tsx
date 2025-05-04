import React from 'react';

interface FormErrorMessageProps {
  errorMessage: string;
  className?: string;
}

function FormErrorMessage({ errorMessage, className }: FormErrorMessageProps) {
  return <p className={`col-span-2 text-sm text-red-500 mt-2 ${className}`}>{errorMessage}</p>;
}

export default FormErrorMessage;
