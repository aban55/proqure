import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) =>
          res.cookies.set(name, value, options),
        remove: (name: string, options: any) =>
          res.cookies.set(name, "", options),
      },
    }
  );

  // Check authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes (accessible even if logged out)
  const publicPaths = ["/login", "/signup", "/"];
  const isPublic = publicPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  // Protected routes (must be logged in)
  const protectedPaths = ["/buyer", "/seller", "/admin"];
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// Tell Next.js which routes should pass through this middleware
export const config = {
  matcher: [
    "/buyer/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/api/rfq/:path*",   // REQUIRED for RFQ list + create + detail
    "/api/auth/:path*",  // REQUIRED for SSR user debug + auth checks
    "/login",
    "/signup",
  ],
};
