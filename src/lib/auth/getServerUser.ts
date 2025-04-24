// app/lib/auth/getServerUser.ts

import { cookies } from 'next/headers';

export type ServerUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified: boolean;
  email_verified_at: string | null;
  picture?: string;
};

export async function getServerUser(): Promise<ServerUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  
  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching server user:', error);
    return null;
  }
}
