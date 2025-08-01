'use client';

import { CollapsibleMenuItem } from '@/components/layout/nav/collapsible-menu-item';
import { SingleMenuItem } from '@/components/layout/nav/single-menu-item';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/useAuthStore';

export function NavMain() {
  const menus = useAuthStore((state) => state.menus);
  if (!menus) return <SidebarMenu>...loading...</SidebarMenu>;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((item) => {
          const hasChildren = item.children && item.children.length > 0;

          return hasChildren ? (
            <CollapsibleMenuItem key={item.id} item={item} />
          ) : (
            <SingleMenuItem key={item.id} item={item} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
