'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TabNavigation from './TabNavigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthenticatedLayout({ 
  children, 
  requireAuth = true 
}: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Tab Navigation */}
      {user && <TabNavigation />}
      
      {/* Main Content */}
      <main className="pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
} 