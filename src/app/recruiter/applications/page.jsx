import { getUserSession } from "@/app/actions/auth"
import { getRecruiterApplications } from "@/app/actions/recruiter"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/recruiter/application-status-badge"
import { ApplicationStatusSelect } from "@/components/recruiter/application-status-select"

export default async function RecruiterApplications() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const applicationsResult = await getRecruiterApplications(session.userId)
  const applications = applicationsResult.success ? applicationsResult.data : []

  // Group applications by job
  const applicationsByJob = applications.reduce((acc, app) => {
    const jobId = app.job_id
    if (!acc[jobId]) {
      acc[jobId] = {
        jobTitle: app.job_title,
        applications: [],
      }
    }
    acc[jobId].applications.push(app)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Applications</h1>

      {applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications</CardTitle>
            <CardDescription>
              You haven't received any applications yet. Make sure your job postings are complete and attractive to
              candidates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/recruiter/jobs">View Your Job Postings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(applicationsByJob).map(([jobId, data]) => (
            <Card key={jobId}>
              <CardHeader>
                <CardTitle>{data.jobTitle}</CardTitle>
                <CardDescription>
                  {data.applications.length} application{data.applications.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.applications.map((application) => (
                    <div key={application.application_id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{application.applicant_name}</h3>
                          <p className="text-sm text-muted-foreground">{application.applicant_email}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">
                            Applied on {new Date(application.date_applied).toLocaleDateString()}
                          </span>
                          <ApplicationStatusBadge status={application.status} />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
                        <div className="flex space-x-2 mb-2 md:mb-0">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
