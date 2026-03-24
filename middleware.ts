import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/pending-approval',
  '/' // Added root if it's a landing page
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // 1. Force Sign-in for private routes
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn();
  }

  // Cast metadata for TypeScript safety
  const metadata = sessionClaims?.metadata as { role?: string; approved?: boolean } | undefined;

  // 2. Admin Protection: Redirect non-admins away from /admin
  if (isAdminRoute(req) && metadata?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Approval Protection: Redirect unapproved users (unless they are Admin)
  const isApproved = metadata?.approved === true;
  const isAdmin = metadata?.role === 'admin';

  if (userId && !isPublicRoute(req) && !isAdmin && !isApproved) {
    return NextResponse.redirect(new URL('/pending-approval', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};