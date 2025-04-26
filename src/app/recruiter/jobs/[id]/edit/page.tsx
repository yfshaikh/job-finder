import { getUserSession } from "@/app/actions/auth"
import { getJobDetails } from "@/app/actions/job-seeker"
import { getRecruiterProfile } from "@/app/actions/recruiter"
import { JobEditForm } from "@/components/recruiter/job-edit-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditJobPageProps {
  params: {
    id: string
  }
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const jobResult = await getJobDetails(params.id)
  const profileResult = await getRecruiterProfile(session.userId)

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
  const profile = profileResult.success ? profileResult.data : null

  // Check if the job belongs to the current recruiter
  if (job.recruiter_id.toString() !== session.userId) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Unauthorized</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to edit this job posting.</p>
        <Button asChild>
          <Link href="/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/recruiter/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Job Posting</h1>
      <p className="text-muted-foreground mb-8">
        Update the details of your job posting to attract the right candidates.
      </p>

      <JobEditForm userId={session.userId} job={job} companyName={profile?.company_name || ""} />
    </div>
  )
}
