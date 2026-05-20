import { apiPost } from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

export function login(data: LoginRequest): Promise<AuthResponse> {
  return apiPost<LoginRequest, AuthResponse>('/auth/login', data)
}

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiPost<RegisterRequest, AuthResponse>('/auth/register', data)
}
