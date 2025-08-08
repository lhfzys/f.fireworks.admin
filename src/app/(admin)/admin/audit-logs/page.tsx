'use client';

import { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import { getAuditLogColumns } from '@/features/audit-logs/components/audit-log-table-columns';
import { AuditLogToolbar } from '@/features/audit-logs/components/audit-log-toolbar';
import { useAuditLogs } from '@/features/audit-logs/hooks/useAuditLogs';
import { usePermissions } from '@/hooks/usePermissions';
import { AuditLogFilter } from '@/types/api-contract';

export default function AuditLogs() {
  const { isSuperAdmin } = usePermissions();
  const [filter, setFilter] = useState<Partial<AuditLogFilter>>({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useAuditLogs(filter);

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: (filter.pageNumber ?? 1) - 1,
      pageSize: filter.pageSize ?? 10,
    }),
    [filter.pageNumber, filter.pageSize],
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    if (typeof updater === 'function') {
      const newPagination = updater(pagination);
      setFilter((prev) => ({
        ...prev,
        pageNumber: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        pageNumber: updater.pageIndex + 1,
        pageSize: updater.pageSize,
      }));
    }
  };

  const handleFilterSubmit = useCallback((formValues: Omit<AuditLogFilter, 'pageNumber' | 'pageSize'>) => {
    setFilter((prev) => ({
      ...prev,
      ...formValues,
      pageNumber: 1,
    }));
  }, []);

  const columns = useMemo(() => getAuditLogColumns(isSuperAdmin), [isSuperAdmin]);
  const pageCount = data ? Math.ceil(data.totalCount / (filter.pageSize ?? 10)) : 0;
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">审计日志</h1>
      </header>
      <AuditLogToolbar initialFilters={filter} onFilterSubmit={handleFilterSubmit} />
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
