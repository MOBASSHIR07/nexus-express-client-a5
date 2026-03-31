"use server";

import { parcelService } from "@/service/parcel.service";
import { revalidatePath } from "next/cache";


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

export const createParcelAction = async (values: CreateParcelInput) => {
  try {
    const res = await parcelService.createParcel(values);

  
    if (res.success) {
    
      revalidatePath("/sender-dashboard/my-parcels");
      revalidatePath("/sender-dashboard");

      return { 
        success: true, 
        data: res.data, 
        message: res.message 
      };
    }

    return { 
      success: false, 
      message: res.message || "Failed to initialize shipment protocol." 
    };

  } catch (error) {
    console.error("NEXUS_DISPATCH_ERROR:", error);
    return { 
      success: false, 
      message: "Neural Link Failure: Could not connect to backend server." 
    };
  }
};