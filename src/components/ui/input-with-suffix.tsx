'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputWithSuffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix: string;
}
const InputWithSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ className, suffix, ...props }, ref) => {
    return (
      <div
        className={cn(
          'border-input bg-background ring-offset-background flex h-10 w-full items-center rounded-md border text-sm',
          'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2', // 模拟 :focus 效果
          className,
        )}
      >
        <input
          className="placeholder:text-muted-foreground h-full w-full bg-transparent p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
        {/* 3. 在右侧放入后缀文本 */}
        <span className="text-muted-foreground flex-shrink-0 pr-3">{suffix}</span>
      </div>
    );
  },
);
InputWithSuffix.displayName = 'InputWithSuffix';

export { InputWithSuffix };
