'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenantMutations } from '../hooks/useTenantMutations';
import { useTenantById } from '../hooks/useTenants';
import { TenantForm } from './tenant-form';

interface CreateEditTenantDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tenantId?: string | null;
  onPurgeClick: () => void;
}
const FormSkeleton = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);
export const CreateEditTenantDialog = ({ isOpen, setIsOpen, tenantId, onPurgeClick }: CreateEditTenantDialogProps) => {
  const mode = tenantId ? 'edit' : 'create';
  const { data: tenantDetails, isLoading: isLoadingDetails } = useTenantById(tenantId);
  const { createTenantMutation, updateTenantMutation } = useTenantMutations();

  const handleSubmit = async (data: any) => {
    try {
      if (mode === 'edit' && tenantId) {
        await updateTenantMutation.mutateAsync({ id: tenantId, data });
      } else {
        await createTenantMutation.mutateAsync(data);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const isSubmitting = createTenantMutation.isPending || updateTenantMutation.isPending;
  const canRenderForm = mode === 'create' || (mode === 'edit' && !isLoadingDetails && tenantDetails);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑租户' : '新建租户'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? '修改租户的基本信息。' : '创建一个新的租户，为其开通服务。'}
          </DialogDescription>
        </DialogHeader>
        {canRenderForm ? (
          <TenantForm mode={mode} initialData={tenantDetails} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        ) : (
          <FormSkeleton />
        )}

        {mode === 'edit' && (
          <div className="mt-8">
            <Separator />
            <div className="border-destructive mt-6 rounded-lg border p-4">
              <h4 className="text-destructive text-lg font-semibold">危险操作</h4>
              <p className="text-muted-foreground mt-2 text-sm">以下操作不可逆，请谨慎处理。</p>
              <div className="mt-4 flex justify-end">
                <Button variant="destructive" onClick={onPurgeClick}>
                  彻底清除此租户
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
