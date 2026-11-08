import { NextRequest, NextResponse } from "next/server";
import {
  isSameOriginRequest,
  revokeSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    try {
      await revokeSession(token);
    } catch {
      // Always clear the browser cookie, even if the database is unavailable.
    }
  }

  const response = NextResponse.json({ message: "You have been signed out." });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
