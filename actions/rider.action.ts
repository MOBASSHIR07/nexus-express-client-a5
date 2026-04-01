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
