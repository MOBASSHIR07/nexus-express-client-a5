"use client";

import { motion } from "framer-motion";
import { ClipboardEdit, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Create a Request",
    description: "আপনার ড্যাশবোর্ড থেকে পার্সেল ডিটেইলস এবং পিকআপ লোকেশন সেট করুন।",
    icon: <ClipboardEdit size={32} />,
    alignment: "lg:mt-0",
  },
  {
    number: "02",
    title: "Rider Pickup",
    description: "নিকটস্থ রাইডার আপনার লোকেশনে এসে পার্সেলটি রিসিভ করে নেবে।",
    icon: <Truck size={32} />,
    alignment: "lg:mt-28",
  },
  {
    number: "03",
    title: "Fast Delivery",
    description: "আমাদের স্মার্ট লজিস্টিকস নেটওয়ার্কে গন্তব্যে পৌঁছে যাবে আপনার পার্সেল।",
    icon: <CheckCircle2 size={32} />,
    alignment: "lg:mt-0",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-32 bg-[#06060b] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-28">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-white tracking-tighter"
          >
            How it <span className="italic bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">Works </span> &#8594;
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-24 lg:gap-12 min-h-[500px]">
          
          {/* 🛠️ Fixed Animated Connecting Line */}
          <div className="hidden lg:block absolute top-[120px] left-[12%] right-[12%] h-[180px] pointer-events-none z-0">
            <svg width="100%" height="100%" viewBox="0 0 800 180" fill="none" preserveAspectRatio="none">
              <motion.path 
                d="M0,30 C150,30 250,130 400,130 S650,30 800,30" 
                stroke="url(#line-grad)" 
                strokeWidth="2.5" 
                strokeDasharray="12 12"
                fill="none"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F5A0" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00F5A0" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00D9F5" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={cn(
                "relative flex flex-col items-center text-center group",
                step.alignment
              )}
            >
              {/* Step Number Background - (Z-index Fix) */}
              <span className="absolute top-[-30px] text-[12rem] font-black text-white/[0.02] select-none pointer-events-none z-[-1] leading-none transition-all duration-700 group-hover:text-[#00F5A0]/5 group-hover:scale-110">
                {step.number}
              </span>

              {/* Icon Container */}
              <div className="relative z-10 w-32 h-32 rounded-[2.5rem] bg-[#0c0c14] border border-white/5 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl group-hover:border-[#00F5A0]/40 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5A0]/10 to-[#00D9F5]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                
                <div className="text-[#00F5A0] group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(0,245,160,0.3)]">
                  {step.icon}
                </div>

                {/* Counter Badge */}
                <div className="absolute -top-2 -right-2 w-9 h-9 rounded-xl bg-[#06060b] border border-white/10 flex items-center justify-center text-[#00F5A0] font-black text-xs shadow-xl z-20">
                  {step.number}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-[#00F5A0] transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/40 leading-relaxed font-medium max-w-[260px] group-hover:text-white/70 transition-colors">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}