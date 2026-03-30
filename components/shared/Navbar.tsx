"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Track Parcel", href: "/track" },
  { label: "Services", href: "/services" },
  { label: "Coverage", href: "/coverage" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
          isScrolled
            ? "bg-[#06060b]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
            : "bg-transparent py-6 border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative z-[110]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00F5A0] to-[#00D9F5] shadow-lg shadow-[#00F5A0]/20 group-hover:rotate-[10deg] transition-all duration-300">
              <Zap size={24} className="text-[#06060b] fill-current" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase">
              Nexus<span className="bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] bg-clip-text text-transparent">Express</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[15px] font-bold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-all hover:translate-y-[-1px] tracking-wide",
                    isActive 
                      ? "text-[#00F5A0] underline underline-offset-8 decoration-2" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Link href="/sign-in">
              <span className={cn(
                "font-bold cursor-pointer transition-colors text-sm",
                pathname === "/sign-in" ? "text-[#00F5A0]" : "text-white hover:text-[#00F5A0]"
              )}>
                Sign In
              </span>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#06060b] font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#00F5A0]/10 px-7 h-11">
                Sign Up
              </Button>
            </Link>
          </div>

          <button className="lg:hidden relative z-[110] p-2.5 rounded-xl bg-white/5 border border-white/10 text-white active:scale-90" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      <div className={cn("fixed inset-0 z-[90] bg-[#06060b] transition-all duration-500 lg:hidden", mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none")}>
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#00F5A0]/10 blur-[100px] rounded-full" />
        <div className="flex flex-col h-full pt-32 px-8 pb-10">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-4">Navigation</p>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-5 border-b border-white/5 text-2xl font-black transition-all",
                    isActive ? "text-[#00F5A0]" : "text-white hover:text-[#00F5A0]"
                  )}
                >
                  {link.label}
                  <ChevronRight size={20} className={isActive ? "text-[#00F5A0]" : "text-white/20"} />
                </Link>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full h-16 font-bold border-white/10 text-white rounded-2xl text-lg bg-white/5">Sign In</Button>
            </Link>
            <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
              <Button className="w-full h-16 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#06060b] font-black rounded-2xl shadow-2xl text-lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}