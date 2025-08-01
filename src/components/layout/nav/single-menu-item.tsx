'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { MenuNode } from '@/types/api-contract';

interface SingleMenuItemProps {
  item: MenuNode;
}

export function SingleMenuItem({ item }: SingleMenuItemProps) {
  const pathname = usePathname();

  const isActive =
    item.path === '/dashboard' ? pathname === item.path : item.path ? pathname.startsWith(item.path) : false;

  if (!item.path) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.path}>
          <DynamicIcon name={item.icon ?? ''} className="h-4 w-4" />
          <span>{item.displayName}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}