'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/format-date';
import { AuditLog } from '@/types/api-contract';

export const getAuditLogColumns = (isSuperAdmin: boolean): ColumnDef<AuditLog>[] => {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'timestamp',
      header: '时间',
      cell: ({ row }) => <div className="min-w-[160px]">{formatDate(row.getValue('timestamp'))}</div>,
    },
    {
      accessorKey: 'userName',
      header: '用户',
    },
    {
      accessorKey: 'requestName',
      header: '操作名称',
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue('requestName')}</div>,
    },
    {
      accessorKey: 'httpMethod',
      header: '方法',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('httpMethod')}</Badge>,
    },
    {
      accessorKey: 'statusCode',
      header: '状态码',
      cell: ({ row }) => {
        const code = row.getValue('statusCode') as number;
        const variant = code >= 400 ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{code}</Badge>;
      },
    },
    {
      accessorKey: 'executionDurationMs',
      header: '耗时(ms)',
    },
  ];
  if (isSuperAdmin) {
    columns.splice(2, 0, {
      accessorKey: 'tenantName',
      header: '所属租户',
    });
  }
  return columns;
};
