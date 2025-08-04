'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RoleTableRowActions } from '@/features/roles/components/role-table-row-actions';
import { formatDate } from '@/lib/utils/format-date';
import { Role } from '@/types/api-contract';

export const getRoleColumns = (isSuperAdmin: boolean): ColumnDef<Role>[] => {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: '角色名称',
    },
    {
      accessorKey: 'description',
      header: '描述',
    },
    {
      accessorKey: 'createdOn',
      header: '创建时间',
      cell: ({ row }) => formatDate(row.getValue('createdOn')),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row, table }) => {
        const { onEdit, onDelete, onAssignPermissions } = table.options.meta as {
          onEdit: (role: Role) => void;
          onDelete: (role: Role) => void;
          onAssignPermissions: (role: Role) => void;
        };
        return (
          <RoleTableRowActions
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssignPermissions={onAssignPermissions}
          />
        );
      },
    },
  ];
  if (isSuperAdmin) {
    columns.unshift({
      accessorKey: 'tenantName',
      header: '所属租户',
    });
  }
  return columns;
};
