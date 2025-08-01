import { MenuNode } from '@/types/api-contract';

// 递归地将树状菜单扁平化为一个路径到权限码的映射
const createPathPermissionMap = (menu: MenuNode[], map = new Map<string, string>()) => {
  for (const node of menu) {
    if (node.path && node.code) {
      map.set(node.path, node.code);
    }
    if (node.children) {
      createPathPermissionMap(node.children, map);
    }
  }
  return map;
};

// 主函数：检查当前路径是否被授权
export const isPathAuthorized = (pathname: string, menu: MenuNode[] | null, userPermissions: string[]): boolean => {
  if (!menu) return false;

  const pathPermissionMap = createPathPermissionMap(menu);

  // 找到与当前路径最匹配的菜单项
  // 例如，对于 /users/edit/123，它应该匹配上 /users 的权限
  const matchedPath = [...pathPermissionMap.keys()].find((menuPath) => pathname.startsWith(menuPath));

  if (!matchedPath) {
    // 如果一个路径在菜单中都找不到，我们默认它不需要特定权限，或者是一个404页面
    // 对于后台，更安全的做法是，找不到就禁止
    // 仪表盘是所有登录用户都可以访问的
    return pathname === '/dashboard';
  }

  const requiredPermission = pathPermissionMap.get(matchedPath);

  return requiredPermission ? userPermissions.includes(requiredPermission) : true;
};
