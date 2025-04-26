import { getUserSession } from "@/app/actions/auth"
import { getRecruiterProfile, getRecruiterJobs, getRecruiterApplications } from "@/app/actions/recruiter"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, FileText, AlertCircle } from "lucide-react"

export default async function RecruiterDashboard() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const profileResult = await getRecruiterProfile(session.userId)
  const jobsResult = await getRecruiterJobs(session.userId)
  const applicationsResult = await getRecruiterApplications(session.userId)

  const profile = profileResult.success ? profileResult.data : null
  const jobs = jobsResult.success ? jobsResult.data : []
  const applications = applicationsResult.success ? applicationsResult.data : []

  // Calculate profile completion percentage
  const profileFields = profile
    ? Object.entries(profile).filter(
        ([key, value]) => !["recruiter_id", "password", "profile_created"].includes(key) && value,
      ).length
    : 0

  const totalProfileFields = 7 // name, email, phone, company_name, company_description, company_website, company_location
  const profileCompletion = Math.round((profileFields / totalProfileFields) * 100)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>

      {profileCompletion < 100 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your profile is {profileCompletion}% complete.
                <Link href="/recruiter/profile" className="font-medium underline ml-1">
                  Complete your profile
                </Link>{" "}
                to attract more job seekers.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">Active job postings in your account</p>
          </CardContent>
          <CardFooter>
            <Link href="/recruiter/jobs" className="text-sm text-blue-600 hover:underline">
              View all jobs
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Applications received for your job postings</p>
          </CardContent>
          <CardFooter>
            <Link href="/recruiter/applications" className="text-sm text-blue-600 hover:underline">
              View all applications
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${profileCompletion}%` }} />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/recruiter/profile" className="text-sm text-blue-600 hover:underline">
              Complete your profile
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Your most recently posted jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length > 0 ? (
              <ul className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <li key={job.job_id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="font-medium">{job.job_title}</div>
                    <div className="text-sm text-muted-foreground">{job.location}</div>
                    <div className="text-sm text-muted-foreground">
                      Posted on {new Date(job.date_posted).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/recruiter/jobs/new">Post a New Job</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applications to your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <ul className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <li key={application.application_id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="font-medium">{application.applicant_name}</div>
                    <div className="text-sm">Applied for: {application.job_title}</div>
                    <div className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span
                        className={
                          application.status === "Pending"
                            ? "text-yellow-600"
                            : application.status === "Rejected"
                              ? "text-red-600"
                              : application.status === "Shortlisted"
                                ? "text-blue-600"
                                : application.status === "Hired"
                                  ? "text-green-600"
                                  : ""
                        }
                      >
                        {application.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Applied on {new Date(application.date_applied).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You haven't received any applications yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/recruiter/applications" className="text-sm text-blue-600 hover:underline">
              View all applications
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
