'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllTenants } from '@/features/tenants/hooks/useTenants';
import { usePermissions } from '@/hooks/usePermissions';
import { AuditLogFilter } from '@/types/api-contract';

const filterSchema = z.object({
  userName: z.string().optional(),
  requestName: z.string().optional(),
  tenantId: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});
export type FilterFormData = z.infer<typeof filterSchema>;
interface AuditLogToolbarProps {
  initialFilters: Partial<AuditLogFilter>;
  onFilterSubmit: (filters: Partial<AuditLogFilter>) => void;
}
export const AuditLogToolbar = ({ initialFilters, onFilterSubmit }: AuditLogToolbarProps) => {
  const { isSuperAdmin } = usePermissions();
  const { data: tenants, isLoading: isLoadingTenants } = useAllTenants();

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters,
  });

  const handleReset = () => {
    form.reset({ userName: '', requestName: '', tenantId: '' });
    onFilterSubmit({});
  };
  const renderFilters = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormField
        control={form.control}
        name="userName"
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
        control={form.control}
        name="requestName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>请求名称</FormLabel>
            <FormControl>
              <Input placeholder="请求名称" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isSuperAdmin && (
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属租户</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''} disabled={isLoadingTenants}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="筛选租户..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">所有租户</SelectItem>
                  {tenants?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="dateRange"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>日期范围</FormLabel>
            <DatePickerWithRange date={field.value} onDateChange={field.onChange} />
          </FormItem>
        )}
      />
    </div>
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFilterSubmit)} className="hidden items-center gap-4 md:flex">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="用户名..." {...field} value={field.value ?? ''} className="h-8" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>请求名称</FormLabel>
              <FormControl>
                <Input placeholder="请求名称..." {...field} value={field.value ?? ''} className="h-8" />
              </FormControl>
            </FormItem>
          )}
        />

        {isSuperAdmin && (
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>所属租户</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''} disabled={isLoadingTenants}>
                  <FormControl>
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="筛选租户..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">所有租户</SelectItem>
                    {tenants?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1.5">日期范围</FormLabel>
              <DatePickerWithRange date={field.value} onDateChange={field.onChange} />
            </FormItem>
          )}
        />
        <div className="flex gap-2 self-end">
          <Button type="submit" size="sm">
            查询
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            重置
          </Button>
        </div>

        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>筛选日志</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">{renderFilters()}</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button onClick={form.handleSubmit(onFilterSubmit)}>应用筛选</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline">取消</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </form>
    </Form>
  );
};
