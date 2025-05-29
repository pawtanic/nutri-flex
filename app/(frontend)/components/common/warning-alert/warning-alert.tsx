import React from 'react';

interface WarningAlertProps extends React.PropsWithChildren {
  description: string;
}

function WarningAlert({ children, description }: WarningAlertProps) {
  return (
    <div role="alert" className="tip bg-red-50 border border-red-400">
      <p className="text-md inline ">
        <strong className="text-red-600 font-bold">Warning</strong>: {description}
      </p>
      {children}
    </div>
  );
}

export default WarningAlert;
