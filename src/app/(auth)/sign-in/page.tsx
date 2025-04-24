'use client'

import Link from 'next/link';

import LoginForm from '@/components/Login/LoginForm';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500">Enter your credentials to sign in</p>
      </div>

      <GoogleLoginButton text='signin_with' context='signin' />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      <LoginForm />

      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
