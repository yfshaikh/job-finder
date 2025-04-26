import { getUserSession } from "@/app/actions/auth"
import { getJobSeekerProfile } from "@/app/actions/job-seeker"
import { ProfileForm } from "@/components/job-seeker/profile-form"

export default async function JobSeekerProfile() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const profileResult = await getJobSeekerProfile(session.userId)
  const profile = profileResult.success ? profileResult.data : null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p className="text-muted-foreground mb-8">
        Complete your profile to increase your chances of getting hired. Recruiters are more likely to consider
        candidates with complete profiles.
      </p>

      <ProfileForm profile={profile} userId={session.userId} />
    </div>
  )
}
