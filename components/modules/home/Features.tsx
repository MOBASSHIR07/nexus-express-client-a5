"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Truck, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description: "আমাদের এক্সপ্রেস ডেলিভারি সিস্টেমে আপনার পার্সেল পৌঁছাবে ২৪ ঘণ্টার মধ্যে।",
    icon: <Zap size={32} />,
    color: "from-[#00F5A0] to-[#00D9F5]",
  },
  {
    title: "Secure Handling",
    description: "প্রতিটি পার্সেল আমাদের কাছে আমানত। উন্নত প্যাকিং এবং সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।",
    icon: <ShieldCheck size={32} />,
    color: "from-[#F5A000] to-[#F5D900]",
  },
  {
    title: "Wide Coverage",
    description: "গ্রাম থেকে শহর — বাংলাদেশের ৬৪টি জেলাতেই আমাদের ডেলিভারি নেটওয়ার্ক বিস্তৃত।",
    icon: <Truck size={32} />,
    color: "from-[#D9F500] to-[#00F5A0]",
  },
];

export default function Features() {
  return (
    <section id="services" className="relative py-24 bg-[#06060b] overflow-hidden">
      {/* 🛠️ Canva Style Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter"
          >
            Why Choose <span className="text-[#00F5A0]">Nexus Express?</span>
          </motion.h2>
          <p className="mt-4 text-white/40 font-medium max-w-xl mx-auto">
            আমরা শুধু পার্সেল না, আপনার ভরসা পৌঁছে দেই সঠিক সময়ে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-[#00F5A0]/30 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F5A0]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br text-[#06060b] shadow-lg",
                feature.color
              )}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                {feature.title}
              </h3>
              
              <p className="text-white/40 leading-relaxed font-medium mb-8">
                {feature.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-black text-white group-hover:text-[#00F5A0] transition-colors uppercase tracking-widest">
                Learn More <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function (যদি আগে না থাকে)
function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(" ");
}