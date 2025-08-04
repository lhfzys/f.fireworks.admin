'use client';

import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAllDescendantIds } from '@/lib/utils/permission-utils';
import { MenuNode } from '@/types/api-contract';

interface PermissionNodeItemProps {
  node: MenuNode;
  allNodesMap: Map<string, MenuNode>;
  selectedIds: string[];
  onNodeToggle: (nodeId: string, isSelected: boolean) => void;
}

export const PermissionNodeItem = ({ node, allNodesMap, selectedIds, onNodeToggle }: PermissionNodeItemProps) => {
  const descendantIds = useMemo(() => getAllDescendantIds(node, allNodesMap), [node, allNodesMap]);
  const selectedDescendantCount = descendantIds.filter((id) => selectedIds.includes(id)).length;

  const isSelected = selectedIds.includes(node.id);
  const isIndeterminate = !isSelected && selectedDescendantCount > 0;

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    onNodeToggle(node.id, checked === true);
  };

  return (
    <div className="ml-4 space-y-2 py-1">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={node.id}
          checked={isIndeterminate ? 'indeterminate' : isSelected}
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor={node.id} className="cursor-pointer text-sm leading-none font-medium">
          {node.displayName}
        </Label>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="border-l pl-4">
          {node.children.map((child) => (
            <PermissionNodeItem
              key={child.id}
              node={child}
              allNodesMap={allNodesMap}
              selectedIds={selectedIds}
              onNodeToggle={onNodeToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
