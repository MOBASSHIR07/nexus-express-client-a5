"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const parcelId = searchParams.get("parcelId");

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-[#00F5A0]/20 rounded-[3rem] p-10 text-center space-y-8 backdrop-blur-xl animate-in zoom-in duration-500">
        
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-[#00F5A0] blur-3xl opacity-20 animate-pulse" />
          <CheckCircle2 className="relative w-full h-full text-[#00F5A0]" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            Payment <span className="text-[#00F5A0]">Confirmed.</span>
          </h1>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            Neural Transaction Complete
          </p>
        </div>

        {/* Parcel ID Card */}
        <div className="bg-[#0b0b11] border border-white/5 rounded-2xl p-6 space-y-3">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center justify-center gap-2">
            <Package size={12} /> Registered Asset ID
          </p>
          <code className="block text-[#00D9F5] font-mono text-sm break-all">
            {parcelId || "NEX-SYNC-PENDING"}
          </code>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link href="/sender-dashboard/my-parcels" className="w-full">
            <Button className="w-full h-14 bg-[#00F5A0] hover:bg-[#00D9F5] text-[#06060b] font-bold rounded-2xl gap-2 transition-all shadow-[0_10px_30px_rgba(0,245,160,0.2)]">
              TRACK SHIPMENT <ArrowRight size={18} />
            </Button>
          </Link>
          
          <Link href="/sender-dashboard">
            <Button variant="ghost" className="w-full h-12 text-white/40 hover:text-white hover:bg-white/5 rounded-xl gap-2">
              <Home size={16} /> Return to Nexus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}