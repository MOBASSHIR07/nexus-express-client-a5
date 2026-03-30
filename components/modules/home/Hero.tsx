"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, PlayCircle, CheckCircle } from "lucide-react";

export default function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <section id="hero" className="relative w-full pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden bg-[#06060b]">
      
      
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
      // Subtle Grid Overlay for Depth bg squares every 40px, using linear gradients
        style={{
          backgroundImage: `
            linear-gradient(#fff 1px, transparent 1px), 
            linear-gradient(90deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px', 
        }}
      />

      {/* 2. Exact Canva Glows */}
      <div className="absolute -top-50 left-[-100px] w-[600px] h-[600px] rounded-full bg-[#00F5A0] opacity-[0.12] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[#00D9F5] opacity-[0.12] blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Content with Staggered Animation */}
        <motion.div 
          initial="initial"
          animate="animate"
          className="flex-1 text-center lg:text-left"
        >
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> 
              Live Tracking Available
            </div>
          </motion.div>

          <motion.h1 
            {...fadeInUp} 
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-[900] leading-[1.05] tracking-tight mb-6 text-white"
          >
            Fast & Reliable<br />
            <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">
              Parcel Delivery
            </span>
          </motion.h1>

          <motion.p 
            {...fadeInUp} 
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-lg mx-auto lg:mx-0 mb-8 font-light leading-relaxed"
          >
            আপনার পার্সেল, আমাদের দায়িত্ব — সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি সেবা
          </motion.p>

          <motion.div 
            {...fadeInUp} 
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button className="h-14 px-8 rounded-2xl font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#06060b] hover:opacity-90 transition-all border-none">
              <Package className="mr-2 h-5 w-5" /> Book a Parcel
            </Button>
            <Button variant="outline" className="h-14 px-8 rounded-2xl font-semibold border-white/10 hover:bg-white/5 text-white transition-all">
              <PlayCircle className="mr-2 h-5 w-5 text-[#00F5A0]" /> Watch Demo
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            {...fadeInUp} 
            transition={{ delay: 0.5 }}
            className="flex items-center gap-8 mt-10 justify-center lg:justify-start text-sm text-white/40"
          >
            <div className="text-center lg:text-left">
              <span className="text-2xl font-bold text-white tracking-tighter">50K+</span><br />
              Deliveries
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center lg:text-left">
              <span className="text-2xl font-bold text-white tracking-tighter">64</span><br />
              Districts
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center lg:text-left">
              <span className="text-2xl font-bold text-white tracking-tighter">99%</span><br />
              On-Time
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual with Canva SVG & Floating Logic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative flex justify-center items-center"
        >
          {/* Constant Floating Motion */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* SVG Geometry from Canva */}
            <svg width="340" height="340" viewBox="0 0 340 340" fill="none" className="drop-shadow-[0_0_30px_rgba(0,245,160,0.1)]">
              <circle cx="170" cy="170" r="160" fill="url(#g1)" stroke="url(#g2)" strokeWidth="1.5" strokeDasharray="8 8" />
              <circle cx="170" cy="170" r="120" fill="none" stroke="url(#g2)" strokeWidth="0.5" opacity="0.3" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="340" y2="340">
                  <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00D9F5" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F5A0" />
                  <stop offset="100%" stopColor="#00D9F5" />
                </linearGradient>
              </defs>
              <g transform="translate(110, 100)">
                <rect x="0" y="40" width="80" height="55" rx="8" fill="url(#g2)" opacity="0.9" />
                <rect x="80" y="55" width="40" height="40" rx="6" fill="#00D9F5" opacity="0.7" />
                <circle cx="30" cy="100" r="12" fill="#06060b" stroke="#00F5A0" strokeWidth="3" />
                <circle cx="100" cy="100" r="12" fill="#06060b" stroke="#00D9F5" strokeWidth="3" />
              </g>
            </svg>

            {/* Floating Delivered Badge with framer delay */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-2 -right-6 bg-[#10101e] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Status</p>
                <p className="text-sm font-black text-green-400">Delivered!</p>
              </div>
            </motion.div>

            {/* Floating Tracking Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-[#10101e] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl min-w-[140px] backdrop-blur-md"
            >
              <p className="text-[10px] text-white/50 mb-1 italic">Tracking #NX2026</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"></div>
                  <div className="w-6 h-6 rounded-full bg-[#16162a] border-2 border-[#10101e] flex items-center justify-center text-[8px]">📦</div>
                </div>
                <span className="text-[11px] font-black text-white/70 uppercase">In Transit</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}