'use client';

import { PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { AssignPermissionsDialog } from '@/features/roles/components/assign-permissions-dialog';
import { CreateEditRoleDialog } from '@/features/roles/components/create-edit-role-dialog';
import { getRoleColumns } from '@/features/roles/components/role-table-columns';
import { RoleTableToolbar } from '@/features/roles/components/role-table-toolbar';
import { useRoleMutations } from '@/features/roles/hooks/useRoleMutations';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { Role, RoleFilter } from '@/types/api-contract';

export default function RolesPage() {
  const { isSuperAdmin } = usePermissions();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<Partial<Omit<RoleFilter, 'pageNumber' | 'pageSize'>>>({});

  const queryFilter = useMemo(
    () => ({
      ...filters,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
    [filters, pagination],
  );

  const { data, isLoading } = useRoles(queryFilter);
  const { deleteRoleMutation } = useRoleMutations();

  // --- 弹窗状态管理 ---
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignPermissionsOpen, setIsAssignPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // --- 事件处理器 ---
  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsCreateEditOpen(true);
  };
  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };
  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsAssignPermissionsOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRole) return;
    deleteRoleMutation.mutate(selectedRole.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };
  const columns = useMemo(() => getRoleColumns(isSuperAdmin), [isSuperAdmin]);
  const pageCount = data ? Math.ceil(data.totalCount / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <RoleTableToolbar
        isSuperAdmin={isSuperAdmin}
        onFilterChange={useCallback((newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, [])}
        onCreateClick={() => {
          setSelectedRole(null);
          setIsCreateEditOpen(true);
        }}
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
          onAssignPermissions: handleAssignPermissions,
        }}
      />

      <CreateEditRoleDialog isOpen={isCreateEditOpen} setIsOpen={setIsCreateEditOpen} role={selectedRole} />
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={confirmDelete}
        resourceName={selectedRole?.name ?? ''}
        isPending={false}
      />
      <AssignPermissionsDialog
        isOpen={isAssignPermissionsOpen}
        setIsOpen={setIsAssignPermissionsOpen}
        role={selectedRole}
      />
    </div>
  );
}
