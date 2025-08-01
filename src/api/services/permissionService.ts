import { request } from '@/lib/request';
import { Permissions } from '@/types/api-contract';

export const permissionService = {
  getTree: (): Promise<Permissions[]> => {
    return request({
      url: '/api/permissions',
      method: 'GET',
    });
  },
};
