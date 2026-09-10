import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route paths that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/valuation-review",
  "/projects/new",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth cookie
  const authCookie = request.cookies.get("bhoomisetu_auth")?.value;
  let isAuthenticated = false;
  let userRole: string | null = null;

  if (authCookie) {
    try {
      const decoded = decodeURIComponent(authCookie);
      const session = JSON.parse(decoded);
      if (session?.user?.id && session?.user?.role && session?.expiresAt > Date.now()) {
        isAuthenticated = true;
        userRole = session.user.role;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Check if current route is protected
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Unauthenticated user trying to access protected route -> redirect to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based authorization
  if (isAuthenticated && userRole) {
    const ROLE_PROTECTIONS: Record<string, string[]> = {
      "/valuation-review": ["ministry", "state", "district"],
      "/projects/new": ["pia", "ministry"],
      "/dashboard/reports": ["ministry", "state"],
      "/dashboard/audit": ["ministry"],
    };

    for (const [route, allowedRoles] of Object.entries(ROLE_PROTECTIONS)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Authenticated user trying to access login page -> redirect to dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/valuation-review/:path*",
    "/projects/new",
    "/login",
  ],
};
