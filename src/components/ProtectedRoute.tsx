'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, redirect to login
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
