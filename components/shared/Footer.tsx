"use client";

import { Send, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-12 bg-[#06060b] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-[900] text-white tracking-tighter uppercase">
              NEXUS <span className="text-[#00F5A0]">EXPRESS</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Delivering fast, reliable, and secure parcels to every corner of Bangladesh — that's our only mission. Your trust is our greatest motivation.
            </p>
            
            <div className="flex gap-4">
              {/* Facebook */}
              <Link href="#" className="text-white/40 hover:text-[#00F5A0] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              {/* Twitter (X) */}
              <Link href="#" className="text-white/40 hover:text-[#00F5A0] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
              {/* LinkedIn */}
              <Link href="#" className="text-white/40 hover:text-[#00F5A0] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.771-.773 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z"/></svg>
              </Link>
              {/* Github */}
              <Link href="#" className="text-white/40 hover:text-[#00F5A0] transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm text-white/40 font-bold">
              <li><Link href="#hero" className="hover:text-[#00F5A0] transition-colors">Home</Link></li>
              <li><Link href="#services" className="hover:text-[#00F5A0] transition-colors">Our Services</Link></li>
              <li><Link href="#how" className="hover:text-[#00F5A0] transition-colors">How It Works</Link></li>
              <li><Link href="#coverage" className="hover:text-[#00F5A0] transition-colors">Coverage Area</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-5 text-sm text-white/40 font-bold">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#00F5A0] shrink-0" />
                <span>Bogura Sadar, Rajshahi Division, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#00F5A0] shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#00F5A0] shrink-0" />
                <span>support@nexusexpress.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Stay Updated</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full h-14 pl-5 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-[#00F5A0]/50 transition-all font-medium"
                suppressHydrationWarning
              />
              <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] flex items-center justify-center text-[#06060b]">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <p>© {currentYear} NEXUS EXPRESS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-[#00F5A0] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}