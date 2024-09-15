import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

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
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to sign-in page if the user is not authenticated
  // and trying to access account, orders, checkout, settings, or admin pages
  if (
    !token &&
    (url.pathname.startsWith("/account") ||
      url.pathname.startsWith("/orders") ||
      url.pathname.startsWith("/checkout") ||
      url.pathname.startsWith("/settings"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to the home page regardless of authentication status
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/account",
    "/chekout",
    "/settings",
    "/orders",
    "/admin/:path*",
  ],
};
