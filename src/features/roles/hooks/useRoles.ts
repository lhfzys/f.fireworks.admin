'use client';

import { useQuery } from '@tanstack/react-query';
import { roleService } from '@/api/services/roleService';
import { RoleFilter } from '@/types/api-contract';

export const useRoles = (filter: RoleFilter) => {
  return useQuery({
    queryKey: ['roles', filter],
    queryFn: () => roleService.getPaginatedList(filter),
  });
};
export const useRoleById = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => (id ? roleService.getById(id) : Promise.reject(new Error('ID not provided'))),
    enabled: !!id,
  });
};
