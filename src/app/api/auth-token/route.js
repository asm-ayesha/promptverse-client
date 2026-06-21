import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Returns the current session's raw token by reading the better-auth cookie
// server-side. This lets the client capture a bearer token even for flows
// that don't run the auth-client onSuccess hook (e.g. Google OAuth redirect).
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.session?.token) {
      return NextResponse.json({ token: null }, { status: 401 });
    }
    return NextResponse.json({ token: session.session.token });
  } catch (_) {
    return NextResponse.json({ token: null }, { status: 500 });
  }
}
