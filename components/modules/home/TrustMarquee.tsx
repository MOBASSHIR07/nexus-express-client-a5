"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Clock, Globe, Zap } from "lucide-react";

const trustFeatures = [
  { icon: <ShieldCheck size={20} />, text: "Secure Payments" },
  { icon: <Truck size={20} />, text: "Fastest Delivery" },
  { icon: <Clock size={20} />, text: "24/7 Support" },
  { icon: <Globe size={20} />, text: "64 Districts Coverage" },
  { icon: <Zap size={20} />, text: "Real-time Tracking" },
];

export default function TrustMarquee() {
  return (
    <div className="relative w-full py-10 bg-[#06060b] overflow-hidden border-y border-white/5">
      {/* Subtle Glow behind marquee */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00F5A0]/5 to-transparent pointer-events-none" />

      <div className="flex overflow-hidden">
        {/* We duplicate the content to make it seamless */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex flex-nowrap shrink-0 items-center gap-16 pr-16"
        >
          {[...trustFeatures, ...trustFeatures].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 shrink-0 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F5A0] group-hover:scale-110 group-hover:bg-[#00F5A0] group-hover:text-[#06060b] transition-all duration-300">
                {item.icon}
              </div>
              <span className="text-sm md:text-base font-black text-white/40 group-hover:text-white uppercase tracking-widest transition-colors">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}