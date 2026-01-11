import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and login page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api/public") ||
    pathname === "/login" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;
  const verifiedToken = token && (await verifyToken(token));

  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
