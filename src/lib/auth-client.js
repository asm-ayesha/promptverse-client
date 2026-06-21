"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const BEARER_TOKEN_KEY = "promptverse-bearer-token";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        subscription: { type: "string" },
        photoURL: { type: "string" },
      },
    }),
  ],
  fetchOptions: {
    // Capture the bearer token returned by better-auth so we can call the
    // separate Express API with Authorization: Bearer <token>.
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken) {
        try {
          localStorage.setItem(BEARER_TOKEN_KEY, authToken);
        } catch (_) {
          /* ignore storage errors */
        }
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
