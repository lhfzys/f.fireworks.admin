'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllAncestorIds, getAllDescendantIds } from '@/lib/utils/permission-utils';
import { MenuNode } from '@/types/api-contract';
import { usePermissions } from './usePermissions';

export const usePermissionTree = (initialSelectedIds: string[] = [], onChange?: (selectedIds: string[]) => void) => {
  const { data: permissionTree, isLoading } = usePermissions();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

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
    setSelectedIds(initialSelectedIds);
  }, [initialSelectedIds]);

  const handleNodeToggle = useCallback(
    (nodeId: string, isSelected: boolean) => {
      const node = allNodesMap.get(nodeId);
      if (!node) return;

      const descendantIds = getAllDescendantIds(node, allNodesMap);
      const ancestorIds = getAllAncestorIds(node, allNodesMap);

      const newSelectedIds = new Set(selectedIds);

      if (isSelected) {
        [node.id, ...descendantIds, ...ancestorIds].forEach((id) => newSelectedIds.add(id));
      } else {
        [node.id, ...descendantIds].forEach((id) => newSelectedIds.delete(id));
        ancestorIds.forEach((ancestorId) => {
          const ancestorNode = allNodesMap.get(ancestorId)!;
          const ancestorChildrenIds = getAllDescendantIds(ancestorNode, allNodesMap);
          if (!ancestorChildrenIds.some((childId) => newSelectedIds.has(childId))) {
            newSelectedIds.delete(ancestorId);
          }
        });
      }

      const finalIds = Array.from(newSelectedIds);
      setSelectedIds(finalIds);
      onChange?.(finalIds);
    },
    [allNodesMap, onChange, selectedIds],
  );

  return {
    permissionTree,
    isLoading,
    allNodesMap,
    selectedIds,
    handleNodeToggle,
  };
};
