import { auth0 } from "@/lib/auth0"

/**
 * Mounts Auth0 routes: /auth/login, /auth/logout, /auth/callback, /auth/profile.
 * API routes handle their own auth via session in lib/auth/context.ts.
 */
export async function proxy(request: Request) {
  return auth0.middleware(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
