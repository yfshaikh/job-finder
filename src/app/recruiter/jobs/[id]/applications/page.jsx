import { getUserSession } from "@/app/actions/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ApplicationStatusBadge } from "@/components/recruiter/application-status-badge"
import { ApplicationStatusSelect } from "@/components/recruiter/application-status-select"
import { getJobApplications } from "@/app/actions/recruiter-dashboard"
import { getJobDetails } from "@/app/actions/job-actions"


export default async function JobApplicationsPage({ params }) {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const jobResult = await getJobDetails(params.id)
  const applicationsResult = await getJobApplications(params.id)

  if (!jobResult.success) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Job Not Found</h1>
        <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>
    )
  }

  const job = jobResult.data
  const applications = applicationsResult.success ? applicationsResult.data : []

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Applications for {job.job_title}</h1>
        <p className="text-muted-foreground mt-2">
          {applications.length} application{applications.length !== 1 ? "s" : ""} received
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications</CardTitle>
            <CardDescription>
              This job posting hasn't received any applications yet. Check back later or consider promoting your job
              posting.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.application_id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <CardTitle>{application.name}</CardTitle>
                    <CardDescription>{application.email}</CardDescription>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.phone && (
                      <div>
                        <h3 className="text-sm font-medium">Phone</h3>
                        <p className="text-sm text-muted-foreground">{application.phone}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium">Applied On</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.date_applied).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t">
                    <div className="flex space-x-2 mb-4 md:mb-0">
                      {application.resume_link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.resume_link} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/recruiter/applications/${application.application_id}`}>View Details</Link>
                      </Button>
                    </div>

                    <ApplicationStatusSelect
                      applicationId={application.application_id.toString()}
                      currentStatus={application.status}
                    />
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
