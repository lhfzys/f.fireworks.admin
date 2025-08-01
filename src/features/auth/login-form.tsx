'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { getMyProfile, loginUser } from '@/api/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/errors/ApiError';
import { useAuthStore } from '@/store/useAuthStore';

const formSchema = z.object({
  tenantIdentifier: z.string().nonempty('机构名称不能为空').min(4, { message: '长度不能小于4位。' }),
  identifier: z.string().nonempty('账号名称不能为空。').min(4, { message: '长度不能小于6位。' }),
  password: z.string().nonempty('密码不能为空。').min(6, { message: '长度不能小于6位。' }),
});

type FormData = z.infer<typeof formSchema>;

const getRememberedCredentials = () => {
  if (typeof window === 'undefined') {
    return { tenantIdentifier: '', identifier: '' };
  }
  const remembered = localStorage.getItem('rememberedUser');
  try {
    if (remembered) {
      const parsed = JSON.parse(remembered);
      return {
        tenantIdentifier: parsed.tenantIdentifier || '',
        identifier: parsed.identifier || '',
        password: '',
      };
    }
  } catch (e) {
    console.error('Failed to parse remembered user from localStorage', e);
  }
  return { tenantIdentifier: '', identifier: '', password: '' };
};

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore.getState();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getRememberedCredentials(),
  });

  useEffect(() => {
    if (localStorage.getItem('rememberedUser')) {
      setRememberMe(true);
    }
  }, []);

  const onSubmit = async (values: FormData) => {
    try {
      const loginResponse = await loginUser(values);
      useAuthStore.getState().refreshTokens(loginResponse.accessToken);
      const userProfile = await getMyProfile();
      login({
        accessToken: loginResponse.accessToken,
        user: userProfile,
      });
      if (rememberMe) {
        localStorage.setItem(
          'rememberedUser',
          JSON.stringify({
            tenantIdentifier: values.tenantIdentifier,
            identifier: values.identifier,
          }),
        );
      } else {
        localStorage.removeItem('rememberedUser');
      }
      toast.success('登录成功', {
        position: 'top-center',
        description: `欢迎回来, ${userProfile.userName}!`,
      });
      router.replace('/');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          toast.error('登录失败', { position: 'top-center', description: error.errors[0].message });
        } else {
          toast.error('登录失败', { position: 'top-center', description: error.message || '用户名或密码错误。' });
        }
      } else {
        toast.error('发生错误', { position: 'top-center', description: '网络或未知错误，请稍后重试。' });
      }
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">系统登录</CardTitle>
        <CardDescription>欢迎回来，请输入您的凭据</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenantIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>机构名称</FormLabel>
                  <FormControl>
                    <Input placeholder="机构名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号名称</FormLabel>
                  <FormControl>
                    <Input placeholder="用户名称/邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember-me" className="cursor-pointer text-sm leading-none font-medium">
                记住登录信息 (不保存密码)
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '登录中...' : '登 录'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
