import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/api/services/tenantService';
import type { TenantFilter } from '@/types/api-contract';

export const useTenants = (filter: TenantFilter) => {
  return useQuery({
    queryKey: ['tenants', filter],
    queryFn: () => tenantService.getPaginatedList(filter),
  });
};
export const useTenantById = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => (id ? tenantService.getById(id) : Promise.reject(new Error('ID not provided'))),
    enabled: !!id,
  });
};
export const useAllTenants = () => {
  return useQuery({
    queryKey: ['tenants', 'all'],
    queryFn: () => tenantService.getPaginatedList({ pageSize: 999 }),
    select: (data) => data.items,
    staleTime: 1000 * 60 * 5,
  });
};
