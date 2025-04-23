'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import OtpVerificationForm from "@/components/OtpVerificationForm";
import { useUserStore } from '@/stores/useUserStore';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const { user } = useUserStore();

  useEffect(() => {
    // Case 1: No email param
    if (!email) return;

    // Case 2: User is logged in and already verified
    if (user && user.email_verified) {
      router.replace('/dashboard');
    }

    // Case 3: User is logged in but unverified with a different email
    if (user && user.email !== email) {
      router.replace('/sign-in');
    }
  }, [user, email, router]);

  if (!email) return <p>Missing email</p>;

  return <OtpVerificationForm email={email} />;
}
