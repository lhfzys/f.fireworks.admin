import { request } from '@/lib/request';
import { CreatePlanRequest, PaginatedList, Plan, PlanFilter, UpdatePlanRequest } from '@/types/api-contract';

export const planService = {
  getPaginatedList: (params: PlanFilter): Promise<PaginatedList<Plan>> => {
    return request({ url: '/api/admin/plans', method: 'GET', params });
  },
  getAll: async (): Promise<Plan[]> => {
    const res = await request({ url: '/api/admin/plans', method: 'GET', params: { pageSize: 999 } });
    return res.items;
  },
  create: (data: CreatePlanRequest): Promise<string> => {
    return request({ url: '/api/admin/plans', method: 'POST', data });
  },
  update: (id: string, data: UpdatePlanRequest): Promise<void> => {
    return request({ url: `/api/admin/plans/${id}`, method: 'PUT', data });
  },
  delete: (id: string): Promise<void> => {
    return request({ url: `/api/admin/plans/${id}`, method: 'DELETE' });
  },
  getById: (id: string): Promise<Plan> => {
    return request({ url: `/api/admin/plans/${id}`, method: 'GET' });
  },
};
