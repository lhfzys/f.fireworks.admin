import { ApiErrorDetail, ApiResponse } from '@/types/api-contract';

export class ApiError extends Error {
  public readonly errors: ApiErrorDetail[] | null;

  constructor(response: ApiResponse<any>) {
    super(response.message || 'API网关错误');
    this.name = 'ApiError';
    this.errors = response.errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}