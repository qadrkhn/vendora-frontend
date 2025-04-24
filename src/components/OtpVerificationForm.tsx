'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';

type Props = {
  email: string;
};

export default function OtpVerificationForm({ email }: Props) {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldShowResend = searchParams.get('resend') === 'true';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await API.post(apiRoutes.auth.verifyOtp, { email, otp });
      setMessage('Email verified successfully. Logging in ...');

      const password = localStorage.getItem('temp_password');
      if (!password) {
        router.push('/sign-in');
        return;
      }

      localStorage.removeItem('temp_password');
      await API.post(apiRoutes.auth.login, { email, password });

      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    setResendError('');

    try {
      const res = await API.post(apiRoutes.auth.resendOtp, { email });
      setResendMessage(res.data.message);
      setResendCooldown(60);
    } catch (err: any) {
      setResendError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(val) => setOtp(val)}
        containerClassName="justify-center"
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot 
              key={i} 
              index={i}
              className="w-14 h-14 text-xl rounded-md border-2 focus:ring-2 transition-all"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        disabled={otp.length !== 6}
      >
        Verify
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      {shouldShowResend && (
        <div className="pt-4 space-y-2 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>

          {resendMessage && <p className="text-sm text-green-600">{resendMessage}</p>}
          {resendError && <p className="text-sm text-red-600">{resendError}</p>}
        </div>
      )}
    </form>
  );
}
