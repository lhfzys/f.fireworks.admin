'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-4xl font-bold">出错了！</h1>
      <p className="text-muted-foreground">抱歉，加载页面时发生了不可预知的错误。</p>
      <Button onClick={() => reset()}>再试一次</Button>
    </div>
  );
}