"use client"

import { useState } from "react"
import { applyForJob } from "@/app/actions/job-seeker"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface JobApplyButtonProps {
  jobId: string
  jobSeekerId: string
}

export function JobApplyButton({ jobId, jobSeekerId }: JobApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  async function handleApply() {
    setIsLoading(true)

    const result = await applyForJob(jobSeekerId, jobId)

    setIsLoading(false)

    if (result.success) {
      setHasApplied(true)
      toast.success("Your application has been submitted successfully.")
    } else {
      toast.error(result.error || "Failed to submit application")
    }
  }

  return (
    <Button onClick={handleApply} disabled={isLoading || hasApplied}>
      {isLoading ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
    </Button>
  )
}
