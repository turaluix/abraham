"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/api';
import { RegisterRequest, UserRole } from '@/types';

interface RegisterFormProps {
  onSuccess?: () => void;
  isInternal?: boolean;
  internalToken?: string;
}

export function RegisterForm({ onSuccess, isInternal = false, internalToken }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    role: 'account_holder',
    company: '',
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

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      
      if (isInternal && internalToken) {
        response = await authApi.registerInternal(formData, internalToken);
      } else {
        response = await authApi.register(formData);
      }
      
      // Handle the actual API response format
      if (response.status === 'success' || (response as any).data?.status === 'success') {
        const responseData = (response as any).data || response;
        
        // Use the email from response if available, otherwise use form email
        const emailToVerify = responseData.email || formData.email;
        
        // Redirect immediately to OTP verification
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(emailToVerify)}&message=${encodeURIComponent(responseData.message)}`);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {isInternal ? 'Join Your Team' : 'Create your account'}
        </CardTitle>
        <CardDescription>
          {isInternal 
            ? 'Complete your registration to join the team'
            : 'Enter your details to get started'
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          {!isInternal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account_holder">Account Holder</SelectItem>
                    <SelectItem value="team_member">Team Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company <span className="text-muted-foreground">Optional</span></Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {!isInternal && (
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a 
              href="/auth/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
