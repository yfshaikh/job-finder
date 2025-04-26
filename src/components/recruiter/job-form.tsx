"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createJobPosting } from "@/app/actions/recruiter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface JobFormProps {
  userId: string
  companyName: string
  job?: any
}

export function JobForm({ userId, companyName, job }: JobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = await createJobPosting(userId, formData)

    setIsLoading(false)

    if (result.success) {
      toast.success("Your job has been posted successfully.")
      router.push("/recruiter/jobs")
    } else {
      toast.error(result.error || "Failed to post job")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>Provide detailed information about the job position</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                defaultValue={job?.job_title || ""}
                required
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                defaultValue={job?.company_name || companyName}
                required
                readOnly={!job}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={job?.location || ""}
                required
                placeholder="e.g. New York, NY or Remote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                name="salary_range"
                defaultValue={job?.salary_range || ""}
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select name="job_type" defaultValue={job?.job_type || "Full-time"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select name="experience_level" defaultValue={job?.experience_level || "Mid-Level"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                  <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              name="job_description"
              defaultValue={job?.job_description || ""}
              required
              placeholder="Describe the job responsibilities, requirements, benefits, etc."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Posting..." : job ? "Update Job" : "Post Job"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
