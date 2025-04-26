import { getUserSession } from "@/app/actions/auth"
import { getRecruiterJobs } from "@/app/actions/recruiter"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import { JobDeleteButton } from "@/components/recruiter/job-delete-button"

export default async function RecruiterJobs() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const jobsResult = await getRecruiterJobs(session.userId)
  const jobs = jobsResult.success ? jobsResult.data : []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Postings</h1>
        <Button asChild>
          <Link href="/recruiter/jobs/new">
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Job Postings</CardTitle>
            <CardDescription>
              You haven't posted any jobs yet. Create your first job posting to start receiving applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/recruiter/jobs/new">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Job Posting
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.job_id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.job_title}</CardTitle>
                    <CardDescription className="mt-1">
                      {job.location} • {job.job_type || "Full-time"} • Posted on{" "}
                      {new Date(job.date_posted).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {/* <Button variant="outline" size="sm" asChild>
                      <Link href={`/recruiter/jobs/${job.job_id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button> */}
                    <JobDeleteButton jobId={job.job_id.toString()} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Salary Range</h3>
                    <p className="text-sm text-muted-foreground">{job.salary_range || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Experience Level</h3>
                    <p className="text-sm text-muted-foreground">{job.experience_level || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{job.job_description}</p>
                  </div>

                  <div className="flex justify-between pt-2">
                    {/* <Button variant="outline" asChild>
                      <Link href={`/recruiter/jobs/${job.job_id}`}>View Details</Link>
                    </Button> */}
                    <Button variant="secondary" asChild>
                      <Link href={`/recruiter/jobs/${job.job_id}/applications`}>View Applications</Link>
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
