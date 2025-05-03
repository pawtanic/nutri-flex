import React from 'react';

interface FormErrorMessageProps {
  errorMessage: string;
}

function FormErrorMessage({ errorMessage }: FormErrorMessageProps) {
  return <p className="col-span-2 text-sm text-red-500 mt-2">{errorMessage}</p>;
}

export default FormErrorMessage;
