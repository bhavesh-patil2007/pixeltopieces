import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password.mjs";
import {
  attachSessionCookie,
  createSession,
  isSameOriginRequest,
} from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as
    | { name?: unknown; email?: unknown; password?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json(
      { error: "Name must be between 2 and 100 characters." },
      { status: 400 },
    );
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 10 || password.length > 128) {
    return NextResponse.json(
      { error: "Password must be between 10 and 128 characters." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const session = await createSession(user._id.toString(), true);

    const response = NextResponse.json(
      {
        message: "Your account has been created.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );

    return attachSessionCookie(response, session);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    console.error("Registration request failed.");
    return NextResponse.json(
      { error: "Unable to create your account right now. Please try again." },
      { status: 500 },
    );
  }
}
