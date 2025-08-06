import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/api-contract';

interface UserTableRowActionsProps<User> {
  row: Row<User>;
  onEdit?: (data: User) => void;
  onDelete?: (user: User) => void;
  onAssignRoles?: (user: User) => void;
}
export const UserTableRowActions = <TData extends User>({
  row,
  onEdit,
  onDelete,
  onAssignRoles,
}: UserTableRowActionsProps<User>) => {
  const user = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">操作菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAssignRoles?.(user)}>
          <Shield className="mr-2 h-4 w-4" />
          分配角色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(user)}>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete?.(user)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
