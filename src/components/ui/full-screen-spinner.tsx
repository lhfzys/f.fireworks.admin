'use client';
import { Skeleton } from '@/components/ui/skeleton';

export const FullScreenSpinner = () => {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-12 w-12 animate-pulse rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};