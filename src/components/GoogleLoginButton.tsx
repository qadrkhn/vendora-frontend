'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

import { useUserStore } from '@/stores/useUserStore';
import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';

type GoogleLoginText = 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
type OneTapContext = 'signin' | 'signup' | 'use';

type Props = {
  text: GoogleLoginText;
  context: OneTapContext;
};

export default function GoogleLoginButton({ text, context }: Props) {
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUserStore();

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <GoogleLogin
          logo_alignment="left"
          shape="circle"
          text={text}
          context={context}
          onSuccess={async (credentialResponse) => {
            setError('');
            try {
              const { credential } = credentialResponse;

              const { data } = await API.post(apiRoutes.auth.google, {
                token: credential,
              });

              setUser(data.user);
              router.push('/dashboard');
            } catch (err: any) {
              const message =
                err?.response?.data?.message ||
                'Something went wrong during Google login.';
              setError(message);
            }
          }}
          onError={() => {
            setError('Google Login Failed');
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-center text-red-600">{error}</p>
      )}
    </div>
  );
}
