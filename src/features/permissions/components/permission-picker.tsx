'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { usePermissionTree } from '../hooks/usePermissionTree';
import { PermissionNodeItem } from './permission-node-item';

interface PermissionPickerProps {
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
}

export const PermissionPicker = ({ value = [], onChange }: PermissionPickerProps) => {
  const { permissionTree, isLoading, allNodesMap, selectedIds, handleNodeToggle } = usePermissionTree(value, onChange);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="h-64 overflow-y-auto rounded-md border p-4">
      {permissionTree?.map((node) => (
        <PermissionNodeItem
          key={node.id}
          node={node}
          allNodesMap={allNodesMap}
          selectedIds={selectedIds}
          onNodeToggle={handleNodeToggle}
        />
      ))}
    </div>
  );
};
