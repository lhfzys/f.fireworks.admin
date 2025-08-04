'use client';

import type { PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { CreateEditTenantDialog } from '@/features/tenants/components/create-edit-tenant-dialog';
import { OnboardTenantDialog } from '@/features/tenants/components/onboard-tenant-dialog';
import { PurgeTenantConfirmDialog } from '@/features/tenants/components/purge-tenant-confirm-dialog';
import { columns } from '@/features/tenants/components/tenant-table-columns';
import { TenantTableToolbar } from '@/features/tenants/components/tenant-table-toolbar';
import { useTenantMutations } from '@/features/tenants/hooks/useTenantMutations';
import { useTenants } from '@/features/tenants/hooks/useTenants';
import { Tenant, TenantFilter } from '@/types/api-contract';

export default function TenantsPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<Partial<Omit<TenantFilter, 'pageNumber' | 'pageSize'>>>({});

  const queryFilter = useMemo(
    () => ({
      ...filters,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
    [filters, pagination],
  );

  const { data, isLoading } = useTenants(queryFilter);
  const { deleteTenantMutation, purgeTenantMutation } = useTenantMutations();

  // --- 弹窗状态管理 ---
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);

  // --- 事件处理器 ---
  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsCreateEditOpen(true);
  };

  const handleDelete = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedTenant) return;
    deleteTenantMutation.mutate(selectedTenant.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const confirmPurge = () => {
    if (!selectedTenant) return;
    purgeTenantMutation.mutate(selectedTenant.id, {
      onSuccess: () => {
        setIsPurgeOpen(false);
        setSelectedTenant(null);
      },
    });
  };

  const handlePurgeClick = () => {
    setIsCreateEditOpen(false);
    setTimeout(() => {
      setIsPurgeOpen(true);
    }, 150);
  };
  const pageCount = data ? Math.ceil(data.totalCount / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <TenantTableToolbar
        onFilterChange={useCallback((newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, [])}
        onCreateClick={() => setIsOnboardOpen(true)}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <CreateEditTenantDialog
        isOpen={isCreateEditOpen}
        setIsOpen={setIsCreateEditOpen}
        tenantId={selectedTenant?.id}
        onPurgeClick={handlePurgeClick}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        resourceName={selectedTenant?.name ?? ''}
        onConfirm={confirmDelete}
        isPending={deleteTenantMutation.isPending}
      />

      <OnboardTenantDialog isOpen={isOnboardOpen} setIsOpen={setIsOnboardOpen} />

      <PurgeTenantConfirmDialog
        key={`delete-${selectedTenant?.id}`}
        isOpen={isPurgeOpen}
        setIsOpen={setIsPurgeOpen}
        tenantName={selectedTenant?.name ?? ''}
        onConfirm={confirmPurge}
        isPending={purgeTenantMutation.isPending}
      />
    </div>
  );
}
