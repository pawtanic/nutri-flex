'use client';

import Link from 'next/link';
import WarningAlert from '@/components/common/warning-alert/warning-alert';

export function DataSourceAttribution() {
  return (
    <WarningAlert description="The results rely on free data from Ninja API">
      <Link href="https://api-ninjas.com/api/exercises" className="ml-2 underline">
        Learn more
      </Link>
    </WarningAlert>
  );
}
