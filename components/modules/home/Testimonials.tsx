"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Sadman Sakib",
    role: "Merchant, Dhaka",
    image: "https://i.pravatar.cc/150?u=1",
    review: "The service from Nexus Express is simply outstanding. Their tracking system is incredibly accurate and reliable.",
    stars: 5
  },
  {
    name: "Raisa Islam",
    role: "Online Entrepreneur",
    image: "https://i.pravatar.cc/150?u=2",
    review: "Sending parcels from Bogura to Dhaka is now completely worry-free. The riders are extremely professional.",
    stars: 5
  },
  {
    name: "Ariful Hoque",
    role: "Regular Customer",
    image: "https://i.pravatar.cc/150?u=3",
    review: "Super fast delivery! I received my parcel within 24 hours. Highly recommended for anyone who needs reliable shipping!",
    stars: 4
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-[#06060b] overflow-hidden">
      {/* Background Grid - Consistency */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black tracking-[0.4em] text-[#00F5A0] uppercase mb-4"
          >
            Testimonials
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            What Our <span className="italic bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">Clients Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#00F5A0]/20 transition-all duration-500 backdrop-blur-xl group"
            >
              <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-[#00F5A0]/10 transition-colors" size={60} />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#00F5A0]/20">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{item.name}</h4>
                  <p className="text-xs text-white/30 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#00F5A0] text-[#00F5A0]" />
                ))}
              </div>

{/* ✅ Escaped Quotes for Linter Safety */}
              <p className="text-white/60 leading-relaxed italic font-medium">
                &ldquo;{item.review}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

