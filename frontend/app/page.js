'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Root page — redirects to /projects if logged in, /login if not.
 * Same pattern as ProtectedRoute in React.
 */
export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace('/projects');
    } else {
      router.replace('/login');
    }
  }, [token, router]);

  // Render nothing while redirecting
  return null;
}
