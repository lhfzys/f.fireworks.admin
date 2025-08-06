'use client';

import { PaginationState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { CreateEditUserDialog } from '@/features/users/components/create-edit-user-dialog';
import { getUserColumns } from '@/features/users/components/user-table-columns';
import { UserTableToolbar } from '@/features/users/components/user-table-toolbar';
import { useUserMutations } from '@/features/users/hooks/useUserMutations';
import { useUsers } from '@/features/users/hooks/useUsers';
import { usePermissions } from '@/hooks/usePermissions';
import { User, UserFilter } from '@/types/api-contract';

export default function UsersPage() {
  const { isSuperAdmin } = usePermissions();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<Partial<UserFilter>>({});

  const queryFilter = useMemo(
    () => ({
      ...filters,
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
    [filters, pagination],
  );

  const { data, isLoading } = useUsers(queryFilter);
  const { deleteUserMutation } = useUserMutations();
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleNew = () => {
    setSelectedUser(null);
    setIsCreateEditOpen(true);
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsCreateEditOpen(true);
  };
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const columns = useMemo(() => getUserColumns(isSuperAdmin), [isSuperAdmin]);
  const pageCount = data ? Math.ceil(data.totalCount / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <UserTableToolbar
        isSuperAdmin={isSuperAdmin}
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

      <CreateEditUserDialog
        isOpen={isCreateEditOpen}
        setIsOpen={setIsCreateEditOpen}
        user={selectedUser}
        isSuperAdmin={isSuperAdmin}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        resourceName={selectedUser?.userName ?? ''}
        onConfirm={confirmDelete}
        isPending={deleteUserMutation.isPending}
      />
    </div>
  );
}
