"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// This is a simplified admin check. In a real app, use roles.
const ADMIN_EMAIL = 'admin@example.com'; 

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/'); // Redirect non-admins to home
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4">Verifying admin access...</p>
      </div>
    );