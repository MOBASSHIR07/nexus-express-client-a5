import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    const cookieName = isProduction
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token";

    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 604800, // 7 days
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Set Session Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
