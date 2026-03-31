"use client";

import Link from "next/link";
import { XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-red-500/20 rounded-[3rem] p-10 text-center space-y-8 backdrop-blur-xl">
        
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-red-500 blur-3xl opacity-10" />
          <XCircle className="relative w-full h-full text-red-500" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            Transfer <span className="text-red-500">Aborted.</span>
          </h1>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            Payment Link Terminated by User
          </p>
        </div>

        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-left text-red-200/70 text-xs leading-relaxed">
          <AlertCircle size={20} className="shrink-0" />
          <p>Donot worry! Your parcel details are saved as UNPAID. You can retry payment from your dashboard anytime.</p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link href="/sender-dashboard/book-parcel" className="w-full">
            <Button className="w-full h-14 bg-white text-[#06060b] hover:bg-gray-200 font-bold rounded-2xl gap-2">
              <RefreshCw size={18} /> RETRY BOOKING
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}