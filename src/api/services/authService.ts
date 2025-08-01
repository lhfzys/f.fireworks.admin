import { request } from '@/lib/request';
import type { LoginRequest, LoginResponse, UserProfile } from '@/types/api-contract';

export const authService = {
  logout: (): Promise<void> => {
    return request({
      url: '/api/auth/logout',
      method: 'POST',
    });
  },
};
/**
 * 调用登录接口
 */
export const loginUser = (data: LoginRequest): Promise<LoginResponse> => {
  return request<LoginResponse>({
    url: '/api/auth/login',
    method: 'POST',
    data,
  });
};

/**
 * 获取当前登录用户的个人资料
 */
export const getMyProfile = (): Promise<UserProfile> => {
  return request<UserProfile>({
    url: '/api/me/profile',
    method: 'GET',
  });
};
