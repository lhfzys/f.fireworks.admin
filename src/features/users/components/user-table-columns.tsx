import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { UserStatus } from '@/enums/base-enum';
import { UserTableRowActions } from '@/features/users/components/user-table-row-actions';
import { formatDate } from '@/lib/utils/format-date';
import { User } from '@/types/api-contract';

export const getUserColumns = (isSuperAdmin: boolean): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'userName',
      header: '用户名',
    },
    {
      accessorKey: 'email',
      header: '邮箱',
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const status = row.getValue('status') as UserStatus;
        const statusConfig = {
          [UserStatus.Active]: { text: '激活', variant: 'success' as const },
          [UserStatus.Inactive]: { text: '离线', variant: 'warning' as const },
          [UserStatus.Disabled]: { text: '禁用', variant: 'destructive' as const },
          [UserStatus.Banned]: { text: '封禁', variant: 'destructive' as const },
        };
        const config = statusConfig[status] || { text: '未知', variant: 'default' as const };
        return <Badge variant={config.variant}>{config.text}</Badge>;
      },
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
        const { onEdit, onDelete, onAssignRoles } = table.options.meta as {
          onEdit: (user: User) => void;
          onDelete: (user: User) => void;
          onAssignRoles: (user: User) => void;
        };
        return <UserTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} onAssignRoles={onAssignRoles} />;
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
