'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { MenuNode } from '@/types/api-contract';

interface CollapsibleMenuItemProps {
  item: MenuNode;
}

export function CollapsibleMenuItem({ item }: CollapsibleMenuItemProps) {
  const pathname = usePathname();

  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.displayName}>
            <DynamicIcon name={item.icon ?? ''} />
            <span>{item.displayName}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.children?.map((subItem) => {
              const isActive = subItem.path ? pathname.startsWith(subItem.path) : false;
              return (
                <SidebarMenuSubItem key={subItem.displayName}>
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link href={subItem.path ?? ''}>
                      <span>{subItem.displayName}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
