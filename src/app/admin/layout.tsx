import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminNav from "@/components/cms/AdminNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext"; // Ensure this path is correct if using custom useAuth
import { redirect } from 'next/navigation';

// This server component checks admin status and redirects if necessary.
// For client-side components, useAuth hook provides user info.
async function checkAdminStatus() {
  // In a real app, this would involve checking a user role from a database
  // For now, we'll rely on the client-side check in ProtectedRoute and AdminNav,
  // or a similar check if AuthContext was available server-side (which it isn't easily).
  // True server-side protection here would require a session mechanism or token verification.
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // await checkAdminStatus(); // If we had server-side auth check

  return (
    <ProtectedRoute>
      {/* Client component to handle admin-specific logic like redirecting non-admins */}
      <AdminLayoutClient> 
        <div className="flex min-h-screen bg-muted/40">
          <AdminNav />
          <main className="flex-1 p-6 md:p-8">
            <ScrollArea className="h-full">
              {children}
            </ScrollArea>
          </main>
        </div>
      </AdminLayoutClient>
    </ProtectedRoute>
  );
}

// Create