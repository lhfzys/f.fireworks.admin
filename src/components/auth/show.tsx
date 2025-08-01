import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface ShowProps {
  when: string;
  children: React.ReactNode;
}

export const Show = ({ when, children }: ShowProps) => {
  const { hasPermission } = usePermissions();
  return hasPermission(when) ? <>{children}</> : null;
};
