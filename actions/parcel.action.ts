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



// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getMyParcelsAction = async (query: Record<string, any>) => {
//   try {
//     const res = await parcelService.getMyParcels(query);
//     if (res.success) {
//       return { 
//         success: true, 
//         data: res.data, 
//         meta: res.meta 
//       };
//     }
//     return { success: false, message: res.message };
//   } catch (error) {
//     return { success: false, message: "Network Error" };
//   }
// };




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMyParcelsAction = async (query: Record<string, any>) => {
  try {
    const res = await parcelService.getMyParcels(query);
    return res;
  } catch (error) {
    return { success: false, message: "Failed to connect to Neural Link." };
  }
};

export const createPaymentSessionAction = async (parcelId: string) => {
  try {
    const res = await parcelService.createPaymentSession(parcelId);
    return res;
  } catch (error) {
    return { success: false, message: "Payment Gateway Error." };
  }
};

export const getPaymentHistoryAction = async () => {
  try {
    const res = await parcelService.getPaymentHistory();
    return res;
  } catch (error) {
    return { success: false, message: "Failed to load payment history.", data: [] };
  }
};

export const trackParcelAction = async (trackingCode: string) => {
  try {
    const res = await parcelService.trackParcel(trackingCode);
    return res;
  } catch (error) {
    return { success: false, message: "Tracking System Offline." };
  }
};