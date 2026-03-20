import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define public routes (anyone can see these)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/pending-approval'
]);

// 2. Define admin-only routes
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If the user isn't logged in and tries to access a private route
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }

  // If logged in, grab the metadata from session claims
  // Ensure your Clerk Dashboard is configured to include 'metadata' in the JWT session tokens
  const metadata = sessionClaims?.metadata as { role?: string; approved?: boolean } | undefined;

  // 3. Admin Protection: Redirect non-admins away from /admin
  if (isAdminRoute(req) && metadata?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 4. Approval Protection: Redirect unapproved users to the pending page
  // We skip this check if they are already on the pending page
  // Admins bypass this check entirely
  if (
    userId && 
    !isPublicRoute(req) && 
    metadata?.role !== 'admin' && 
    !metadata?.approved
  ) {
    return NextResponse.redirect(new URL('/pending-approval', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};