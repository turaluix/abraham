"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi, apiClient } from '@/api';
import { SetPasswordRequest, ResetPasswordRequest } from '@/types';
import { setCookie } from '@/lib/cookies';

interface PasswordFormProps {
  userId?: string;
  resetToken?: string;
  onSuccess?: () => void;
  isResetFlow?: boolean;
}

export function PasswordForm({ userId, resetToken, onSuccess, isResetFlow = false }: PasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      let response;
      
      if (isResetFlow && resetToken) {
        const data: ResetPasswordRequest = {
          new_password: formData.password,
          reset_token: resetToken,
        };
        response = await authApi.resetPassword(data);
      } else if (userId) {
        const data: SetPasswordRequest = {
          password: formData.password,
          confirm_password: formData.confirmPassword,
          user_id: userId,
        };
        response = await authApi.setPassword(data);
      } else {
        throw new Error('Missing required parameters');
      }
      
      // Handle response with tokens (for set password flow)
      if (response.status === 'success' && (response as any).tokens) {
        const { access, refresh } = (response as any).tokens;
        
        // Set tokens in API client
        apiClient.setToken(access);
        
        // Store tokens in cookies
        setCookie('access_token', access, 7);
        setCookie('refresh_token', refresh, 30);
        
        setSuccess('Password set successfully! Redirecting...');
        
        setTimeout(() => {
          router.push('/search');
        }, 1500);
      } else if (response.data || response.status === 'success') {
        setSuccess(isResetFlow ? 'Password reset successfully!' : 'Password set successfully!');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/auth/login');
          }
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (password: string) => {
    if (password.length === 0) return 'bg-gray-200';
    const errors = [
      password.length < 8,
      !/(?=.*[a-z])/.test(password),
      !/(?=.*[A-Z])/.test(password),
      !/(?=.*\d)/.test(password),
      !/(?=.*[@$!%*?&])/.test(password),
    ].filter(Boolean).length;

    if (errors >= 4) return 'bg-red-500';
    if (errors >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {isResetFlow ? 'Reset your password' : 'Set your password'}
        </CardTitle>
        <CardDescription>
          {isResetFlow 
            ? 'Enter your new password below'
            : 'Create a strong password for your account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            {formData.password && (
              <div className="space-y-1">
                <div className="flex space-x-1">
                  <div className={`h-1 w-1/3 rounded ${getPasswordStrengthColor(formData.password)}`} />
                  <div className={`h-1 w-1/3 rounded ${getPasswordStrengthColor(formData.password)}`} />
                  <div className={`h-1 w-1/3 rounded ${getPasswordStrengthColor(formData.password)}`} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Password strength: {validatePassword(formData.password) ? 'Weak' : 'Strong'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@$!%*?&)</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.password || !formData.confirmPassword}
          >
            {isLoading 
              ? (isResetFlow ? 'Resetting...' : 'Setting...') 
              : (isResetFlow ? 'Reset Password' : 'Set Password')
            }
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a 
            href="/auth/login" 
            className="text-primary hover:underline"
          >
            Back to login
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
