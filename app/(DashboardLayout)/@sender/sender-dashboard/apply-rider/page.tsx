"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { applyForRiderAction } from "@/actions/rider.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import coverageData from "@/data/coverage.json";

const applyRiderSchema = z.object({
  rider: z.object({
    phone: z.string().min(11, "Valid phone number required"),
    district: z.string().min(2, "District is required"),
    region: z.string().min(2, "Region is required"),
    vehicle: z.string().min(2, "Vehicle type is required"),
  }),
});

type ApplyRiderValues = z.infer<typeof applyRiderSchema>;

export default function ApplyRiderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ApplyRiderValues>({
    resolver: zodResolver(applyRiderSchema),
    defaultValues: {
      rider: {
        phone: "",
        district: "",
        region: "",
        vehicle: "",
      },
    },
  });

  const selectedRegion = watch("rider.region");

  const regions = useMemo(() => [...new Set(coverageData.map(d => d.region))], []);
  const districts = useMemo(() => {
    return coverageData
      .filter(d => d.region === selectedRegion)
      .map(d => d.district);
  }, [selectedRegion]);

  const onSubmit = async (values: ApplyRiderValues) => {
    setIsSubmitting(true);

    try {
      const result = await applyForRiderAction(values);

      if (result?.success) {
        toast.success(result.message || "Application submitted successfully.");
        reset();
      } else {
        toast.error(result?.message || "Unable to submit application.");
      }
    } catch {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="rounded-[2rem] border border-white/10 bg-[#0b0b19]/95 p-8 shadow-2xl text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Rider Application</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Become a Nexus Rider</h1>
            <p className="mt-2 text-sm text-white/50">Submit your details and our team will review your rider application.</p>
          </div>
          <Link href="/sender-dashboard/my-parcels">
            <Button variant="outline">Back to parcels</Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <section className="rounded-[2rem] border border-white/10 bg-[#0b0b19]/95 p-8 shadow-2xl text-white">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm uppercase tracking-[0.3em] text-white/40">Phone</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3">
                <Phone size={18} className="text-[#00F5A0]" />
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  {...register("rider.phone")}
                  className="w-full bg-transparent outline-none text-white placeholder:text-white/30"
                  suppressHydrationWarning
                />
              </div>
              {errors.rider?.phone && <p className="text-xs text-red-400">{errors.rider.phone.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/40">Region</label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3">
                  <Truck size={18} className="text-[#00F5A0]" />
                  <select
                    {...register("rider.region")}
                    className="w-full bg-transparent outline-none text-white appearance-none cursor-pointer [&>option]:bg-[#0b0b19]"
                  >
                    <option value="" disabled>Select Region</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                {errors.rider?.region && <p className="text-xs text-red-400">{errors.rider.region.message}</p>}
              </div>

              <div className="grid gap-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/40">District</label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3">
                  <MapPin size={18} className="text-[#00F5A0]" />
                  <select
                    {...register("rider.district")}
                    disabled={!selectedRegion}
                    className="w-full bg-transparent outline-none text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-[#0b0b19]"
                  >
                    <option value="" disabled>Select District</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {errors.rider?.district && <p className="text-xs text-red-400">{errors.rider.district.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm uppercase tracking-[0.3em] text-white/40">Vehicle</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3">
                <ShieldCheck size={18} className="text-[#00F5A0]" />
                <input
                  type="text"
                  placeholder="Motorbike, Van, Pickup..."
                  {...register("rider.vehicle")}
                  className="w-full bg-transparent outline-none text-white placeholder:text-white/30"
                  suppressHydrationWarning
                />
              </div>
              {errors.rider?.vehicle && <p className="text-xs text-red-400">{errors.rider.vehicle.message}</p>}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/50">After submission, our team will review your rider application and notify you.</p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-16 rounded-2xl bg-[#00F5A0] text-[#06060b] font-black uppercase tracking-[0.2em]">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><span>Submit Application</span> <ArrowRight size={18} /></>}
          </Button>
        </div>
      </form>
    </div>
  );
}
