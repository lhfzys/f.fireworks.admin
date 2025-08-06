import { request } from '@/lib/request';
import { CreateUserRequest, PaginatedList, UpdateUserRequest, User, UserFilter } from '@/types/api-contract';

export const userService = {
  getPaginatedList: (params: UserFilter): Promise<PaginatedList<User>> => {
    return request({ url: '/api/users', method: 'GET', params: params });
  },
  create: (data: CreateUserRequest): Promise<string> => {
    return request({ url: '/api/users', method: 'POST', data });
  },
  update: (id: string, data: UpdateUserRequest): Promise<void> => {
    return request({ url: `/api/users/${id}`, method: 'PUT', data });
  },
  delete: (id: string): Promise<void> => {
    return request({ url: `/api/users/${id}`, method: 'DELETE' });
  },
  // getById: (id: string): Promise<RoleDetailsDto> => {
  //   return request({ url: `/api/users/${id}`, method: 'GET' });
  // },
  updateRoles: (params: { userId: string; roleIds: string[] }): Promise<void> => {
    return request({
      url: `/api/roles/${params.userId}/roles`,
      method: 'PUT',
      data: { roleIds: params.roleIds },
    });
  },
};
