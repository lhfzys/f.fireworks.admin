'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissionTree } from '../hooks/usePermissionTree';
import { PermissionNodeItem } from './permission-node-item';

interface PermissionPickerProps {
  initialSelectedIds?: string[];
  onSave: (selectedIds: string[]) => void; // 改为onSave，意图更明确
  isSaving: boolean;
}

export const PermissionPicker = ({ initialSelectedIds, onSave, isSaving }: PermissionPickerProps) => {
  const { permissionTree, isLoading, allNodesMap, selectedIds, handleNodeToggle } =
    usePermissionTree(initialSelectedIds);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
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
      <div className="flex justify-end">
        <Button onClick={() => onSave(selectedIds)} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存权限'}
        </Button>
      </div>
    </div>
  );
};
