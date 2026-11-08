import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import AuthSession from "@/models/AuthSession";
import User from "@/models/User";

export const SESSION_COOKIE_NAME = "pixel_session";
const DEFAULT_SESSION_SECONDS = 24 * 60 * 60;
const REMEMBERED_SESSION_SECONDS = 30 * 24 * 60 * 60;

type CreatedSession = {
  token: string;
  expiresAt: Date;
};

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  rememberMe = false,
): Promise<CreatedSession> {
  await connectToDatabase();

  const token = randomBytes(32).toString("base64url");
  const duration = rememberMe
    ? REMEMBERED_SESSION_SECONDS
    : DEFAULT_SESSION_SECONDS;
  const expiresAt = new Date(Date.now() + duration * 1000);

  await AuthSession.create({
    tokenHash: hashSessionToken(token),
    userId,
    expiresAt,
  });

  return { token, expiresAt };
}

export function attachSessionCookie(
  response: NextResponse,
  session: CreatedSession,
): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });
  return response;
}

export async function revokeSession(token: string): Promise<void> {
  await connectToDatabase();
  await AuthSession.deleteOne({ tokenHash: hashSessionToken(token) });
}

/**
 * Server-only helper for protecting future route handlers and server pages.
 * Returns a minimal user object and never exposes the password hash.
 */
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  await connectToDatabase();
  const session = await AuthSession.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) return null;

  const user = await User.findById(session.userId)
    .select("_id name email")
    .lean();

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

/**
 * Reject cross-origin state-changing requests. Requests without an Origin
 * header remain usable by non-browser clients; browser requests are checked.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip") || "unknown";
}
