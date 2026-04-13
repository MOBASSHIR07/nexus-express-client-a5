"use client";

import { useForm } from "@tanstack/react-form";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";
import { Mail, Lock, Loader2, ArrowRight, Globe } from "lucide-react"; // Globe আইকন যোগ করা হয়েছে
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInUserAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client"; // your auth client

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInPage() {
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/get-session-token?redirect=${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google login failed!");
    }
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Verifying credentials...");
      const result = await signInUserAction(value);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success("Welcome back!", { id: toastId });
      router.push("/dashboard");
      router.refresh();
    },
  });

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center px-6 relative overflow-hidden text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F5A0]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[450px] z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter mb-2 italic">
            NEXUS EXPRESS
          </h2>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
            Sign In
          </p>
        </div>

        {/* ✅ Google Login Button Added Here */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3 mb-6"
        >
        <FcGoogle className="h-4 w-4 mr-2" />
          <span className="uppercase text-[10px] tracking-widest font-black">Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0b0b14] px-4 text-white/20 font-black tracking-widest">Or login with email</span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: loginSchema.shape.email }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00F5A0] transition-colors"
                    size={18}
                  />
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@nexus.com"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-tighter">
                    {field.state.meta.errors[0]?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
            validators={{ onChange: loginSchema.shape.password }}
          >
            {(field) => (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-[10px] font-bold text-[#00F5A0] hover:underline uppercase"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00F5A0] transition-colors"
                    size={18}
                  />
                  <Input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-tighter">
                    {field.state.meta.errors[0]?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-2xl font-black text-[#06060b] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#00F5A0]/20 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-8 text-center text-sm text-white/40 font-medium tracking-tight">
          New to Nexus?
          <Link
            href="/sign-up"
            className="text-[#00F5A0] font-black ml-2 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
