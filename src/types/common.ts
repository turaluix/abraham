// Base API response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
  page?: number;
  page_size?: number;
}

// Common form data types
export interface FormDataRequest {
  [key: string]: string | File | boolean | number;
}

// User roles
export type UserRole = 'account_holder' | 'team_member' | 'admin';

// Billing intervals
export type BillingInterval = 'monthly' | 'yearly';

// Access levels
export type AccessLevel = 'public' | 'private' | 'team';

// Processing status
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
