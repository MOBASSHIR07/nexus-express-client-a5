"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createParcelAction } from "@/actions/parcel.action";
import { toast } from "sonner";
import { Package, Truck, User, MapPin, Calculator, Loader2, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import coverageData from "@/data/coverage.json";

// 📝 Form Validation Schema
const bookParcelSchema = z.object({
  title: z.string().min(3, "Title too short"),
  category: z.enum(["PARCEL", "CARGO"]),
  weight: z.number().positive("Min 1KG required"),
  
  // Sender Location
  senderRegion: z.string().min(1, "Required"),
  senderDistrict: z.string().min(1, "Required"),
  senderArea: z.string().min(1, "Required"),
  senderAddress: z.string().min(5, "Detail pickup address required"),

  // Receiver Location
  receiverName: z.string().min(2, "Receiver name required"),
  receiverPhone: z.string().min(11, "Valid phone required"),
  receiverRegion: z.string().min(1, "Required"),
  receiverDistrict: z.string().min(1, "Required"),
  receiverArea: z.string().min(1, "Required"),
  receiverAddress: z.string().min(5, "Detail delivery address required"),
});

type BookParcelValues = z.infer<typeof bookParcelSchema>;

export default function BookParcelPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState(200);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookParcelValues>({
    resolver: zodResolver(bookParcelSchema),
    defaultValues: { category: "PARCEL", weight: 1 }
  });

  // Watchers for Dynamic Dropdowns
  const weight = watch("weight");
  const category = watch("category");
  const sRegion = watch("senderRegion");
  const sDistrict = watch("senderDistrict");
  const rRegion = watch("receiverRegion");
  const rDistrict = watch("receiverDistrict");

  // 🌍 Coverage Logic
  const regions = useMemo(() => [...new Set(coverageData.map(d => d.region))], []);
  
  const sDistricts = useMemo(() => coverageData.filter(d => d.region === sRegion).map(d => d.district), [sRegion]);
  const sAreas = useMemo(() => coverageData.find(d => d.district === sDistrict)?.covered_area || [], [sDistrict]);

  const rDistricts = useMemo(() => coverageData.filter(d => d.region === rRegion).map(d => d.district), [rRegion]);
  const rAreas = useMemo(() => coverageData.find(d => d.district === rDistrict)?.covered_area || [], [rDistrict]);

  // 💰 Backend Pricing Logic Consistency
  useEffect(() => {
    if (category === "PARCEL") setPrice(200);
    else if (category === "CARGO") setPrice(weight * 100);
  }, [weight, category]);

  const onSubmit = async (data: BookParcelValues) => {
    setIsSubmitting(true);
    
    // 🛠️ Formatting Data for Backend (Nested Structure)
    const finalPayload = {
      parcel: {
        title: data.title,
        category: data.category,
        weight: data.weight,
        pickupAddress: `${data.senderArea}, ${data.senderDistrict}, ${data.senderRegion}. (${data.senderAddress})`,
      },
      receiver: {
        name: data.receiverName,
        phone: data.receiverPhone,
        address: `${data.receiverArea}, ${data.receiverDistrict}, ${data.receiverRegion}. (${data.receiverAddress})`,
      },
      price: price
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await createParcelAction(finalPayload as any);

      if (result.success) {
        toast.success(result.message || "Shipment Initialized!", {
          description: "Moving to Secure Stripe Gateway...",
          duration: 3000,
        });

        // 💳 Redirect to Stripe Session
        setTimeout(() => {
          if (result.data?.paymentUrl) {
            window.location.href = result.data.paymentUrl;
          }
        }, 2000);
      } else {
        toast.error(result.message || "Initialization Failed.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Neural Link Failure: Server not responding.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div>
        <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
          Neural <span className="text-[#00F5A0]">Dispatch.</span>
        </h1>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mt-4 flex items-center gap-2">
          <Globe size={12} className="text-[#00F5A0] animate-pulse" /> Intelligent Coverage Protocol v2.0
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
        
        {/* Left Section: Form Inputs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Item Details */}
          <section className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-[10px] font-black text-[#00F5A0] uppercase tracking-widest flex items-center gap-2">
              <Package size={14} /> 01. Item Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input {...register("title")} placeholder="Parcel Title (e.g. Desktop Monitor)" className="bg-[#0b0b11] border border-white/5 rounded-2xl px-5 h-14 outline-none focus:border-[#00F5A0] transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <select {...register("category")} className="bg-[#0b0b11] border border-white/5 rounded-2xl px-4 h-14 outline-none">
                  <option value="PARCEL">PARCEL</option>
                  <option value="CARGO">CARGO</option>
                </select>
                <input type="number" {...register("weight", { valueAsNumber: true })} className="bg-[#0b0b11] border border-white/5 rounded-2xl px-5 h-14 outline-none" />
              </div>
            </div>
          </section>

          {/* 2. Sender Logistics */}
          <section className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> 02. Origin Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select {...register("senderRegion")} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none">
                <option value="">Region</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select {...register("senderDistrict")} disabled={!sRegion} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none disabled:opacity-20">
                <option value="">District</option>
                {sDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register("senderArea")} disabled={!sDistrict} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none disabled:opacity-20">
                <option value="">Area</option>
                {sAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <textarea {...register("senderAddress")} placeholder="Detail Pickup Address (House, Road, Apartment...)" rows={2} className="w-full bg-[#0b0b11] border border-white/5 rounded-2xl p-5 outline-none resize-none focus:border-white/20" />
          </section>

          {/* 3. Receiver Registry */}
          <section className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-[10px] font-black text-[#00D9F5] uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> 03. Target Registry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input {...register("receiverName")} placeholder="Receiver Full Name" className="bg-[#0b0b11] border border-white/5 rounded-2xl px-5 h-14 outline-none focus:border-[#00D9F5]" />
              <input {...register("receiverPhone")} placeholder="Receiver Phone Number" className="bg-[#0b0b11] border border-white/5 rounded-2xl px-5 h-14 outline-none focus:border-[#00D9F5]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select {...register("receiverRegion")} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none">
                <option value="">Region</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select {...register("receiverDistrict")} disabled={!rRegion} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none disabled:opacity-20">
                <option value="">District</option>
                {rDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register("receiverArea")} disabled={!rDistrict} className="bg-[#0b0b11] border border-white/5 rounded-xl px-4 h-12 outline-none disabled:opacity-20">
                <option value="">Area</option>
                {rAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <textarea {...register("receiverAddress")} placeholder="Full Delivery Address Details..." rows={2} className="w-full bg-[#0b0b11] border border-white/5 rounded-2xl p-5 outline-none resize-none focus:border-white/20" />
          </section>
        </div>

        {/* Right Section: Summary & Checkout */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#00F5A0]/10 to-[#00D9F5]/10 border border-[#00F5A0]/20 p-8 rounded-[3rem] sticky top-8 text-center backdrop-blur-sm">
            <Calculator className="text-[#00F5A0] mx-auto mb-4" size={32} />
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Neural Valuation</p>
            <h4 className="text-6xl font-black text-white italic mb-10 tracking-tighter">৳{price}</h4>
            
            <div className="space-y-4 mb-10 text-[10px] font-bold uppercase tracking-widest text-white/30 text-left border-t border-white/5 pt-6">
               <div className="flex justify-between"><span>Method</span><span className="text-white">STRIPE CARD</span></div>
               <div className="flex justify-between"><span>Payload</span><span className="text-white">{weight} KG / {category}</span></div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full h-20 bg-[#00F5A0] hover:bg-[#00D9F5] text-[#06060b] font-black rounded-[2rem] text-xl transition-all shadow-[0_20px_40px_rgba(0,245,160,0.2)] active:scale-95 flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <>INITIATE CHECKOUT <ArrowRight size={24} /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}