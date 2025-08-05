'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleService } from '@/api/services/roleService';

export const useRoleMutations = () => {
  const queryClient = useQueryClient();

  const onMutationSuccess = (message: string) => {
    toast.success('', {
      position: 'top-center',
      description: message,
    });
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  };

  const createRoleMutation = useMutation({
    mutationFn: roleService.create,
    onSuccess: () => onMutationSuccess('角色创建成功！'),
    onError: (error) => toast.error('角色创建失败！', { position: 'top-center', description: error.message }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: any) => roleService.update(id, data),
    onSuccess: () => onMutationSuccess('角色更新成功！'),
    onError: (error) => toast.error('角色更新失败！', { position: 'top-center', description: error.message }),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => onMutationSuccess('角色删除成功！'),
    onError: (error) => toast.error('角色删除失败！', { position: 'top-center', description: error.message }),
  });

  const updateRolePermissionsMutation = useMutation({
    mutationFn: (variables: { roleId: string; permissionIds: string[] }) => roleService.updatePermissions(variables),
    onSuccess: (_, variables) => {
      onMutationSuccess('角色权限更新成功！');
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
    },
    onError: (error) => toast.error('角色权限更新失败！', { position: 'top-center', description: error.message }),
  });
  return { createRoleMutation, updateRoleMutation, deleteRoleMutation, updateRolePermissionsMutation };
};
