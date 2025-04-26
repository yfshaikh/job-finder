import { getUserSession } from "@/app/actions/auth"
import { getJobDetails } from "@/app/actions/job-seeker"
import { JobApplyButton } from "@/components/job-seeker/job-apply-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, MapPin, DollarSign, Clock } from "lucide-react"
import Link from "next/link"

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const jobResult = await getJobDetails(params.id)

  if (!jobResult.success) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Job Not Found</h1>
        <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/job-seeker/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>
    )
  }

  const job = jobResult.data

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/job-seeker/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{job.job_title}</CardTitle>
                <CardDescription className="text-lg">{job.company_name}</CardDescription>
              </div>
              <JobApplyButton jobId={params.id} jobSeekerId={session.userId} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{"Full-time"}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{job.salary_range || "Not specified"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Posted {new Date(job.date_posted).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Job Description</h2>
              <div className="whitespace-pre-line">{job.job_description}</div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">About the Company</h2>
              <p>{job.company_description || "No company description available."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.company_website && (
                <div>
                  <h3 className="text-sm font-medium">Company Website</h3>
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {job.company_website}
                  </a>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">Posted On</h3>
                <p className="text-muted-foreground">{new Date(job.date_posted).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
