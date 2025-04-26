"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./login-form"
import { JobSeekerSignupForm } from "./job-seeker-signup-form"
import { RecruiterSignupForm } from "./recruiter-signup-form"
import type { UserType } from "@/lib/db"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [userType, setUserType] = useState<UserType>("job_seeker")

  return (
    <Tabs
      defaultValue="login"
      className="w-full max-w-md"
      onValueChange={(value) => setActiveTab(value as "login" | "signup")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="mb-4 mt-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setUserType("job_seeker")}
              className={`px-4 py-2 rounded-md ${
                userType === "job_seeker" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setUserType("recruiter")}
              className={`px-4 py-2 rounded-md ${
                userType === "recruiter" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>
        <LoginForm userType={userType} />
      </TabsContent>
      <TabsContent value="signup">
        <div className="mb-4 mt-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setUserType("job_seeker")}
              className={`px-4 py-2 rounded-md ${
                userType === "job_seeker" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setUserType("recruiter")}
              className={`px-4 py-2 rounded-md ${
                userType === "recruiter" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>
        {userType === "job_seeker" ? <JobSeekerSignupForm /> : <RecruiterSignupForm />}
      </TabsContent>
    </Tabs>
  )
}
