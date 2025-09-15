import { apiClient } from './client';
import {
  OnboardingStep1Request,
  OnboardingStep2Request,
  SelectPlanRequest,
  GetDocumentsParams,
  OnboardingStep1Response,
  OnboardingStep2Response,
  GetPlansResponse,
  SelectPlanResponse,
  CurrentPlanResponse,
  GetUsageStreamResponse,
  BillingInterval,
} from '../types';

// Onboarding API endpoints
export const onboardingApi = {
  // Onboarding Step 1 - Personal Information
  step1: (data: OnboardingStep1Request): Promise<OnboardingStep1Response> => {
    return apiClient.post('/auth/onboarding/step1/', data);
  },

  // Onboarding Step 2 - Company Information
  step2: (data: OnboardingStep2Request): Promise<OnboardingStep2Response> => {
    return apiClient.post('/auth/onboarding/step2/', data);
  },

  // Get available plans
  getAvailablePlans: (billingInterval?: BillingInterval): Promise<GetPlansResponse> => {
    const params = billingInterval ? { billing_interval: billingInterval } : undefined;
    return apiClient.get('/home/plans/available/', params);
  },

  // Select a plan
  selectPlan: (data: SelectPlanRequest): Promise<SelectPlanResponse> => {
    const formData = new FormData();
    formData.append('plan_id', data.plan_id);
    formData.append('billing_interval', data.billing_interval);
    
    return apiClient.postFormData('/home/plans/select/', formData);
  },

  // Get current plan
  getCurrentPlan: (): Promise<CurrentPlanResponse> => {
    return apiClient.get('/home/plans/current/');
  },

  // Get usage stream
  getUsageStream: (): Promise<GetUsageStreamResponse> => {
    return apiClient.get('/home/usage-stream/');
  },
};
