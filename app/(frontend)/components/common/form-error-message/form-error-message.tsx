import React from 'react';

interface FormErrorMessageProps {
  errorMessages: string;
}

function FormErrorMessage({ errorMessages }: FormErrorMessageProps) {
  return <p className="col-span-2 text-sm text-red-500 mt-2">{errorMessages}</p>;
}

export default FormErrorMessage;
