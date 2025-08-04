'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role } from '@/types/api-contract';

interface RoleTableRowActionsProps<Role> {
  row: Row<Role>;
  onEdit?: (data: Role) => void;
  onDelete?: (role: Role) => void;
  onAssignPermissions?: (role: Role) => void;
}
export const RoleTableRowActions = <TData extends Role>({
  row,
  onEdit,
  onDelete,
  onAssignPermissions,
}: RoleTableRowActionsProps<Role>) => {
  const role = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">操作菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAssignPermissions?.(role)}>
          <Shield className="mr-2 h-4 w-4" />
          分配角色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(role)}>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete?.(role)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
