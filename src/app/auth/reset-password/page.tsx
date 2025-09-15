"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PasswordForm } from '@/components/auth/password-form';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Missing Reset Token</h1>
          <p className="mt-2 text-gray-600">
            Reset token is required. Please go back and try again.
          </p>
          <a 
            href="/auth/forgot-password" 
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Forgot Password
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <PasswordForm 
          resetToken={resetToken} 
          isResetFlow={true}
        />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
