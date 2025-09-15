import { apiClient } from './client';
import {
  RegisterRequest,
  RegisterInternalRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  SetPasswordRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginRequest,
  ProfileUpdateRequest,
  RegisterResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  SetPasswordResponse,
  ForgotPasswordResponse,
  VerifyResetOtpResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  LoginResponse,
  ProfileResponse,
  LogoutResponse,
  CsrfTokenApiResponse,
} from '../types/auth';

// Authentication API endpoints
export const authApi = {
  // Register new user
  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    if (data.role) formData.append('role', data.role);
    if (data.company) formData.append('company', data.company);
    
    return apiClient.postFormData('/auth/register/', formData);
  },

  // Register internal user with specific token
  registerInternal: (data: RegisterInternalRequest, token: string): Promise<RegisterResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    if (data.role) formData.append('role', data.role);
    if (data.company) formData.append('company', data.company);
    
    return apiClient.postFormData(`/auth/register/${token}/`, formData);
  },

  // Get CSRF token
  getCsrfToken: (): Promise<CsrfTokenApiResponse> => {
    return apiClient.get('/auth/csrf/');
  },

  // Verify OTP
  verifyOtp: (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('otp', data.otp);
    
    return apiClient.postFormData('/auth/verify-otp/', formData);
  },

  // Resend OTP
  resendOtp: (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    
    return apiClient.postFormData('/auth/resend-otp/', formData);
  },

  // Set password
  setPassword: (data: SetPasswordRequest): Promise<SetPasswordResponse> => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('confirm_password', data.confirm_password);
    formData.append('user_id', data.user_id);
    
    return apiClient.postFormData('/auth/set-password/', formData);
  },

  // Forgot password
  forgotPassword: (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    
    return apiClient.postFormData('/auth/forgot-password/', formData);
  },

  // Verify reset OTP
  verifyResetOtp: (data: VerifyResetOtpRequest): Promise<VerifyResetOtpResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('otp', data.otp);
    
    return apiClient.postFormData('/auth/verify-reset-otp/', formData);
  },

  // Reset password
  resetPassword: (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const formData = new FormData();
    formData.append('new_password', data.new_password);
    formData.append('reset_token', data.reset_token);
    
    return apiClient.postFormData('/auth/reset-password/', formData);
  },

  // Change password for authenticated user
  changePassword: (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const formData = new FormData();
    formData.append('current_password', data.current_password);
    formData.append('new_password', data.new_password);
    formData.append('confirm_password', data.confirm_password);
    
    return apiClient.postFormData('/auth/change-password/', formData);
  },

  // Login
  login: (data: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    return apiClient.postFormData('/auth/login/', formData);
  },

  // Get user profile
  getProfile: (): Promise<ProfileResponse> => {
    return apiClient.get('/auth/profile/');
  },

  // Update user profile
  updateProfile: (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
    const formData = new FormData();
    
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.department) formData.append('department', data.department);
    if (data.phone) formData.append('phone', data.phone);
    if (data.profile_photo) formData.append('profile_photo', data.profile_photo);
    
    return apiClient.putFormData('/auth/profile/', formData);
  },

  // Logout
  logout: (): Promise<LogoutResponse> => {
    return apiClient.post('/auth/logout/');
  },
};
