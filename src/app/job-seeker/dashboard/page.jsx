import { getUserSession } from "@/app/actions/auth"

import { getJobSeekerProfile } from "@/app/actions/job-seeker-profile"
import { getJobSeekerApplications } from "@/app/actions/job-seeker-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Briefcase, AlertCircle } from "lucide-react"
import { ApplicationStatusBadge } from "@/components/job-seeker/application-status-badge"

export default async function JobSeekerDashboard() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const profileResult = await getJobSeekerProfile(session.userId)
  const applicationsResult = await getJobSeekerApplications(session.userId)

  const profile = profileResult.success ? profileResult.data : null
  const applications = applicationsResult.success ? applicationsResult.data : []

  // Calculate profile completion percentage
  const profileFields = profile
    ? Object.entries(profile).filter(
        ([key, value]) =>
          !["job_seeker_id", "password", "profile_created", "profile_completed"].includes(key) &&
          value &&
          (Array.isArray(value) ? value.length > 0 : true),
      ).length
    : 0

  const totalProfileFields = 8 // name, email, phone, resume_link, skills, education, experience, introduction/about
  const profileCompletion = Math.round((profileFields / totalProfileFields) * 100)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Seeker Dashboard</h1>

      {profileCompletion < 100 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your profile is {profileCompletion}% complete.
                <Link href="/job-seeker/profile" className="font-medium underline ml-1">
                  Complete your profile
                </Link>{" "}
                to increase your chances of getting hired.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Total job applications</p>
          </CardContent>
          <CardFooter>
            <Link href="/job-seeker/applications" className="text-sm text-blue-600 hover:underline">
              View all applications
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Browse Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Search and apply to jobs that match your interests and skills.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/job-seeker/jobs">Browse all jobs</Link>
            </Button>
          </CardFooter>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${profileCompletion}%` }} />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/job-seeker/profile" className="text-sm text-blue-600 hover:underline">
              Complete your profile
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your most recent job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <ul className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <li key={application.application_id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="font-medium">{application.job_title}</div>
                    <div className="text-sm text-muted-foreground">{application.company_name}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-muted-foreground">
                        Applied on {new Date(application.date_applied).toLocaleDateString()}
                      </div>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/job-seeker/jobs">Find Jobs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
