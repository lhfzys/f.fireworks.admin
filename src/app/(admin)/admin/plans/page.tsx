'use client';

import { PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { CreateEditPlanDialog } from '@/features/plans/components/create-edit-plan-dialog';
import { getPlanColumns } from '@/features/plans/components/plan-table-columns';
import { PlanTableToolbar } from '@/features/plans/components/plan-table-toolbar';
import { usePlanMutations } from '@/features/plans/hooks/usePlanMutations';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { Plan, PlanFilter } from '@/types/api-contract';

export default function PlansPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<Partial<PlanFilter>>({});

  const queryFilter = useMemo(
    () => ({
      ...filters,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
    [filters, pagination],
  );

  const { data, isLoading } = usePlans(queryFilter);
  const { deletePlanMutation } = usePlanMutations();
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleNew = () => {
    setSelectedPlanId(null);
    setIsCreateEditOpen(true);
  };
  const handleEdit = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setIsCreateEditOpen(true);
  };
  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPlan) return;
    deletePlanMutation.mutate(selectedPlan.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const columns = useMemo(() => getPlanColumns(), []);
  const pageCount = data ? Math.ceil(data.totalCount / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <PlanTableToolbar
        onFilterChange={useCallback((newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, [])}
        onCreateClick={handleNew}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        meta={{ onEdit: handleEdit, onDelete: handleDelete }}
      />

      <CreateEditPlanDialog isOpen={isCreateEditOpen} setIsOpen={setIsCreateEditOpen} planId={selectedPlanId} />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        resourceName={selectedPlan?.name ?? ''}
        onConfirm={confirmDelete}
        isPending={deletePlanMutation.isPending}
      />
    </div>
  );
}
