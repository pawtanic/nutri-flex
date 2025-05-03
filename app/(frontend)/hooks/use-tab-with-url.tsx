'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface UseTabWithUrlOptions {
  defaultTab?: string;
  paramName?: string;
}

// todo : may need to be changed for more generic

export function useTabWithUrl({
  defaultTab = 'default',
  paramName = 'tab',
}: UseTabWithUrlOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get(paramName) ?? defaultTab;

  const setTab = (value: string) => {
    router.push(`?${paramName}=${value}`);
  };

  return {
    tab,
    setTab,
  };
}
