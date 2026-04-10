"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Mail, Lock, User, Loader2, ArrowRight, Phone, ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpUserAction } from "@/actions/auth.action";
import { imageUpload } from "@/helpers/imageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum 8 characters"),
  phoneNumber: z.string().min(11, "Valid phone number required"),
});

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      profileImage: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating your profile...");
      try {
        // Upload image first, then send the string URL
        let imageUrl = "";
        if (value.profileImage) {
          imageUrl = await imageUpload(value.profileImage);
        }

        const result = await signUpUserAction({
          fullName: value.fullName,
          email: value.email,
          password: value.password,
          phoneNumber: value.phoneNumber,
          profileImage: imageUrl,
        });

        if (!result.success) {
          toast.error(result.message, { id: toastId });
          return;
        }

        toast.success("Account created! Welcome to Nexus.", { id: toastId });
        router.push("/sign-in");
      } catch {
        toast.error("Registration failed. Please try again.", { id: toastId });
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center py-20 px-6 relative overflow-hidden text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F5A0]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[480px] z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter italic text-[#00F5A0] mb-2">
            NEXUS
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
            Create Your Account
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Full Name */}
          <form.Field
            name="fullName"
            validators={{ onChange: registerSchema.shape.fullName }}
          >
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Full Name
                </Label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00F5A0] transition-colors"
                    size={18}
                  />
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white outline-none focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">
                    {field.state.meta.errors[0]?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: registerSchema.shape.email }}
          >
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
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
                    placeholder="email@example.com"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white outline-none focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">
                    {field.state.meta.errors[0]?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Phone */}
          <form.Field
            name="phoneNumber"
            validators={{ onChange: registerSchema.shape.phoneNumber }}
          >
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Phone Number
                </Label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00F5A0] transition-colors"
                    size={18}
                  />
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white outline-none focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">
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
            validators={{ onChange: registerSchema.shape.password }}
          >
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                  Secure Password
                </Label>
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
                    className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-white outline-none focus:border-[#00F5A0]/50 transition-all font-medium"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">
                    {field.state.meta.errors[0]?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Profile Image */}
          <form.Field name="profileImage">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 block text-center">
                  Profile Picture (Optional)
                </Label>
                <div className="relative group cursor-pointer h-14 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center px-4 gap-3 text-white/30 hover:border-[#00F5A0]/50 transition-all">
                  <ImageIcon size={18} />
                  <span className="text-xs truncate">
                    {field.state.value
                      ? field.state.value.name
                      : "Select Profile Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      field.handleChange(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Submit */}
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
                    Sign Up <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-8 text-center text-sm text-white/40 font-medium">
          Already a member?
          <Link
            href="/sign-in"
            className="text-[#00F5A0] font-black ml-2 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
