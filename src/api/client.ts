import { ApiResponse } from '../types/common';

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

// Default configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.whelp.ai',
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

export class ApiClient {
  private config: ApiClientConfig;
  private token: string | null = null;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
  }

  // Get authorization headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Get headers for FormData requests
  private getFormDataHeaders(): Record<string, string> {
    return {
      ...this.getAuthHeaders(),
      // Don't set Content-Type for FormData, let browser set it with boundary
    };
  }

  // Get headers for JSON requests
  private getJsonHeaders(): Record<string, string> {
    return {
      ...this.config.defaultHeaders,
      ...this.getAuthHeaders(),
    };
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data: any;

    // Handle 204 No Content responses
    if (response.status === 204) {
      data = null;
    } else if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data?.message || data || `HTTP ${response.status}`);
    }

    return data;
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request<T>(url, {
      method: 'GET',
      headers: this.getJsonHeaders(),
    });
  }

  // POST request with JSON body
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: this.getJsonHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // POST request with FormData
  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: this.getFormDataHeaders(),
      body: formData,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: this.getJsonHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request with FormData
  async putFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: this.getFormDataHeaders(),
      body: formData,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: this.getJsonHeaders(),
    });
  }

  // Special method for X-Whelp-Token authentication (for some endpoints)
  async requestWithWhelpToken<T>(
    endpoint: string,
    whelpToken: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = {
      ...options.headers,
      'X-Whelp-Token': whelpToken,
    };

    return this.request<T>(endpoint, {
      ...options,
      headers,
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
