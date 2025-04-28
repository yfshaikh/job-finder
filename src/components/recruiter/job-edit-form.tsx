"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateJobPosting } from "@/app/actions/recruiter-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface JobEditFormProps {
  userId: string
  companyName: string
  job: any
}

export function JobEditForm({ userId, companyName, job }: JobEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = await updateJobPosting(userId, job.job_id.toString(), formData)

    setIsLoading(false)

    if (result.success) {
      toast.success("Your job posting has been updated successfully.")
      router.push("/recruiter/jobs")
    } else {
      toast.error(result.error || "Failed to update job posting")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>Update the information about this job position</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                defaultValue={job.job_title || ""}
                required
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                defaultValue={job.company_name || companyName}
                required
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={job.location || ""}
                required
                placeholder="e.g. New York, NY or Remote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                name="salary_range"
                defaultValue={job.salary_range || ""}
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              name="job_description"
              defaultValue={job.job_description || ""}
              required
              placeholder="Describe the job responsibilities, requirements, benefits, etc."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Job"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
