"use client"

import { useState } from "react"
import { updateApplicationStatus } from "@/app/actions/recruiter-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ApplicationStatusSelectProps {
  applicationId: string
  currentStatus: string
}

export function ApplicationStatusSelect({ applicationId, currentStatus }: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  async function handleStatusChange(newStatus: string) {
    setIsLoading(true)

    const result = await updateApplicationStatus(applicationId, newStatus)

    setIsLoading(false)

    if (result.success) {
      setStatus(newStatus)
      toast.success(`Application status updated to ${newStatus}`)
    } else {
      toast.error(result.error || "Failed to update status")
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Status:</span>
      <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Hired">Hired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
