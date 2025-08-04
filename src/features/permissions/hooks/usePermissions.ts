'use client';
import { useQuery } from '@tanstack/react-query';
import { permissionService } from '@/api/services/permissionService';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions-tree'],
    queryFn: () => permissionService.getTree(),
    staleTime: 1000 * 60 * 60,
  });
};
