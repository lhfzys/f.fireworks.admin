'use client';

import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: { from?: Date; to?: Date };
  onDateChange?: (date?: DateRange) => void;
}
export function DatePickerWithRange({ className, date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'yyyy-MM-dd', { locale: zhCN })} -{' '}
                  {format(date.to, 'yyyy-MM-dd', { locale: zhCN })}
                </>
              ) : (
                format(date.from, 'yyyy-MM-dd', { locale: zhCN })
              )
            ) : (
              <span>选择日期范围</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date as DateRange}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
