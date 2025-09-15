import { BillingInterval, ApiResponse } from './common';

// Onboarding Step 1 types
export interface OnboardingStep1Request {
  first_name: string;
  last_name: string;
  institution_id: string;
  department: string;
  phone: number;
  profile_photo?: File | null;
}

// Onboarding Step 2 types  
export interface OnboardingStep2Request {
  company_name: string;
  website: string;
  country: string;
  phone: string;
  company_logo?: File;
  ai_avatar_logo?: File;
}

// Plan types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_interval: BillingInterval;
  features: string[];
  limits: {
    documents?: number;
    storage?: number;
    api_calls?: number;
    team_members?: number;
  };
  is_popular?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailablePlansResponse {
  plans: Plan[];
}

export interface SelectPlanRequest {
  plan_id: string;
  billing_interval: BillingInterval;
}

export interface CurrentPlan {
  plan: Plan;
  subscription_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
  usage: {
    documents_used: number;
    storage_used: number;
    api_calls_used: number;
    team_members: number;
  };
}

// Usage stream types
export interface UsageStreamItem {
  id: string;
  type: 'document_upload' | 'api_call' | 'team_member_added' | 'storage_used';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UsageStreamResponse {
  usage_items: UsageStreamItem[];
  total_count: number;
}

// API response types for onboarding endpoints
export type OnboardingStep1Response = ApiResponse<{ message: string }>;
export type OnboardingStep2Response = ApiResponse<{ message: string }>;
export type GetPlansResponse = ApiResponse<AvailablePlansResponse>;
export type SelectPlanResponse = ApiResponse<{ message: string; subscription_id: string }>;
export type CurrentPlanResponse = ApiResponse<CurrentPlan>;
export type GetUsageStreamResponse = ApiResponse<UsageStreamResponse>;
