"use client";

import { RegisterForm } from '@/components/auth/register-form';

interface InternalRegisterPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InternalRegisterPage({ params }: InternalRegisterPageProps) {
  const { token } = await params;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <RegisterForm 
          isInternal={true} 
          internalToken={token}
        />
      </div>
    </div>
  );
}
