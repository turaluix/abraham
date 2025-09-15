"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PasswordForm } from '@/components/auth/password-form';

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Missing User ID</h1>
          <p className="mt-2 text-gray-600">
            User ID parameter is required. Please go back and try again.
          </p>
          <a 
            href="/auth/register" 
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Registration
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <PasswordForm userId={userId} />
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}
