import { useQuery } from '@tanstack/react-query';
import { planService } from '@/api/services/planService';
import type { PlanFilter } from '@/types/api-contract';

export const usePlans = (filter: PlanFilter) => {
  return useQuery({
    queryKey: ['plans', filter],
    queryFn: () => planService.getPaginatedList(filter),
  });
};
export const usePlanById = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => (id ? planService.getById(id) : Promise.reject(new Error('ID not provided'))),
    enabled: !!id,
  });
};
export const useAllPlans = () => {
  return useQuery({
    queryKey: ['plans', 'all'],
    queryFn: () => planService.getAll(),
    staleTime: 1000 * 60 * 10,
  });
};
