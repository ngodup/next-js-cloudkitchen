import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/profile",
    "/dashboard",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

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

  if (
    !token &&
    (url.pathname.startsWith("/profile") ||
      url.pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to the home page regardless of authentication status
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}
