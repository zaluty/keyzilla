// 👉 Update the imports
import { ClerkMiddlewareAuth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

// 👉 Create a type to define the metadata
type UserMetadata = {
  isBetaUser?: boolean
}

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect()

    // 👉 Use `auth()` to get the sessionClaims, which includes the public metadata
    const { sessionClaims } = auth()
    const { isBetaUser } = sessionClaims?.metadata as UserMetadata
    if (isBetaUser === false) {
      // 👉 If the user is not a beta user, redirect them to the waitlist
      return NextResponse.redirect(new URL('/waitlist', req.url))
    } else {
      return NextResponse.next()
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}