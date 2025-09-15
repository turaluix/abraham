"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/api';
import { VerifyOtpRequest, ResendOtpRequest } from '@/types';

interface OtpFormProps {
  email: string;
  onSuccess?: (userId: string) => void;
  isResetFlow?: boolean; // For password reset flow
  redirectTo?: string;
  initialMessage?: string; // Success message from registration
}

export function OtpForm({ email, onSuccess, isResetFlow = false, redirectTo, initialMessage }: OtpFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(initialMessage || null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data: VerifyOtpRequest = {
        email,
        otp,
      };

      let response;
      if (isResetFlow) {
        response = await authApi.verifyResetOtp(data);
      } else {
        response = await authApi.verifyOtp(data);
      }
      
      // Handle the actual API response format
      if ((response as any).status === 'success' || ((response as any).data && (response as any).data.status === 'success')) {
        const responseData = (response as any).data || response;
        setSuccess(responseData.message || 'OTP verified successfully!');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(responseData.user_id || responseData.reset_token);
          } else if (redirectTo) {
            router.push(redirectTo);
          } else if (isResetFlow) {
            router.push(`/auth/reset-password?token=${responseData.reset_token}`);
          } else {
            router.push(`/auth/set-password?userId=${responseData.user_id}`);
          }
        }, 1000);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const data: ResendOtpRequest = { email };
      await authApi.resendOtp(data);
      
      setSuccess('OTP sent successfully!');
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setOtp(value);
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Verify your email
        </CardTitle>
        <CardDescription>
          We've sent a 6-digit code to <strong>{email}</strong>
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
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              required
              disabled={isLoading}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            onClick={handleResendOtp}
            disabled={isResending || resendCooldown > 0}
            className="text-sm"
          >
            {isResending 
              ? 'Sending...' 
              : resendCooldown > 0 
                ? `Resend in ${resendCooldown}s`
                : 'Resend code'
            }
          </Button>
        </div>

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
