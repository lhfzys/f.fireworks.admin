import { request } from '@/lib/request';
import {
  CreateRoleRequest,
  PaginatedList,
  RoleDetailsDto,
  UpdateRoleRequest,
  User,
  UserFilter,
} from '@/types/api-contract';

export const userService = {
  getPaginatedList: (params: UserFilter): Promise<PaginatedList<User>> => {
    return request({ url: '/api/users', method: 'GET', params: params });
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
  updatePermissions: (params: { roleId: string; permissionIds: string[] }): Promise<void> => {
    return request({
      url: `/api/roles/${params.roleId}/permissions`,
      method: 'PUT',
      data: { permissionIds: params.permissionIds },
    });
  },
};
