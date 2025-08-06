'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/api/services/userService';
import { ApiError } from '@/lib/errors/ApiError';
import { CreateUserRequest, UpdateUserRequest } from '@/types/api-contract';

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const onMutationSuccess = (message: string) => {
    toast.success(message, { position: 'top-center', description: '' });
    queryClient.invalidateQueries({ queryKey: ['users'] }); // 关键：操作成功后，刷新用户列表
  };

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: () => onMutationSuccess('用户创建成功！'),
    onError: (error: ApiError) => toast.error('创建失败', { position: 'top-center', description: error.message }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => userService.update(id, data),
    onSuccess: () => onMutationSuccess('用户更新成功！'),
    onError: (error: ApiError) => toast.error('更新失败', { position: 'top-center', description: error.message }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => onMutationSuccess('用户删除成功！'),
    onError: (error: ApiError) => toast.error('删除失败', { position: 'top-center', description: error.message }),
  });
  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};
