import { getUserSession } from "@/app/actions/auth"
import { getJobSeekerApplications } from "@/app/actions/job-seeker-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/job-seeker/application-status-badge"

export default async function JobSeekerApplications() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const applicationsResult = await getJobSeekerApplications(session.userId)
  const applications = applicationsResult.success ? applicationsResult.data : []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Applications</h1>

      {applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications</CardTitle>
            <CardDescription>You haven't applied to any jobs yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/job-seeker/jobs">Find Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.application_id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <CardTitle>{application.job_title}</CardTitle>
                    <CardDescription>{application.company_name}</CardDescription>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">{application.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Job Type</h3>
                      <p className="text-sm text-muted-foreground">{application.job_type || "Full-time"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Applied On</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.date_applied).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" asChild>
                      <Link href={`/job-seeker/jobs/${application.job_id}`}>View Job Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
