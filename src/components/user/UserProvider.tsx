'use client';

import { ReactNode, useEffect, useState } from 'react';

import { useUserStore } from '@/stores/useUserStore';

import type { User } from '@/stores/useUserStore';
import Loader from '@/components/ui/Loader';

export default function UserProvider({ user, children }: { user: User | null; children: ReactNode }) {
  const { setUser, initialized } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      setUser(user);
    }
    setHydrated(true);
  }, [user, initialized, setUser]);

  if (!hydrated) return <Loader className='w-7 h-7'/>;
  return <>{children}</>;
}
