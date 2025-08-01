'use client';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center pt-20">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <ShieldAlert className="text-destructive h-6 w-6" />
          </div>
          <CardTitle className="mt-4">禁止访问</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">抱歉，您没有足够的权限来访问此页面。</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
