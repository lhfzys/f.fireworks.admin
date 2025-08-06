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
import { UserStatus } from '@/enums/base-enum';
import { useAllTenants } from '@/features/tenants/hooks/useTenants';
import { useUserMutations } from '@/features/users/hooks/useUserMutations';
import { useApiForm } from '@/hooks/useApiForm';

const formSchema = z.object({
  userName: z.string().min(1, '用户名不能为空'),
  email: z.email(),
  password: z.string().optional(), // 密码只在创建时需要
  status: z.enum(UserStatus),
  tenantId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  isSuperAdmin: boolean;
  onSuccess: () => void;
}

export const UserForm = ({ mode, initialData, isSuperAdmin, onSuccess }: UserFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { userName: '', email: '', status: UserStatus.Active },
  });

  const { createUserMutation, updateUserMutation } = useUserMutations();

  const { handleApiSubmit, isSubmitting } = useApiForm({
    form,
    onSuccess,
  });
  const { data: tenants, isLoading: isLoadingTenants } = useAllTenants();
  const onSubmit = (data: FormData) => {
    // 调用 handleApiSubmit，并将【真正要执行的异步逻辑】作为参数传进去
    handleApiSubmit(async () => {
      if (mode === 'edit' && initialData) {
        // 更新操作需要 id 和 data
        await updateUserMutation.mutateAsync({ id: initialData.id, data });
      } else {
        // 创建操作只需要 data
        await createUserMutation.mutateAsync(data);
      }
    });
  };

  useEffect(() => {
    if (initialData) form.reset({ mode, ...initialData });
  }, [initialData, form, mode]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSuperAdmin && mode === 'create' && (
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>所属租户</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''} disabled={isLoadingTenants}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="为新用户选择一个所属租户..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants?.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          name="userName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名称</FormLabel>
              <FormControl>
                <Input placeholder="用户名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
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
        {mode === 'create' && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input placeholder="用户密码" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户状态</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择用户状态..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(UserStatus)
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
