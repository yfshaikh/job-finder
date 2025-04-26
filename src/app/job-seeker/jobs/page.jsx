import { getUserSession } from "@/app/actions/auth"
import { getAllJobs } from "@/app/actions/job-seeker"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobSearch } from "@/components/job-seeker/job-search"

export default async function JobSeekerJobs() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const jobsResult = await getAllJobs()
  const jobs = jobsResult.success ? jobsResult.data : []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>

      {/* <div className="mb-8">
        <JobSearch />
      </div> */}

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Jobs Found</CardTitle>
              <CardDescription>There are no job postings available at the moment.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.job_id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <CardTitle>{job.job_title}</CardTitle>
                    <CardDescription>{job.company_name}</CardDescription>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-muted-foreground">
                    Posted on {new Date(job.date_posted).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Job Type</h3>
                      <p className="text-sm text-muted-foreground">{"Full-time"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Salary Range</h3>
                      <p className="text-sm text-muted-foreground">{job.salary_range || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{job.job_description}</p>
                  </div>

                  <div className="pt-2">
                    <Button asChild>
                      <Link href={`/job-seeker/jobs/${job.job_id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
