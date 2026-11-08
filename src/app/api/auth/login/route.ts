import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/password.mjs";
import {
  attachSessionCookie,
  createSession,
  getRequestIp,
  isSameOriginRequest,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rateLimitKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as
    | { email?: unknown; password?: unknown; rememberMe?: unknown }
    | null;

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const rememberMe = body?.rememberMe === true;

  if (email.length > 254 || !EMAIL_PATTERN.test(email) || password.length < 1 || password.length > 128) {
    return NextResponse.json(
      { error: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  try {
    const ip = getRequestIp(request);
    const [emailLimit, ipLimit] = await Promise.all([
      checkRateLimit(rateLimitKey(`email:${email}`), 8),
      checkRateLimit(rateLimitKey(`ip:${ip}`), 30),
    ]);

    if (!emailLimit.allowed || !ipLimit.allowed) {
      const retryAfter = Math.max(
        emailLimit.retryAfterSeconds,
        ipLimit.retryAfterSeconds,
      );
      const response = NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
      response.headers.set("Retry-After", String(retryAfter));
      return response;
    }

    await connectToDatabase();
    const user = await User.findOne({ email }).select("+passwordHash");
    const passwordIsValid = user
      ? await verifyPassword(password, user.passwordHash)
      : (await hashPassword(password), false);

    if (!user || !passwordIsValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const session = await createSession(user._id.toString(), rememberMe);
    const response = NextResponse.json({
      message: "You are now signed in.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    return attachSessionCookie(response, session);
  } catch (error) {
    console.error("Login request failed.");
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 },
    );
  }
}
