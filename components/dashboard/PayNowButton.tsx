"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { createPaymentSessionAction } from "@/actions/parcel.action";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PayNowButton({ parcelId, price }: { parcelId: string; price: any }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const result = await createPaymentSessionAction(parcelId);

    if (result.success && result.data?.paymentUrl) {
      toast.success("Redirecting to Secure Gateway...");
      window.location.href = result.data.paymentUrl;
    } else {
      toast.error(result.message || "Payment initialization failed.");
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePay}
      disabled={loading}
      className="h-12 bg-white text-[#06060b] hover:bg-[#00F5A0] font-black text-[10px] uppercase rounded-2xl px-6 transition-all shadow-lg"
    >
      {loading ? <Loader2 className="animate-spin" size={14} /> : <><CreditCard size={14} className="mr-2" /> Pay Now (${price})</>}
    </Button>
  );
}
