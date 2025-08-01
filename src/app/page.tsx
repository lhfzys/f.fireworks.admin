'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenSpinner } from '@/components/ui/full-screen-spinner';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useHasHydrated();

  useEffect(() => {
    if (isHydrated) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  return <FullScreenSpinner />;
}
