"use client"

import { useState } from "react"
import { updateJobSeekerProfile } from "@/app/actions/job-seeker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface ProfileFormProps {
  profile: any
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = await updateJobSeekerProfile(userId, formData)

    setIsLoading(false)

    if (result.success) {
      toast.success("Your profile has been updated successfully.")
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  // Convert array fields to comma-separated strings for form display
  const skillsString = profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills) : "";
  const educationString = profile?.education ? (Array.isArray(profile.education) ? profile.education.join(", ") : profile.education) : "";
  const experienceString = profile?.experience ? (Array.isArray(profile.experience) ? profile.experience.join(", ") : profile.experience) : "";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and resume</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={profile?.name || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile?.email || ""} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume_link">Resume Link</Label>
              <Input
                id="resume_link"
                name="resume_link"
                type="url"
                defaultValue={profile?.resume_link || ""}
                placeholder="https://example.com/your-resume.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Upload your resume to a cloud storage service and paste the link here
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={skillsString}
              placeholder="e.g. JavaScript, React, Node.js, SQL"
            />
            <p className="text-xs text-muted-foreground">Separate skills with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              name="education"
              defaultValue={educationString}
              placeholder="e.g. Bachelor's in Computer Science, University of Example (2018-2022)"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">Separate multiple entries with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              defaultValue={experienceString}
              placeholder="e.g. Software Engineer at Example Corp (2022-Present)"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">Separate multiple entries with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="introduction">Introduction</Label>
            <Textarea
              id="introduction"
              name="introduction"
              defaultValue={profile?.introduction || ""}
              placeholder="A brief introduction about yourself"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              name="about"
              defaultValue={profile?.about || ""}
              placeholder="Tell recruiters more about yourself, your interests, and career goals..."
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
