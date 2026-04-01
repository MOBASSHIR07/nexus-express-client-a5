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

export const getRiderDashboardAction = async () => {
  try {
    const response = await riderService.getRiderDashboard();
    return response;
  } catch (error) {
    console.error("RIDER_DASHBOARD_ERROR:", error);
    return { success: false, message: "Unable to load rider dashboard." };
  }
};
