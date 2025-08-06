'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputWithSuffixProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  suffix: string;
  value?: string;
  onChange?: (value: string) => void;
}
const InputWithSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ className, suffix, value = '', onChange, ...props }, ref) => {
    const prefix = value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPrefix = event.target.value;
      const newValue = newPrefix ? `${newPrefix}${suffix}` : '';
      onChange?.(newValue);
    };
    return (
      <div
        className={cn(
          'border-input bg-background ring-offset-background flex h-10 w-full items-center rounded-md border text-sm',
          'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
          className,
        )}
      >
        <input
          className="placeholder:text-muted-foreground h-full w-full bg-transparent p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          // 3. 将 {...props} 放在这里，传递 placeholder, disabled 等
          {...props}
          // 4. input 的 value 始终是【前缀】
          value={prefix}
          // 5. input 的 onChange 使用我们自定义的处理器
          onChange={handleChange}
        />
        <span className="text-muted-foreground flex-shrink-0 pr-3">{suffix}</span>
      </div>
    );
  },
);
InputWithSuffix.displayName = 'InputWithSuffix';

export { InputWithSuffix };
