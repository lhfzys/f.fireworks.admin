'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tenantService } from '@/api/services/tenantService';
import { ApiError } from '@/lib/errors/ApiError';

export const useTenantMutations = () => {
  const queryClient = useQueryClient();

  const onMutationSuccess = (message: string) => {
    toast.success(message, {
      position: 'top-center',
      description: ``,
    });
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
  };

  const createTenantMutation = useMutation({
    mutationFn: tenantService.create,
    onSuccess: onMutationSuccess,
    // onError: (error: ApiError) => toast.error('创建失败', { position: 'top-center', description: error.message }),
  });

  const updateTenantMutation = useMutation({
    mutationFn: ({ id, data }: any) => tenantService.update(id, data),
    onSuccess: () => onMutationSuccess('租户更新成功'),
    //onError: (error: ApiError) => toast.error('更新失败', { position: 'top-center', description: error.message }),
  });

  const deleteTenantMutation = useMutation({
    mutationFn: tenantService.delete,
    onSuccess: () => onMutationSuccess('租户删除成功'),
    onError: (error: ApiError) => toast.error('删除失败', { position: 'top-center', description: error.message }),
  });

  const onboardTenantMutation = useMutation({
    mutationFn: tenantService.onboard,
    onSuccess: () => onMutationSuccess('新租户引导成功'),
    // onError: (error: ApiError) => toast.error('引导失败', { position: 'top-center', description: error.message }),
  });

  const purgeTenantMutation = useMutation({
    mutationFn: tenantService.purge,
    onSuccess: () => onMutationSuccess('租户数据清理成功'),
    onError: (error: ApiError) => toast.error('清理失败', { position: 'top-center', description: error.message }),
  });
  return {
    createTenantMutation,
    updateTenantMutation,
    deleteTenantMutation,
    onboardTenantMutation,
    purgeTenantMutation,
  };
};
