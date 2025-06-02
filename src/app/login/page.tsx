
"use client";

import AuthForm from "@/components/auth/AuthForm";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/resume");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (user) {
    return null; 
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      // Navigation is handled by useEffect after user state updates
    } catch (error: any) {
      console.error("Login error:", error);
      let description = "An unexpected error occurred. Please try again.";
      let shouldRedirectToSignup = false;

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        // This error code is generic for "user not found" or "wrong password".
        // We will redirect to signup as per the request, assuming it might be a new user.
        description = "Login failed. If you're new, please sign up. If you have an account, please check your credentials and try logging in again.";
        shouldRedirectToSignup = true;
      } else if (error.code === 'auth/invalid-email') {
        description = "The email address is not valid. Please check the format.";
      } else if (error.code === 'auth/user-disabled') {
        description = "This user account has been disabled.";
      } else if (error.message) {
        description = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: description,
        variant: "destructive",
      });

      if (shouldRedirectToSignup) {
        router.push('/signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
