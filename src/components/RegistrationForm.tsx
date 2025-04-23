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
      onRegistered(form.email);
      
      localStorage.setItem('temp_password', form.password);

    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <input name="password_confirmation" type="password" placeholder="Confirm Password" value={form.password_confirmation} onChange={handleChange} required />

      {Object.entries(errors).map(([key, msg]) => (
        <p key={key} style={{ color: 'red' }}>{msg}</p>
      ))}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
