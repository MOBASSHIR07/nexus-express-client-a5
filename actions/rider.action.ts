/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { riderService, ApplyRiderPayload, RespondParcelPayload, UpdateStatusPayload } from "@/service/rider.service";

export const applyForRiderAction = async (payload: ApplyRiderPayload) => {
  try {
    const response = await riderService.applyForRider(payload);
    return response;
  } catch (error) {
    console.error("RIDER_APPLICATION_ERROR:", error);
    return { success: false, message: "Unable to submit rider application." };
  }
};

export const getRiderDashboardAction = async () => {
  try {
    const response = await riderService.getRiderDashboard();
    return response;
  } catch (error) {
    console.error("RIDER_DASHBOARD_ERROR:", error);
    return { success: false, message: "Unable to load rider dashboard." };
  }
};

export const respondParcelAction = async (formData: FormData) => {
  const parcelId = formData.get("parcelId")?.toString();
  const response = formData.get("response")?.toString();

  if (!parcelId || !response) {
    return { success: false, message: "Missing parcel id or response." };
  }

  try {
    const result = await riderService.respondParcel({ parcelId, response: response as RespondParcelPayload["response"] });
    if (result?.success) {
      revalidatePath("/rider-dashboard/assigned-parcels");
      revalidatePath("/rider-dashboard/active-deliveries");
    }
    return result;
  } catch (error) {
    console.error("RIDER_RESPOND_ERROR:", error);
    return { success: false, message: "Unable to submit parcel response." };
  }
};

export const updateParcelStatusAction = async (formData: FormData) => {
  const parcelId = formData.get("parcelId")?.toString();
  const status = formData.get("status")?.toString();

  if (!parcelId || !status) {
    return { success: false, message: "Missing parcel id or status." };
  }

  try {
    const result = await riderService.updateParcelStatus({ parcelId, status: status as UpdateStatusPayload["status"] });
    if (result?.success) {
      revalidatePath("/rider-dashboard/active-deliveries");
    }
    return result;
  } catch (error) {
    console.error("RIDER_UPDATE_STATUS_ERROR:", error);
    return { success: false, message: "Unable to update parcel status." };
  }
};



export const createWithdrawAction = async (formData: FormData) => {
  const amount = Number(formData.get("amount"));
  const method = formData.get("method") as string;
  const accountNumber = formData.get("accountNumber") as string;

  if (!amount || !method || !accountNumber) {
    return { success: false, message: "All fields are required." };
  }

  try {
    const res = await riderService.createWithdrawRequest({ amount, method, accountNumber });
    if (res.success) {
      revalidatePath("/rider-dashboard");
      revalidatePath("/rider-dashboard/withdraw");
      return { success: true, message: "Withdraw request transmitted." };
    }
    return { success: false, message: res.message || "Request failed." };
  } catch (error) {
    return { success: false, message: "Nexus Network Error." };
  }
};





export const getMyParcelsAction = async (query: Record<string, any>) => {
  try {
   
    const result = await riderService.getAssignedParcels(query);
    
  
    console.log("RIDER_PARCEL_DATA:", result); 
    
    return result;
  } catch (error) {
    console.error("RIDER_PARCEL_FETCH_ERROR:", error);
    return { success: false, data: [], message: "Network Error" };
  }
};
