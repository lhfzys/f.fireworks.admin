'use client';

import React from 'react';
import { AccessDenied } from '@/components/common/access-denied';
import { PageLoader } from '@/components/layout/page-loader';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  requiredPermission: string;
  children: React.ReactNode;
}

export const PermissionGuard = ({ requiredPermission, children }: PermissionGuardProps) => {
  const isHydrated = useHasHydrated();
  const { hasPermission } = usePermissions();

  if (!isHydrated) {
    return <PageLoader />;
  }

  if (!hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
