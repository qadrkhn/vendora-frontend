'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';
import { useUserStore, User } from '@/stores/useUserStore';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post(apiRoutes.auth.login, form);

      const user: User = {
        id: response.data.userid,
        name: response.data.user.name,
        email: response.data.user.email,
        email_verified: response.data.user.email_verified,
        email_verified_at: response.data.user.email_verified_at,
        role: response.data.user.role
      };

      const { setUser } = useUserStore.getState();
      setUser(user);

      router.push('/dashboard');
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 403) {
        // Email not verified case
        localStorage.setItem('temp_password', form.password);
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}&resend=true`);
        return;
      }

      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
