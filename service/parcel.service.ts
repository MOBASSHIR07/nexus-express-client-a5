// service/parcel.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const BACKEND_URL = env.BACKEND_URL;

export const parcelService = {
  getSenderStats: async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_session")?.value;
      const cookieString = `__Secure-better-auth.session_token=${token}`;

      const res = await fetch(`${BACKEND_URL}/api/parcels/sender-stats`, {
        method: "GET",
        headers: { Cookie: cookieString },
        cache: "no-store",
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};