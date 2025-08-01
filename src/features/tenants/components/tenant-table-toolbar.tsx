'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TenantFilter } from '@/types/api-contract';

interface TenantTableToolbarProps {
  onFilterChange: (filters: Pick<TenantFilter, 'name'>) => void;
  onCreateClick: () => void;
}

export function TenantTableToolbar({ onFilterChange, onCreateClick }: TenantTableToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  useEffect(() => {
    onFilterChange({ name: debouncedSearchTerm });
  }, [debouncedSearchTerm, onFilterChange]);
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="按租户名搜索..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button size="sm" className="h-8 gap-1" onClick={onCreateClick}>
        <Plus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">新建租户</span>
      </Button>
    </div>
  );
}
