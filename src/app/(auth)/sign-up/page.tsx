'use client';

import { useState } from 'react';
import Link from 'next/link';

import RegisterForm from '@/components/RegistrationForm';
import OtpVerificationForm from '@/components/OtpVerificationForm';
import GoogleLoginButton from '@/components/GoogleLoginButton';


export default function SignupPage() {
  const [email, setEmail] = useState<string>('');

  return (
    <div className="space-y-6">
      {!email ? (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Use google or Enter your details below to sign up</p>
          </div>

          <GoogleLoginButton text="signup_with" context='signup' />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <RegisterForm onRegistered={setEmail} />

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-center text-xl font-semibold">Verify your email</h1>
          <OtpVerificationForm email={email} />
        </>
      )}
    </div>
  );
}
