'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePermissions } from '@/app/(admin)/system/permissions/hooks/usePermissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuNode } from '@/types/api-contract';

interface PermissionPickerProps {
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
}

// 递归渲染节点的组件
const PermissionNodeItem = ({ node, allNodesMap, selectedIds, onNodeToggle }: any) => {
  const childrenIds = useMemo(() => getAllDescendantIds(node, allNodesMap), [node, allNodesMap]);
  const selectedChildrenCount = childrenIds.filter((id) => selectedIds.includes(id)).length;

  const isSelected = selectedIds.includes(node.id);
  // 半选状态：自身未被全选，但至少有一个子节点被选中
  const isIndeterminate = !isSelected && selectedChildrenCount > 0;

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
        <label htmlFor={node.id} className="text-sm leading-none font-medium">
          {node.displayName}
        </label>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="border-l pl-4">
          {node.children.map((child: any) => (
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

// 帮助函数：获取一个节点的所有子孙ID
const getAllDescendantIds = (node: MenuNode, allNodesMap: Map<string, MenuNode>): string[] => {
  let ids: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id);
      ids = [...ids, ...getAllDescendantIds(child, allNodesMap)];
    }
  }
  return ids;
};

// 帮助函数：获取一个节点的所有父辈ID
const getAllAncestorIds = (node: MenuNode, allNodesMap: Map<string, MenuNode>): string[] => {
  const ids: string[] = [];
  let current = node;
  while (current.parentId) {
    // 假设 MenuNode 有 parentId
    const parent = allNodesMap.get(current.parentId);
    if (parent) {
      ids.push(parent.id);
      current = parent;
    } else {
      break;
    }
  }
  return ids;
};

export const PermissionPicker = ({ value = [], onChange }: PermissionPickerProps) => {
  const { data: permissionTree, isLoading } = usePermissions();
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  // 创建一个 Map 结构，方便通过ID快速查找节点，只需计算一次
  const allNodesMap = useMemo(() => {
    const map = new Map<string, MenuNode>();
    const traverse = (nodes: MenuNode[]) => {
      for (const node of nodes) {
        map.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    if (permissionTree) traverse(permissionTree as MenuNode[]);
    return map;
  }, [permissionTree]);

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  const handleNodeToggle = (nodeId: string, isSelected: boolean) => {
    const node = allNodesMap.get(nodeId);
    if (!node) return;

    const descendantIds = getAllDescendantIds(node, allNodesMap);
    const ancestorIds = getAllAncestorIds(node, allNodesMap);

    const newSelectedIds = new Set(selectedIds);

    if (isSelected) {
      // 向上和向下级联选中
      [node.id, ...descendantIds, ...ancestorIds].forEach((id) => newSelectedIds.add(id));
    } else {
      // 向上和向下级联取消
      [node.id, ...descendantIds].forEach((id) => newSelectedIds.delete(id));
      // 向上重新评估
      ancestorIds.forEach((ancestorId) => {
        const ancestorNode = allNodesMap.get(ancestorId)!;
        const ancestorChildrenIds = getAllDescendantIds(ancestorNode, allNodesMap);
        const hasOtherSelectedChildren = ancestorChildrenIds.some((childId) => newSelectedIds.has(childId));
        if (!hasOtherSelectedChildren) {
          newSelectedIds.delete(ancestorId);
        }
      });
    }

    const finalIds = Array.from(newSelectedIds);
    setSelectedIds(finalIds);
    onChange?.(finalIds);
  };

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
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
