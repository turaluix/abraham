import { UserRole, ApiResponse } from './common';

// Registration types
export interface RegisterRequest {
  email: string;
  role?: UserRole;
  company?: string;
}

export interface RegisterInternalRequest extends RegisterRequest {
  // Internal registration with specific token path
}

// OTP types
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

// Password types
export interface SetPasswordRequest {
  password: string;
  confirm_password: string;
  user_id: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  new_password: string;
  reset_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  access: string;
  refresh: string;
  user: UserProfile;
}

// Profile types
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  company?: string;
  department?: string;
  phone?: string;
  profile_photo?: string;
  is_verified: boolean;
  is_email_verified?: boolean;
  date_joined?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  department?: string;
  phone?: string;
  profile_photo?: File;
}

// CSRF types
export interface CsrfTokenResponse {
  csrfToken: string;
}

export type CsrfTokenApiResponse = ApiResponse<CsrfTokenResponse>;

// Actual API response format (not wrapped in data object)
export interface RegisterActualResponse {
  status: 'success' | 'error';
  message: string;
  email: string;
  is_new_user: boolean;
}

export interface VerifyOtpActualResponse {
  status: 'success' | 'error';
  message: string;
  user_id?: string;
  reset_token?: string;
}

// API response types for auth endpoints
export type RegisterResponse = RegisterActualResponse | ApiResponse<RegisterActualResponse>;
export type VerifyOtpResponse = VerifyOtpActualResponse | ApiResponse<VerifyOtpActualResponse>;
export type ResendOtpResponse = ApiResponse<{ message: string }>;
export type SetPasswordResponse = ApiResponse<{ message: string }>;
export type ForgotPasswordResponse = ApiResponse<{ message: string }>;
export type VerifyResetOtpResponse = VerifyOtpActualResponse | ApiResponse<VerifyOtpActualResponse>;
export type ResetPasswordResponse = ApiResponse<{ message: string }>;
export type ChangePasswordResponse = ApiResponse<{ message: string }>;
export type LoginResponse = ApiResponse<LoginData>;
export type ProfileResponse = ApiResponse<UserProfile>;
export type LogoutResponse = ApiResponse<{ message: string }>;
