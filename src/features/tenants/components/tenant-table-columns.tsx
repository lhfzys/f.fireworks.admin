'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { TenantType } from '@/enums/base-enum';
import { Tenant } from '@/types/api-contract';
import { TenantTableRowActions } from './tenant-table-row-actions';

export const columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: 'name',
    header: '租户名称',
  },
  {
    accessorKey: 'type',
    header: '类型',
    cell: ({ row }) => {
      const type = row.getValue('type') as TenantType;
      // 将枚举数字转换为可读文本
      return <span>{TenantType[type]}</span>;
    },
  },
  {
    accessorKey: 'isActive',
    header: '状态',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return <Badge variant={isActive ? 'secondary' : 'outline'}>{isActive ? '激活' : '禁用'}</Badge>;
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => {
      const { onEdit, onDelete } = table.options.meta as any;
      return <TenantTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />;
    },
  },
];
