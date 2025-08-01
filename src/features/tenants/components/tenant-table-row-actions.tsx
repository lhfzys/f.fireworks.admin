'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tenant } from '@/types/api-contract';

interface TenantTableRowActionsProps {
  row: Row<Tenant>;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export const TenantTableRowActions = ({ row, onEdit, onDelete }: TenantTableRowActionsProps) => {
  const tenant = row.original;
  const isSystemTenant = tenant.name === 'System';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>操作</DropdownMenuLabel>
        {!isSystemTenant ? (
          <>
            <DropdownMenuItem onClick={() => onEdit(tenant)}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(tenant)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              删除 (软删除)
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>系统租户受保护，不可操作</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
