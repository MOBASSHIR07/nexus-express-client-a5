import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
 
  baseURL: "https://nexus-express-server-a5.onrender.com", 
  fetchOptions: {
    credentials: "include",
  },
});