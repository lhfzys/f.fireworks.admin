import { useQuery } from '@tanstack/react-query';
import { userService } from '@/api/services/userService';
import { UserFilter } from '@/types/api-contract';

export const useUsers = (filter: UserFilter) => {
  return useQuery({
    queryKey: ['users', filter],
    queryFn: () => userService.getPaginatedList(filter),
  });
};
