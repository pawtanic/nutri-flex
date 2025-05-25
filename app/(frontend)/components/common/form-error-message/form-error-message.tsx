import React from 'react';

interface FormErrorMessageProps {
  id: string;
  errorMessage: string | string[];
  className?: string;
}

function FormErrorMessage({ id, errorMessage, className }: FormErrorMessageProps) {
  if (Array.isArray(errorMessage)) {
    return (
      <div className={`col-span-2 text-sm text-red-500 mt-2 ${className}`}>
        {errorMessage.map((error, index) => (
          <p id={id} key={index}>
            {error}
          </p>
        ))}
      </div>
    );
  }

  return (
    <p id={id} className={`col-span-2 text-sm text-red-500 mt-2 ${className}`}>
      {errorMessage}
    </p>
  );
}

export default FormErrorMessage;
