import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    return NextResponse.json(
      { user },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to verify the current session." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
