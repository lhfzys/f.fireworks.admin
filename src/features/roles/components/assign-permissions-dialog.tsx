'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
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

  const handleSave = (selectedIds: string[]) => {
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
          <DialogContent>为角色 “{role?.name}” 分配权限</DialogContent>
        </DialogHeader>
        {isLoading && <Skeleton className="h-64 w-full" />}
        {roleDetails && (
          <PermissionPicker
            initialSelectedIds={roleDetails.permissionIds}
            onSave={handleSave}
            isSaving={updateRolePermissionsMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
