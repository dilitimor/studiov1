
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Determine a more specific loading message
    let loadingMessage = "Memuat...";
    if (loading && !user) {
      loadingMessage = "Memverifikasi sesi pengguna...";
    } else if (loading && user) {
      // This case means auth is loading but user object exists (rarely visibly different)
      loadingMessage = "Sesi pengguna sedang dimuat...";
    }
    
    // Example of path-specific message (though generally ProtectedRoute is generic)
    // if (pathname.startsWith('/admin')) {
    //   loadingMessage = "Verifying admin access...";
    // }

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  return children;
}
