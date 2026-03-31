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

  getMyParcels: async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const res = await fetch(`${BACKEND_URL}/api/parcel/my-parcels`, {
      headers: {
        Cookie: `__Secure-better-auth.session_token=${token}`,
      },
      cache: "no-store",
    });
    return res.json();
  },
};