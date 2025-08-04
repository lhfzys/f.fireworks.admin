'use client';

import { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/lib/errors/ApiError';

interface UseApiFormProps<TData extends FieldValues> {
  form: UseFormReturn<TData>;
  onSuccess?: (result: any) => void;
}

export const useApiForm = <TData extends FieldValues>({ form, onSuccess }: UseApiFormProps<TData>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApiSubmit = async (apiCall: () => Promise<any>) => {
    setIsSubmitting(true);
    try {
      const result = await apiCall();
      onSuccess?.(result);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          // --- 字段验证错误 ---
          error.errors.forEach((err) => {
            form.setError(err.field as any, {
              type: 'server',
              message: err.message,
            });
          });
          toast.error('输入有误', { position: 'top-center', description: '请检查表单中标记的错误信息。' });
        } else {
          // --- 通用业务错误 ---
          toast.error('操作失败', { position: 'top-center', description: error.message });
        }
      } else {
        // --- 未知/网络错误 ---
        toast.error('未知错误', { position: 'top-center', description: '网络或服务器错误，请稍后重试。' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    handleApiSubmit,
    isSubmitting,
  };
};
