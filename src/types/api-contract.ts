// 分页参数
import { PermissionType, TenantType, UserStatus } from '@/enums/base-enum';

interface FilterBase {
  pageNumber?: number;
  pageSize?: number;
}

// 分页结果
export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * 后端返回错误类型详细信息
 */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

/**
 * 后端API返回的统一响应体结构。
 * @template T - 成功时，data字段的具体类型。
 */
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data: T | null;
  message: string | null;
  errors: ApiErrorDetail[] | null;
}

// 租户详情
export interface TenantInfo {
  id: string;
  name: string;
  type: TenantType;
  createOn: Date;
}
// 菜单节点
export interface MenuNode {
  id: string;
  displayName: string;
  path: string | null;
  icon: string | null;
  code: string | null;
  children?: MenuNode[] | null;
  parentId?: string | null;
}
// 用户信息
export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatarUrl: string | null;
  status: UserStatus;
  tenant: TenantInfo | null;
  roles: string[];
  permissions: string[];
  menus: MenuNode[];
}
// 登录参数
export interface LoginRequest {
  tenantIdentifier: string;
  identifier: string;
  password: string;
}
// 登录响应
export interface LoginResponse {
  accessToken: string;
}
export interface User {
  id: string;
  userName: string;
  email: string;
  status: UserStatus;
  createdOn: string;
  tenantId: string;
  tenantName: string | null;
}
// 用户查询筛选参数
export interface UserFilter extends FilterBase {
  userName?: string;
  status?: UserStatus;
  tenantId?: string;
}
export interface CreateUserRequest {
  userName: string;
  email?: string;
  password?: string;
  tenantId?: string;
}
export interface UpdateUserRequest {
  userName: string;
  email: string;
  status: UserStatus;
}
export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  isActive: boolean;
  CreateOn: Date;
}
export interface TenantDetails {
  id: string;
  name: string;
  type: TenantType;
  isActive: boolean;
  planId?: string;
}
export interface TenantFilter extends FilterBase {
  name?: string;
}
export interface CreateTenantRequest {
  name: string;
  type: TenantType;
  planId?: string;
}
export interface UpdateTenantRequest {
  name: string;
  isActive: boolean;
  planId?: string;
}
export interface PlanFilter extends FilterBase {
  name?: string;
}
export interface Plan {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds?: string[];
}
export interface CreatePlanRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}
export interface UpdatePlanRequest {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds: string[];
}
export interface Permissions {
  id: string;
  code: string;
  displayName: string;
  type: PermissionType;
  sortOrder: number;
  parentId?: string;
  path?: string;
  icon?: string;
}
export interface OnboardTenantRequest {
  tenantName: string;
  tenantType: TenantType;
  planId?: string | null;
  adminEmail: string;
  adminUserName: string;
  adminPassword: string;
}
// --- 角色管理 start ---
export interface Role {
  id: string;
  name: string;
  tenantId: string;
  tenantName: string | null;
  description: string | null;
  createOn: Date;
  isProtected: boolean;
}
export interface RoleDetailsDto extends Role {
  permissionIds: string[];
}
export interface RoleFilter extends FilterBase {
  name?: string;
  tenantId?: string;
}
export interface CreateRoleRequest {
  name: string;
  description?: string;
}
export interface UpdateRoleRequest {
  name: string;
  description?: string;
}
export interface UpdateRolePermissionsRequest {
  roleId: string;
  permissionIds: string[];
}
// --- 套餐管理 start ---
export interface Plan {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}
export interface PlanDetails extends Plan {
  permissionIds: string[];
}
export interface PlanFilter extends FilterBase {
  name?: string;
}
export interface CreatePlanRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}
export interface UpdatePlanRequest {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  permissionIds: string[];
}
// --- 审计日志 ---
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string | null;
  userName: string | null;
  tenantId: string;
  tenantName: string | null;
  requestName: string;
  httpMethod: string;
  url: string;
  statusCode: number;
  executionDurationMs: number;
  ipAddress: string;
}
export interface AuditLogFilter extends FilterBase {
  userName?: string;
  requestName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tenantId?: string;
}
