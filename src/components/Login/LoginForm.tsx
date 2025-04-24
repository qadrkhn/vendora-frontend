'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';
import { useUserStore, User } from '@/stores/useUserStore';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        localStorage.setItem('temp_password', form.password);
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}&resend=true`);
        return;
      }

      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
