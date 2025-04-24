import { useState } from 'react';

import API from '@/lib/api';
import apiRoutes from '@/constants/apiRoutes';

type Props = {
  onRegistered: (email: string) => void;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type ErrorState = {
  [key: string]: string;
};

export default function RegisterForm({ onRegistered }: Props) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    try {
      await API.post(apiRoutes.auth.register, form);
      setSuccess('Registered! Check your email for OTP.');
      localStorage.setItem('temp_password', form.password);
      onRegistered(form.email);
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        name="password_confirmation"
        type="password"
        placeholder="Confirm Password"
        value={form.password_confirmation}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        required
      />

      {Object.entries(errors).map(([key, msg]) => (
        <p key={key} className="text-sm text-red-600">{msg}</p>
      ))}

      {success && <p className="text-sm text-green-600">{success}</p>}

      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  );
}
