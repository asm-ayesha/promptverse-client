import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient(process.env.MONGO_DB_URI);
// IMPORTANT: use the same database name the Express server reads from
// (promptverse-db) so the `user` and `session` collections are shared.
const db = client.db("promptverse-db");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  database: mongodbAdapter(db, { client }),
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
      subscription: { type: "string", defaultValue: "free", input: false },
      photoURL: { type: "string", required: false, input: true },
    },
  },
  // bearer enables token-based calls to the Express API;
  // nextCookies must be last so cookies are set on server actions.
  plugins: [bearer(), nextCookies()],
});
