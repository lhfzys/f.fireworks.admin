import { request } from '@/lib/request';
import {
  CreateRoleRequest,
  PaginatedList,
  Role,
  RoleDetailsDto,
  RoleFilter,
  UpdateRoleRequest,
} from '@/types/api-contract';

export const roleService = {
  getPaginatedList: (params: RoleFilter): Promise<PaginatedList<Role>> => {
    return request({ url: '/api/roles', method: 'GET', params: params });
  },
  create: (data: CreateRoleRequest): Promise<string> => {
    return request({ url: '/api/roles', method: 'POST', data });
  },
  update: (id: string, data: UpdateRoleRequest): Promise<void> => {
    return request({ url: `/api/roles/${id}`, method: 'PUT', data });
  },
  delete: (id: string): Promise<void> => {
    return request({ url: `/api/roles/${id}`, method: 'DELETE' });
  },
  getById: (id: string): Promise<RoleDetailsDto> => {
    return request({ url: `/api/roles/${id}`, method: 'GET' });
  },
  updatePermissions: (id: string, permissionIds: string[]): Promise<void> => {
    return request({ url: `/api/roles/${id}/permissions`, method: 'PUT', data: permissionIds });
  },
};
