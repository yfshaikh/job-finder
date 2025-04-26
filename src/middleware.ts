import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userType = request.cookies.get("user_type")?.value
  const userId = request.cookies.get("user_id")?.value

  // Check if user is authenticated
  const isAuthenticated = userType && userId

  // Protected routes
  const isJobSeekerRoute = request.nextUrl.pathname.startsWith("/job-seeker")
  const isRecruiterRoute = request.nextUrl.pathname.startsWith("/recruiter")

  // Redirect logic
  if (!isAuthenticated && (isJobSeekerRoute || isRecruiterRoute)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isAuthenticated) {
    // Redirect job seekers trying to access recruiter routes
    if (userType === "job_seeker" && isRecruiterRoute) {
      return NextResponse.redirect(new URL("/job-seeker/dashboard", request.url))
    }

    // Redirect recruiters trying to access job seeker routes
    if (userType === "recruiter" && isJobSeekerRoute) {
      return NextResponse.redirect(new URL("/recruiter/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/job-seeker/:path*", "/recruiter/:path*"],
}
