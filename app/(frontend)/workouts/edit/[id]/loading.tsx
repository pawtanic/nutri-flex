import React from 'react';
import { Loader2 } from 'lucide-react';
import { Wrapper } from '@/components/layout/Wrapper';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <Wrapper>
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Tab navigation */}
      <div className="pb-2 border-primary mb-2">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description text */}
      <div className="mb-4">
        <Skeleton className="h-4 w-full" />
      </div>

      {/* New Workout button placeholder */}
      <div className="flex justify-end mb-6">
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Workout card */}
      <div className="border rounded-lg p-4 mb-4">
        {/* Workout title */}
        <Skeleton className="h-6 w-32 mb-4" />

        {/* Exercise list */}
        <div className="space-y-3 mb-4">
          {/* Exercise 1 */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Exercise 2 */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Exercise 3 */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>

        {/* View Details button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </Wrapper>
  );
}

export default Loading;
