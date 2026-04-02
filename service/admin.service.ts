import { env } from "@/env";
import { cookies } from "next/headers";

export const adminService = {
 
  getAllRiders: async () => {
    const token = (await cookies()).get("auth_session")?.value;
    const res = await fetch(`${env.BACKEND_URL}/api/admin/riders`, {
      headers: { Cookie: `__Secure-better-auth.session_token=${token}` },
      next: { revalidate: 0 } 
    });
    return res.json();
  },

 
  approveRider: async (riderId: string) => {
    const token = (await cookies()).get("auth_session")?.value;
    const res = await fetch(`${env.BACKEND_URL}/api/admin/approve-rider/${riderId}`, {
      method: "PATCH",
      headers: { Cookie: `__Secure-better-auth.session_token=${token}` }
    });
    return res.json();
  }
};