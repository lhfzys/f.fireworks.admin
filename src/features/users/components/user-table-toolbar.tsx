import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllTenants } from '@/features/tenants/hooks/useTenants';
import { UserFilter } from '@/types/api-contract';

interface UserTableToolbarProps {
  isSuperAdmin: boolean;
  onFilterChange: (filters: Partial<UserFilter>) => void;
  onCreateClick: () => void;
}
export function UserTableToolbar({ isSuperAdmin, onFilterChange, onCreateClick }: UserTableToolbarProps) {
  const [userName, setUserName] = useState('');
  const [debouncedName] = useDebounce(userName, 500);
  const { data: tenants, isLoading: isLoadingTenants } = useAllTenants();

  useEffect(() => {
    onFilterChange({ userName: debouncedName });
  }, [debouncedName, onFilterChange]);

  const handleTenantChange = (tenantId: string) => {
    onFilterChange({ tenantId: tenantId === 'all' ? undefined : tenantId });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="按用户名搜索..."
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isSuperAdmin && (
          <Select onValueChange={handleTenantChange} disabled={isLoadingTenants}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="按租户筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有租户</SelectItem>
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <Button size="sm" className="h-8 gap-1" onClick={onCreateClick}>
        <Plus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">新建用户</span>
      </Button>
    </div>
  );
}
