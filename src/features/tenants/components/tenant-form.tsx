'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TenantType } from '@/enums/base-enum';
import { useAllPlans } from '@/features/plans/hooks/usePlans';
import { TenantDetails } from '@/types/api-contract';

// 使用Zod定义表单验证规则
const formSchema = z.object({
  name: z.string().min(1, { message: '租户名称不能为空。' }).max(100),
  type: z.enum(TenantType),
  isActive: z.boolean().default(true),
  planId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TenantFormProps {
  mode: 'create' | 'edit';
  initialData?: TenantDetails | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const TenantForm = ({ mode, initialData, onSubmit, isSubmitting }: TenantFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          isActive: initialData.isActive,
          planId: initialData.planId,
        }
      : { name: '', type: undefined, isActive: true },
  });

  const { data: plans, isLoading: isLoadingPlans } = useAllPlans();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>租户名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：阳光幼儿园" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>租户类型</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
                disabled={mode === 'edit'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择租户类型..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(TenantType)
                    .filter(([key]) => !isNaN(Number(key)))
                    .map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value as string}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>功能套餐</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value} // 使用 value
                disabled={isLoadingPlans}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="为租户选择一个套餐..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {plans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '确认保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
