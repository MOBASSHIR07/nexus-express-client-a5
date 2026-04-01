"use server";

import { riderService, ApplyRiderPayload } from "@/service/rider.service";

export const applyForRiderAction = async (payload: ApplyRiderPayload) => {
  try {
    const response = await riderService.applyForRider(payload);
    return response;
  } catch (error) {
    console.error("RIDER_APPLICATION_ERROR:", error);
    return { success: false, message: "Unable to submit rider application." };
  }
};
