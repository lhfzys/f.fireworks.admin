'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { planService } from '@/api/services/planService';
import { ApiError } from '@/lib/errors/ApiError';

export const usePlanMutations = () => {
  const queryClient = useQueryClient();

  const onMutationSuccess = () => {
    toast.success('', {
      position: 'top-center',
      description: `操作成功`,
    });
    queryClient.invalidateQueries({ queryKey: ['plans'] });
  };

  const createPlanMutation = useMutation({
    mutationFn: planService.create,
    onSuccess: onMutationSuccess,
    onError: (error: ApiError) => toast.error('创建失败', { position: 'top-center', description: error.message }),
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: any) => planService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('', {
        position: 'top-center',
        description: `更新成功`,
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', variables.id] });
    },
    onError: (error: ApiError) => toast.error('更新失败', { position: 'top-center', description: error.message }),
  });

  const deletePlanMutation = useMutation({
    mutationFn: planService.delete,
    onSuccess: (_, id) => {
      toast.success('', {
        position: 'top-center',
        description: `删除成功`,
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', id] });
    },
    onError: (error: ApiError) => toast.error('删除失败', { position: 'top-center', description: error.message }),
  });

  return { createPlanMutation, updatePlanMutation, deletePlanMutation };
};
