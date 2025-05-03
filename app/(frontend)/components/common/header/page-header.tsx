'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  backHref: string;
  backAriaLabel?: string;
}

export function PageHeader({ title, backHref, backAriaLabel = 'go back' }: PageHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      <Link aria-label={backAriaLabel} className="mr-2" href={backHref}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}