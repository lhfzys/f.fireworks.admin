'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionPicker } from '@/features/permissions/components/permission-picker';
import { useRoleMutations } from '@/features/roles/hooks/useRoleMutations';
import { useRoleById } from '@/features/roles/hooks/useRoles';
import { Role } from '@/types/api-contract';

interface AssignPermissionsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  role: Role | null;
}

export const AssignPermissionsDialog = ({ isOpen, setIsOpen, role }: AssignPermissionsDialogProps) => {
  const { data: roleDetails, isLoading } = useRoleById(role?.id);
  const { updateRolePermissionsMutation } = useRoleMutations();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (roleDetails) {
      setSelectedIds(roleDetails.permissionIds);
    }
  }, [roleDetails]);

  const handleSave = () => {
    if (!role) return;
    updateRolePermissionsMutation.mutate(
      { roleId: role.id, permissionIds: selectedIds },
      { onSuccess: () => setIsOpen(false) },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>为角色 “{role?.name}” 分配权限</DialogTitle>
          <DialogDescription>勾选此角色应拥有的所有权限。</DialogDescription>
        </DialogHeader>
        {isLoading && <Skeleton className="h-64 w-full" />}
        {roleDetails && <PermissionPicker value={roleDetails.permissionIds} onChange={setSelectedIds} />}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={updateRolePermissionsMutation.isPending}>
            {updateRolePermissionsMutation.isPending ? '保存中...' : '确认保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
