'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputWithSuffix } from '@/components/ui/input-with-suffix';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TenantType } from '@/enums/base-enum';
import { useAllPlans } from '@/features/plans/hooks/usePlans';
import { useApiForm } from '@/hooks/useApiForm';
import { useTenantMutations } from '../hooks/useTenantMutations';

const formSchema = z.object({
  tenantName: z.string().min(1, '租户名称不能为空'),
  planId: z.string().optional(),
  tenantType: z.enum(TenantType),
  adminUserName: z.string().min(1, '管理员用户名不能为空'),
  adminEmail: z.email().min(1, '邮箱不能为空'),
  adminPassword: z.string().min(6, '密码长度不能少于6位'),
  adminFirstName: z.string().optional(),
  adminLastName: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardTenantFormProps {
  initialData?: Partial<FormData> | null;
  onSuccess: () => void;
}

export const OnboardTenantForm = ({ initialData, onSuccess }: OnboardTenantFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: '',
      tenantType: TenantType.Kindergarten,
      adminUserName: '',
      planId: '',
      adminEmail: '',
      adminPassword: '',
    },
  });
  const { onboardTenantMutation } = useTenantMutations();
  const { data: plans, isLoading: isLoadingPlans } = useAllPlans();

  const { handleApiSubmit, isSubmitting } = useApiForm({
    form,
    onSuccess: onSuccess,
  });

  const onSubmit = (data: FormData) => {
    handleApiSubmit(async () => {
      await onboardTenantMutation.mutateAsync(data);
    });
  };

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h4 className="text-sm font-medium">租户信息</h4>
        <Separator />
        <FormField
          control={form.control}
          name="tenantName"
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
          name="planId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>功能套餐</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? ''}
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
        <FormField
          control={form.control}
          name="tenantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>租户类型</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
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

        <h4 className="pt-4 text-sm font-medium">初始管理员信息</h4>
        <Separator />
        <FormField
          name="adminUserName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>管理员名称</FormLabel>
              <FormControl>
                <Input placeholder="管理员" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="adminEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱地址</FormLabel>
              <FormControl>
                <InputWithSuffix placeholder="输入邮箱前缀" suffix="@fireworks.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="adminPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>管理员密码</FormLabel>
              <FormControl>
                <Input placeholder="密码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '正在开通...' : '确认开通'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
