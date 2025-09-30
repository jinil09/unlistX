import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = request.cookies.get("admin_session")

    // If not authenticated, redirect to login
    if (!adminSession || adminSession.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Check for admin subdomain
  const hostname = request.headers.get("host") || ""
  if (hostname.startsWith("admin.")) {
    // If on admin subdomain and not logged in, redirect to login
    const adminSession = request.cookies.get("admin_session")
    if (!adminSession && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    // If on admin subdomain, rewrite to admin routes
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
