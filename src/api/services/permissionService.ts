import { request } from '@/lib/request';
import { MenuNode } from '@/types/api-contract';

export const permissionService = {
  getTree: (): Promise<MenuNode[]> => {
    return request({
      url: '/api/permissions',
      method: 'GET',
    });
  },
};
