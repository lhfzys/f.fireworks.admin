import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { PlanTableRowActions } from '@/features/plans/components/plan-table-row-actions';
import { formatDate } from '@/lib/utils/format-date';
import { Plan } from '@/types/api-contract';

export const getPlanColumns = () => {
  const columns: ColumnDef<Plan>[] = [
    {
      accessorKey: 'name',
      header: '套餐名称',
    },
    {
      accessorKey: 'description',
      header: '描述',
    },
    {
      accessorKey: 'isActive',
      header: '状态',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return isActive ? <Badge variant="default">激活</Badge> : <Badge variant="destructive">禁用</Badge>;
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
        const { onEdit, onDelete } = table.options.meta as {
          onEdit: (plan: Plan) => void;
          onDelete: (plan: Plan) => void;
        };
        return <PlanTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />;
      },
    },
  ];
  return columns;
};
