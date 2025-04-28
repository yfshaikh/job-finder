import { getUserSession } from "@/app/actions/auth"
import { getRecruiterProfile } from "@/app/actions/recruiter-profile"
import { ProfileForm } from "@/components/recruiter/profile-form"

export default async function RecruiterProfile() {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const profileResult = await getRecruiterProfile(session.userId)
  const profile = profileResult.success ? profileResult.data : null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
      <p className="text-muted-foreground mb-8">
        Complete your company profile to attract the best candidates. A complete profile helps job seekers understand
        your company better.
      </p>

      <ProfileForm profile={profile} userId={session.userId} />
    </div>
  )
}
