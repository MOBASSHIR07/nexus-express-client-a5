/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import { cookies } from "next/headers";
import { ParcelCategory } from "@/types/parcel"; 

const BACKEND_URL = env.BACKEND_URL;


export interface CreateParcelInput {
  parcel: {
    title: string;
    category: "PARCEL" | "CARGO";
    weight: number;
    pickupAddress: string;
  };
  receiver: {
    name: string;
    phone: string;
    address: string;
  };
  price: number; 
}

export const parcelService = {

  createParcel: async (parcelData: CreateParcelInput) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const res = await fetch(`${BACKEND_URL}/api/parcel/create-parcel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `__Secure-better-auth.session_token=${token}`,
      },
      body: JSON.stringify(parcelData),
    });
    return res.json();
  },

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// getMyParcels: async (query: Record<string, any>) => {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("auth_session")?.value;

//     const params = new URLSearchParams(query);

//     const res = await fetch(`${env.BACKEND_URL}/api/parcel/my-parcels?${params.toString()}`, {
//       headers: {
//         Cookie: `__Secure-better-auth.session_token=${token}`,
//       },
//       next: { revalidate: 0 }
//     });
//     return res.json();
//   },


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMyParcels: async (query: Record<string, any>) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    const params = new URLSearchParams(query);

    const res = await fetch(`${env.BACKEND_URL}/api/parcel/my-parcels?${params.toString()}`, {
      headers: {
        Cookie: `__Secure-better-auth.session_token=${token}`,
      },
      next: { revalidate: 0 }
    });
    return res.json();
  },
 

  createPaymentSession: async (parcelId: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    const payload = JSON.stringify({ parcelId });

    const attemptPayment = async (url: string) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `__Secure-better-auth.session_token=${token}`,
        },
        body: payload,
      });

      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, data };
    };

    const primary = await attemptPayment(`${env.BACKEND_URL}/api/payment/create-checkout-session`);
    if (primary.ok && primary.data?.success) {
      return primary.data;
    }

    const fallback = await attemptPayment(`${env.BACKEND_URL}/api/pay/create-payment`);
    return fallback.data || primary.data || { success: false, message: "Unable to initialize payment." };
  },

  trackParcel: async (trackingCode: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    const encodedCode = encodeURIComponent(trackingCode.trim());

    const headers: Record<string, string> = {};
    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/parcel/track/${encodedCode}`, {
      headers,
      next: { revalidate: 0 },
    });
    return res.json();
  },

 
  getPaymentHistory: async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/pay/my-history`, {
      headers,
      next: { revalidate: 60 },
    });
    return res.json();
  }
};