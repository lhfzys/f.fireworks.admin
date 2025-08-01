'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { AccessDenied } from '@/components/common/access-denied';
import { AppSidebar } from '@/components/layout/app-siderbar';
import { Header } from '@/components/layout/header';
import { PageTransition } from '@/components/layout/page-transition';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { FullScreenSpinner } from '@/components/ui/full-screen-spinner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useHasHydrated } from '@/hooks/useHasHydrated';
import { cn } from '@/lib/utils';
import { isPathAuthorized } from '@/lib/utils/permission-utils';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useHasHydrated();
  const { isAuthenticated, user } = useAuthStore();
  const hasAccess = useMemo(() => {
    if (!user) return false;
    // 超级管理员拥有所有权限
    if (user.roles.includes('SuperAdmin')) return true;

    return isPathAuthorized(pathname, user.menus, user.permissions);
  }, [user, pathname]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return <FullScreenSpinner />;
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </Header>
        <div
          className={cn(
            'peer-[.header-fixed]/header:mt-16',
            'px-4 py-6',
            'fixed-main flex grow flex-col overflow-hidden',
          )}
        >
          <PageTransition>{children}</PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
