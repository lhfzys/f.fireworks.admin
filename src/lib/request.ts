import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiResponse, LoginResponse } from '@/types/api-contract';
import { ApiError } from './errors/ApiError';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});
const refreshApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const apiResponse = response.data;
    if (apiResponse && apiResponse.isSuccess) {
      return apiResponse.data;
    }
    return Promise.reject(new ApiError(apiResponse || { isSuccess: false, message: 'Invalid response structure' }));
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshApiClient.post<ApiResponse<LoginResponse>>(`/api/auth/refresh`);
        console.log(refreshResponse);
        const newAccessToken = refreshResponse.data.data?.accessToken;
        if (!newAccessToken) {
          // useAuthStore.getState().logout();
          // window.location.href = '/login';
          return Promise.reject(error);
        }
        useAuthStore.getState().refreshTokens(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // useAuthStore.getState().logout();
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data));
    }

    return Promise.reject(error);
  },
);

export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient.request(config);
};
