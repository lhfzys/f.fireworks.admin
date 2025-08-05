'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Role } from '@/types/api-contract';
import { RoleForm } from './role-form';

interface CreateEditRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  role?: Role | null;
}

export const CreateEditRoleDialog = ({ isOpen, setIsOpen, role }: CreateEditRoleDialogProps) => {
  const mode = role ? 'edit' : 'create';
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑角色' : '新建角色'}</DialogTitle>
          <DialogDescription>{mode === 'edit' ? '修改角色的基本信息。' : '创建一个新的角色。'}</DialogDescription>
        </DialogHeader>
        <RoleForm mode={mode} initialData={role} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
