/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import { cookies } from "next/headers";

export interface ApplyRiderPayload {
  rider: {
    phone: string;
    district: string;
    region: string;
    vehicle: string;
  };
}

export interface RespondParcelPayload {
  parcelId: string;
  response: "ACCEPTED" | "CANCELLED";
}

export interface UpdateStatusPayload {
  parcelId: string;
  status: "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
}

export const riderService = {
  applyForRider: async (payload: ApplyRiderPayload) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/rider/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    return res.json();
  },

  respondParcel: async (payload: RespondParcelPayload) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/rider/respond-parcel`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    return res.json();
  },


  updateParcelStatus: async (payload: UpdateStatusPayload) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/rider/update-status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    return res.json();
  },

  getRiderDashboard: async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Cookie = `__Secure-better-auth.session_token=${token}`;
    }

    const res = await fetch(`${env.BACKEND_URL}/api/rider/dashboard`, {
      headers,
      next: { revalidate: 0 },
    });
    return res.json();
  },


  getAssignedParcels: async (query: Record<string, any>) => {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    const token =
      cookieStore.get("__Secure-better-auth.session_token")?.value ||
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("auth_session")?.value;

    const params = new URLSearchParams(query);
    const cookieName = isProduction ? "__Secure-better-auth.session_token" : "better-auth.session_token";

    const res = await fetch(`${env.BACKEND_URL}/api/rider/my-parcels?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": token ? `${cookieName}=${token}` : "",
      },
      cache: 'no-store',
    });

    return res.json();
  },

  createWithdrawRequest: async (payload: { amount: number; method: string; accountNumber: string }) => {
    const token = (await cookies()).get("auth_session")?.value;

    const res = await fetch(`${env.BACKEND_URL}/api/rider/withdraw-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `__Secure-better-auth.session_token=${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
