"use client";

import AuthForm from "@/components/auth/AuthForm";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAIL = 'admin@example.com'; // Simplified admin check

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (user && user.email === ADMIN_EMAIL) {
    router.push("/admin/dashboard");
    return null; 
  }
  
  // If user is logged in but not admin, redirect them or show message
  if (user && user.email !== ADMIN_EMAIL) {
    router.push("/"); // Or a "not authorized" page
    toast({ title: "Access Denied", description: "You are not authorized to access the admin panel.", variant: "destructive" });
    return null;
  }


  const handleAdminLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    if (values.email !== ADMIN_EMAIL) {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Admin Login Successful", description: "Welcome to the admin panel!" });
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin Login error:", error);
      toast({
        title: "Admin Login Failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">ResumeForge Admin</h1>
      </div>
      <AuthForm mode="login" onSubmit={handleAdminLogin} loading={loading} />
    </div>
  );
}

// Override RootLayout for admin login to provide a simpler UI
AdminLoginPage.getLayout = function getLayout(page: React.ReactElement) {
  