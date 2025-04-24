'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useEnsureUser from '@/hooks/useEnsureUser';

import Loader from '@/components/ui/Loader';
import userRoles from '@/constants/userRoles';

export default function DashboardPage() {
  const { user, loading } = useEnsureUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === userRoles.user.ADMIN) {
        router.replace('/dashboard/admin');
      } else if (user.role === userRoles.user.SELLER) {
        router.replace('/dashboard/seller');
      } else {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12" />
      </div>
    );
  }

  return null;
}
