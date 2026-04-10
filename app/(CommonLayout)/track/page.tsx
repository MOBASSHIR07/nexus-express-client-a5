"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TrackLandingPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setIsSearching(true);
    // Redirect to the dynamic detail page
    router.push(`/track/${trackingCode.trim()}`);
  };

  return (
    <div className="min-h-[80vh] bg-[#06060b] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00F5A0]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00D9F5]/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F5A0]/20 bg-[#00F5A0]/5 mb-8">
          <Package size={16} className="text-[#00F5A0]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00F5A0]">
            Neural Tracking System v2.0
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-[900] text-white tracking-tighter mb-6 leading-none uppercase">
          Track your <br />
          <span className="italic bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">Nexus Shipment</span>
        </h1>

        <p className="text-white/40 text-sm md:text-lg mb-12 max-w-lg mx-auto font-medium">
          Enter your unique tracking code below to unlock real-time intelligence on your parcel&apos;s journey.
        </p>

        <form onSubmit={handleTrack} className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity rounded-3xl" />
          
          <div className="relative flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00F5A0] transition-colors" size={20} />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Enter Tracking ID (e.g., NX-1234567)"
                className="w-full h-16 md:h-20 pl-16 pr-6 bg-[#0b0b14] border border-white/10 rounded-2xl md:rounded-3xl text-white text-lg outline-none focus:border-[#00F5A0]/50 transition-all font-mono tracking-wider placeholder:text-white/10"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSearching || !trackingCode.trim()}
              className="h-16 md:h-20 px-10 rounded-2xl md:rounded-3xl bg-[#00F5A0] hover:bg-[#00D9F5] text-[#06060b] font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2 shadow-2xl shadow-[#00F5A0]/20"
            >
              {isSearching ? <Loader2 className="animate-spin" /> : <>Track <ArrowRight size={18} /></>}
            </Button>
          </div>
        </form>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
           <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <MapPin size={18} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Global Ops</p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <Search size={18} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Deep Scan</p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <Package size={18} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Secure Link</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
