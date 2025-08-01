'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { OnboardTenantForm } from './onboard-tenant-form';

interface OnboardTenantDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const OnboardTenantDialog = ({ isOpen, setIsOpen }: OnboardTenantDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>引导新租户</DialogTitle>
          <DialogDescription>创建一个新租户，并为其设置第一个管理员账户。</DialogDescription>
        </DialogHeader>
        <OnboardTenantForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
