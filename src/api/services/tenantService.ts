import { request } from '@/lib/request';
import {
  CreateTenantRequest,
  OnboardTenantRequest,
  PaginatedList,
  Tenant,
  TenantDetails,
  TenantFilter,
  UpdateTenantRequest,
} from '@/types/api-contract';

export const tenantService = {
  getPaginatedList: (params: TenantFilter): Promise<PaginatedList<Tenant>> => {
    return request({ url: '/api/tenants', method: 'GET', params });
  },
  create: (data: CreateTenantRequest): Promise<string> => {
    return request({ url: '/api/tenants', method: 'POST', data });
  },
  update: (id: string, data: UpdateTenantRequest): Promise<void> => {
    return request({ url: `/api/tenants/${id}`, method: 'PUT', data });
  },
  delete: (id: string): Promise<void> => {
    return request({ url: `/api/tenants/${id}`, method: 'DELETE' });
  },
  getById: (id: string): Promise<TenantDetails> => {
    return request({ url: `/api/tenants/${id}`, method: 'GET' });
  },
  onboard: (data: OnboardTenantRequest): Promise<void> => {
    return request({
      url: '/api/admin/onboard-tenant',
      method: 'POST',
      data,
    });
  },
  purge: (tenantId: string): Promise<void> => {
    return request({ url: `/api/admin/tenants/${tenantId}/purge`, method: 'DELETE' });
  },
};
