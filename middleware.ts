import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log("Middleware - Current path:", url.pathname);
  console.log("Middleware - Token exists:", !!token);

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      console.log("Middleware - Redirecting to sign-in (admin)");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    token &&
    (url.pathname.startsWith("/auth/sign-in") ||
      url.pathname.startsWith("/auth/sign-up") ||
      url.pathname.startsWith("/auth/verify"))
  ) {
    console.log("Middleware - Redirecting to home (authenticated user)");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to sign-in
  if (
    !token &&
    (url.pathname.startsWith("/account") ||
      url.pathname.startsWith("/orders") ||
      url.pathname.startsWith("/checkout") ||
      url.pathname.startsWith("/comments") ||
      url.pathname.startsWith("/settings"))
  ) {
    console.log("Middleware - Redirecting to sign-in (unauthenticated)");
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/comments/:path*",
    "/settings/:path*",
  ],
};
