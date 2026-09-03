import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = form.get("password");

  if (typeof password !== "string" || password !== process.env.AUTH_PASSWORD) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const from = form.get("from");
  const redirectTo = typeof from === "string" && from.startsWith("/") ? from : "/";
  const res = NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}
