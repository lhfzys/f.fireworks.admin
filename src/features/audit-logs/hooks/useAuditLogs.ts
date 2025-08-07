import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '@/api/services/auditLogService';
import { AuditLogFilter } from '@/types/api-contract';

export const useAuditLogs = (filter: AuditLogFilter) => {
  return useQuery({
    queryKey: ['auditLogs', filter],
    queryFn: () => auditLogService.getPaginatedList(filter),
  });
};
