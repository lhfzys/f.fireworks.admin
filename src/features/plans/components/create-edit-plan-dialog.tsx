'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanForm } from '@/features/plans/components/plan-form';
import { usePlanById } from '@/features/plans/hooks/usePlans';

const FormSkeleton = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
);

interface CreateEditPlanDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  planId?: string | null;
}

export const CreateEditPlanDialog = ({ isOpen, setIsOpen, planId }: CreateEditPlanDialogProps) => {
  const mode = planId ? 'edit' : 'create';

  const { data: planDetails, isLoading: isLoadingDetails } = usePlanById(planId);
  const canRenderForm = mode === 'create' || (mode === 'edit' && !isLoadingDetails && planDetails);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑计划' : '新建计划'}</DialogTitle>
          <DialogDescription>{mode === 'edit' ? '编辑计划' : '新建计划'}</DialogDescription>
        </DialogHeader>
        {canRenderForm ? (
          <PlanForm mode={mode} initialData={planDetails} onSuccess={() => setIsOpen(false)} />
        ) : (
          <FormSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
};
