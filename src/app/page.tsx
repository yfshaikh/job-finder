import { AuthTabs } from "@/components/auth/auth-tabs"
import { getUserSession } from "./actions/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  // Check if user is already logged in
  const session = await getUserSession()

  if (session) {
    // Redirect to appropriate dashboard
    if (session.userType === "job_seeker") {
      redirect("/job-seeker/dashboard")
    } else {
      redirect("/recruiter/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">JobConnect</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find Your Perfect Match</h1>
            <p className="max-w-[700px] text-center text-muted-foreground">
              Connect job seekers with recruiters for the perfect career opportunity
            </p>
          </div>
          <div className="mx-auto flex w-full flex-col items-center space-y-4">
            <AuthTabs />
          </div>
        </section>
      </main>
    </div>
  )
}
