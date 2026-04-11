"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      // Using window.location.search to avoid Next.js useSearchParams suspense requirement
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Authentication failed: No token found.");
        router.push("/sign-in");
        return;
      }

      try {
        // 1. Set the session token via our internal API
        const setSessionResponse = await fetch("/api/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!setSessionResponse.ok) {
          throw new Error("Failed to set session");
        }

        // 2. Fetch the session to determine the user's role
        const { data: session } = await authClient.getSession();

        if (!session) {
          throw new Error("Session not found after authentication");
        }

        const role = session.user.role;

        // 3. Redirect based on role
        if (role === "ADMIN") {
          router.push("/admin-dashboard");
        } else if (role === "RIDER") {
          router.push("/rider-dashboard");
        } else if (role === "USER") {
          router.push("/sender-dashboard/book-parcel");
        } else {
          router.push("/dashboard");
        }

        router.refresh();
      } catch (error) {
        console.error("Auth Callback Error:", error);
        toast.error("Internal authentication error. Please try again.");
        router.push("/sign-in");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#06060b] flex flex-col items-center justify-center text-white p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-[#00F5A0]/20 blur-2xl rounded-full" />
        <Loader2 className="h-12 w-12 text-[#00F5A0] animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-white/50 animate-pulse">
        Establishing Secure Session...
      </p>
    </div>
  );
}
