import React from 'react';

type WrapperProps = React.PropsWithChildren;

export function Wrapper({ children }: WrapperProps) {
  return <div className="container max-w-md mx-auto pb-20 pt-6 px-4">{children}</div>;
}
