import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useHasHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(useAuthStore.persist.hasHydrated());
  }, []);

  return isHydrated;
};
