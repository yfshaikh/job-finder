import { getUserSession } from "@/app/actions/auth"
import { getRecruiterProfile } from "@/app/actions/recruiter-profile"
import { JobForm } from "@/components/recruiter/job-form"

export default async function NewJobPosting() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const profileResult = await getRecruiterProfile(session.userId)
  const profile = profileResult.success ? profileResult.data : null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Job Posting</h1>
      <p className="text-muted-foreground mb-8">
        Fill out the form below to create a new job posting. Be as detailed as possible to attract the right candidates.
      </p>

      <JobForm userId={session.userId} companyName={profile?.company_name || ""} />
    </div>
  )
}
