import { request } from '@/lib/request';
import { AuditLog, AuditLogFilter, PaginatedList } from '@/types/api-contract';

export const auditLogService = {
  getPaginatedList: (params: AuditLogFilter): Promise<PaginatedList<AuditLog>> => {
    return request({ url: '/api/admin/audit-logs', method: 'GET', params: params });
  },
};
