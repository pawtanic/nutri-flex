import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type UrlParams = Record<string, string | number | boolean>;
type ReplaceOptions = { replace?: boolean };

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParams = () => {
    const params: UrlParams = {};

    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    return params;
  };

  const updateParams = (params: UrlParams, options: ReplaceOptions = {}) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '');

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, String(value));
    });

    const newUrl = `${pathname}?${newSearchParams.toString()}`;

    if (options.replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  const removeParams = (keys: string[], options: ReplaceOptions = {}) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '');

    keys.forEach(key => {
      newSearchParams.delete(key);
    });

    const newUrl = `${pathname}?${newSearchParams.toString()}`;

    if (options.replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  const resetParams = (options: ReplaceOptions = {}) => {
    const newUrl = pathname;

    if (options.replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  return { updateParams, removeParams, resetParams, getParams };
}
