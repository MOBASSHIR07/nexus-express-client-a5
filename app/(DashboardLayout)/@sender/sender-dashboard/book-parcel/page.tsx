/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createParcelAction } from "@/actions/parcel.action";
import { toast } from "sonner";
import { Package, Truck, User, MapPin, Calculator, Loader2, ArrowRight, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import coverageData from "@/data/coverage.json";

const bookParcelSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["PARCEL", "CARGO"]),
  weight: z.number().min(0.5, "Minimum weight 0.5 KG").max(50, "Maximum weight 50 KG"),
  senderRegion: z.string().min(1, "Please select sender region"),
  senderDistrict: z.string().min(1, "Please select sender district"),
  senderArea: z.string().min(1, "Please select sender area"),
  senderAddress: z.string().min(5, "Please enter detailed pickup address"),
  receiverName: z.string().min(2, "Receiver name required"),
  receiverPhone: z.string().min(11, "Valid phone number required (11 digits)").max(11, "Phone number must be 11 digits"),
  receiverRegion: z.string().min(1, "Please select receiver region"),
  receiverDistrict: z.string().min(1, "Please select receiver district"),
  receiverArea: z.string().min(1, "Please select receiver area"),
  receiverAddress: z.string().min(5, "Please enter detailed delivery address"),
});

type BookParcelValues = z.infer<typeof bookParcelSchema>;

