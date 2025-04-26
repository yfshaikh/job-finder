import type React from "react"
import { getUserSession } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "../actions/auth"

export default async function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getUserSession()

  if (!session || session.userType !== "job_seeker") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">
              <Link href="/job-seeker/dashboard">JobConnect</Link>
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/job-seeker/dashboard" className="text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/job-seeker/profile" className="text-sm font-medium">
                Profile
              </Link>
              <Link href="/job-seeker/applications" className="text-sm font-medium">
                Applications
              </Link>
              <Link href="/job-seeker/jobs" className="text-sm font-medium">
                Find Jobs
              </Link>
            </nav>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex justify-between text-sm text-muted-foreground">
          <p>© 2023 JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
