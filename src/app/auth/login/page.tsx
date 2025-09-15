"use client";

import { LoginForm } from '@/components/auth/login-form';

export default function AuthLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <LoginForm redirectTo="/search" />
      </div>
    </div>
  );
}
