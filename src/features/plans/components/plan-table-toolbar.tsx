'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAllPlans } from '@/features/plans/hooks/usePlans';
import { PlanFilter } from '@/types/api-contract';

interface PlanTableToolbarProps {
  onFilterChange: (filter: PlanFilter) => void;
  onCreateClick: () => void;
}

export function PlanTableToolbar({ onFilterChange, onCreateClick }: PlanTableToolbarProps) {
  const [name, setName] = useState('');
  const [debouncedName] = useDebounce(name, 500);
  const { data: plans, isLoading: isLoadingPlans } = useAllPlans();

  useEffect(() => {
    onFilterChange({ name: debouncedName });
  }, [debouncedName, onFilterChange]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-y-1">
        <Input
          placeholder="按套餐名称搜索..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button size="sm" className="h-8 gap-1" onClick={onCreateClick}>
        <Plus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">新建套餐</span>
      </Button>
    </div>
  );
}
