'use client';

import { useAuthStore } from '@/store/useAuthStore';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];
  const isSuperAdmin = roles.includes('SuperAdmin');

  /**
   * 检查当前用户是否拥有指定的权限
   * @param requiredPermission - 需要检查的权限Code
   * @returns {boolean}
   */
  const hasPermission = (requiredPermission: string): boolean => {
    // 超级管理员默认拥有所有权限
    if (isSuperAdmin) return true;
    return permissions.includes(requiredPermission);
  };

  return {
    user,
    isAuthenticated,
    permissions,
    roles,
    isSuperAdmin,
    hasPermission,
  };
};
