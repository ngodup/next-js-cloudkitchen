import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // Redirect to home page if the user is already authenticated
  // and trying to access sign-in or sign-up pages
  if (
    token &&
    (url.pathname.startsWith("/auth/sign-in") ||
      url.pathname.startsWith("/auth/sign-up") ||
      url.pathname.startsWith("/auth/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to sign-in page if the user is not authenticated
  // and trying to access account, orders, checkout, settings, or admin pages
  if (
    (!token &&
      (url.pathname.startsWith("/account") ||
        url.pathname.startsWith("/orders") ||
        url.pathname.startsWith("/checkout") ||
        url.pathname.startsWith("/comments"))) ||
    url.pathname.startsWith("/settings")
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/settings/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
