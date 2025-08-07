'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PermissionPicker } from '@/features/permissions/components/permission-picker';
import { usePlanMutations } from '@/features/plans/hooks/usePlanMutations';
import { useApiForm } from '@/hooks/useApiForm';

const formSchema = z.object({
  name: z.string().min(1, '请输入套餐名称'),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional().default([]),
});
type FormData = z.infer<typeof formSchema>;

interface PlanFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
}

export const PlanForm = ({ mode, initialData, onSuccess }: PlanFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', isActive: true, description: '', permissionIds: [] },
  });

  const { createPlanMutation, updatePlanMutation } = usePlanMutations();

  const { handleApiSubmit, isSubmitting } = useApiForm({ form, onSuccess });

  const onSubmit = (data: FormData) => {
    handleApiSubmit(async () => {
      if (mode === 'edit' && initialData) {
        await updatePlanMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createPlanMutation.mutateAsync(data);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>套餐名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissionIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>包含的权限</FormLabel>
              <FormControl>
                <PermissionPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === 'edit' && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>激活状态</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
