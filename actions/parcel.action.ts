// actions/parcel.action.ts
"use server";

import { parcelService } from "@/service/parcel.service";

export const getSenderStatsAction = async () => {
  const stats = await parcelService.getSenderStats();
  return stats || { total: 0, pending: 0, delivered: 0 };
};