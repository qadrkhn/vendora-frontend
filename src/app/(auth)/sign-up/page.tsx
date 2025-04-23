"use client"

import { useState } from 'react';

import RegisterForm from '@/components/RegistrationForm';
import OtpVerificationForm from '@/components/OtpVerificationForm';

export default function SignupPage() {
  const [email, setEmail] = useState<string>('');

  return (
    <div>
      {!email ? (
        <RegisterForm onRegistered={setEmail} />
      ) : (
        <OtpVerificationForm email={email} />
      )}
    </div>
  );
}
