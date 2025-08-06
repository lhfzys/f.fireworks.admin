'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types/api-contract';
import { UserForm } from './user-form';

interface CreateEditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user?: User | null;
  isSuperAdmin: boolean;
}

export const CreateEditUserDialog = ({ isOpen, setIsOpen, user, isSuperAdmin }: CreateEditUserDialogProps) => {
  const mode = user ? 'edit' : 'create';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑用户' : '新建用户'}</DialogTitle>
        </DialogHeader>
        <UserForm mode={mode} initialData={user} isSuperAdmin={isSuperAdmin} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