export default function BookParcelPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState(200);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<BookParcelValues>({
    resolver: zodResolver(bookParcelSchema),
    defaultValues: {
      category: "PARCEL",
      weight: 1,
      title: "",
      senderRegion: "",
      senderDistrict: "",
      senderArea: "",
      senderAddress: "",
      receiverName: "",
      receiverPhone: "",
      receiverRegion: "",
      receiverDistrict: "",
      receiverArea: "",
      receiverAddress: ""
    }
  });

  const weight = watch("weight");
  const category = watch("category");
  const sRegion = watch("senderRegion");
  const sDistrict = watch("senderDistrict");
  const rRegion = watch("receiverRegion");
  const rDistrict = watch("receiverDistrict");

  const regions = useMemo(() => [...new Set(coverageData.map(d => d.region))], []);
  const sDistricts = useMemo(() => coverageData.filter(d => d.region === sRegion).map(d => d.district), [sRegion]);
  const sAreas = useMemo(() => coverageData.find(d => d.district === sDistrict)?.covered_area || [], [sDistrict]);
  const rDistricts = useMemo(() => coverageData.filter(d => d.region === rRegion).map(d => d.district), [rRegion]);
  const rAreas = useMemo(() => coverageData.find(d => d.district === rDistrict)?.covered_area || [], [rDistrict]);

  // Calculate price based on category and weight
  useEffect(() => {
    if (category === "PARCEL") {
      setPrice(200);
    } else if (category === "CARGO") {
      const basePrice = 100;
      const calculatedPrice = weight * basePrice;
      setPrice(calculatedPrice);
    }
  }, [weight, category]);

  const onSubmit = async (data: BookParcelValues) => {
    // Clear previous error
    setError(null);
    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Processing your shipment request...");

    try {
      // Prepare the payload according to your API expected format
      const finalPayload = {
        parcel: {
          title: data.title,
          category: data.category,
          weight: Number(data.weight),
          pickupAddress: `${data.senderArea}, ${data.senderDistrict}, ${data.senderRegion}. ${data.senderAddress}`,
          pickupDistrict: data.senderDistrict,
          deliveryDistrict: data.receiverDistrict,
        },
        receiver: {
          name: data.receiverName,
          phone: data.receiverPhone,
          address: `${data.receiverArea}, ${data.receiverDistrict}, ${data.receiverRegion}. ${data.receiverAddress}`,
        },
      };

      console.log("Sending payload:", finalPayload);

      const result = await createParcelAction(finalPayload as any);

      console.log("API Response:", result);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result?.success && result?.data?.paymentUrl) {
        toast.success("Shipment created! Redirecting to payment...", {
          duration: 3000,
        });

        // Small delay before redirect for better UX
        setTimeout(() => {
          window.location.href = result.data.paymentUrl;
        }, 1500);
      } else {
        // Handle different error scenarios
        const errorMessage = result?.message || "Failed to create shipment. Please try again.";
        toast.error(errorMessage);
        setError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.dismiss(loadingToast);

      const errorMessage = error?.message || "Network error! Please check your connection and try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Neural Dispatch Protocol v2.0
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Neural <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Dispatch</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Book a parcel delivery with intelligent coverage mapping. Real-time pricing and instant payment processing.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Booking Failed</p>
              <p className="text-xs text-red-400/80">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-8 space-y-6">

            {/* Item Specifications */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">01. Item Specifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("title")}
                    placeholder="Parcel Title (e.g., Documents, Electronics)"
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all"
                    suppressHydrationWarning
                  />
                  {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      {...register("category")}
                      className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="PARCEL">📦 PARCEL</option>
                      <option value="CARGO">🚚 CARGO</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.5"
                      {...register("weight", { valueAsNumber: true })}
                      placeholder="Weight (KG)"
                      className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                      suppressHydrationWarning
                    />
                    {errors.weight && <p className="text-xs text-red-400 mt-1">{errors.weight.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Origin Configuration */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">02. Pickup Location</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    {...register("senderRegion")}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                  >
                    <option value="">Select Region</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.senderRegion && <p className="text-xs text-red-400 mt-1">{errors.senderRegion.message}</p>}
                </div>
                <div>
                  <select
                    {...register("senderDistrict")}
                    disabled={!sRegion}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none disabled:opacity-50"
                  >
                    <option value="">Select District</option>
                    {sDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.senderDistrict && <p className="text-xs text-red-400 mt-1">{errors.senderDistrict.message}</p>}
                </div>
                <div>
                  <select
                    {...register("senderArea")}
                    disabled={!sDistrict}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none disabled:opacity-50"
                  >
                    <option value="">Select Area</option>
                    {sAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.senderArea && <p className="text-xs text-red-400 mt-1">{errors.senderArea.message}</p>}
                </div>
              </div>
              <div>
                <textarea
                  {...register("senderAddress")}
                  placeholder="Detailed pickup address (building, floor, road, etc.)"
                  rows={2}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 resize-none"
                  suppressHydrationWarning
                />
                {errors.senderAddress && <p className="text-xs text-red-400 mt-1">{errors.senderAddress.message}</p>}
              </div>
            </div>

            {/* Target Registry */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">03. Delivery Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("receiverName")}
                    placeholder="Receiver Full Name"
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                    suppressHydrationWarning
                  />
                  {errors.receiverName && <p className="text-xs text-red-400 mt-1">{errors.receiverName.message}</p>}
                </div>
                <div>
                  <input
                    {...register("receiverPhone")}
                    placeholder="Receiver Phone Number"
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                    suppressHydrationWarning
                  />
                  {errors.receiverPhone && <p className="text-xs text-red-400 mt-1">{errors.receiverPhone.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    {...register("receiverRegion")}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                  >
                    <option value="">Select Region</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.receiverRegion && <p className="text-xs text-red-400 mt-1">{errors.receiverRegion.message}</p>}
                </div>
                <div>
                  <select
                    {...register("receiverDistrict")}
                    disabled={!rRegion}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none disabled:opacity-50"
                  >
                    <option value="">Select District</option>
                    {rDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.receiverDistrict && <p className="text-xs text-red-400 mt-1">{errors.receiverDistrict.message}</p>}
                </div>
                <div>
                  <select
                    {...register("receiverArea")}
                    disabled={!rDistrict}
                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none disabled:opacity-50"
                  >
                    <option value="">Select Area</option>
                    {rAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.receiverArea && <p className="text-xs text-red-400 mt-1">{errors.receiverArea.message}</p>}
                </div>
              </div>
              <div>
                <textarea
                  {...register("receiverAddress")}
                  placeholder="Detailed delivery address (building, floor, road, etc.)"
                  rows={2}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 resize-none"
                  suppressHydrationWarning
                />
                {errors.receiverAddress && <p className="text-xs text-red-400 mt-1">{errors.receiverAddress.message}</p>}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Checkout */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm border border-emerald-500/20 p-6 space-y-6">
              <div className="text-center">
                <Calculator className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Estimated Cost</p>
                <h2 className="text-5xl font-bold text-white mt-2">${price}</h2>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Service Type</span>
                  <span className="text-white font-semibold">{category}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-white font-semibold">{weight} KG</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="text-emerald-400 font-semibold">Stripe / Card</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-center text-gray-500">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
