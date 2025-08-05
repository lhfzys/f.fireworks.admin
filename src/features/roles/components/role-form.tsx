'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApiForm } from '@/hooks/useApiForm';
import { useRoleMutations } from '../hooks/useRoleMutations';

const formSchema = z.object({
  name: z.string().min(1, '角色名称不能为空'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RoleFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
}
export const RoleForm = ({ mode, initialData, onSuccess }: RoleFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', description: '' },
  });
  const { createRoleMutation, updateRoleMutation } = useRoleMutations();

  const { handleApiSubmit, isSubmitting } = useApiForm({
    form,
    onSuccess,
  });

  const onSubmit = (data: FormData) => {
    handleApiSubmit(async () => {
      if (mode === 'edit' && initialData) {
        console.log(initialData);
        await updateRoleMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createRoleMutation.mutateAsync(data);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>角色名称</FormLabel>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
