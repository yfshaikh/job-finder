import { getUserSession } from "@/app/actions/auth"
import { getApplicationDetails } from "@/app/actions/recruiter"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Calendar, FileText } from "lucide-react"
import { ApplicationStatusBadge } from "@/components/recruiter/application-status-badge"
import { ApplicationStatusSelect } from "@/components/recruiter/application-status-select"

interface ApplicationDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const session = await getUserSession()

  if (!session) {
    return null // Layout will handle redirect
  }

  const applicationResult = await getApplicationDetails(params.id)

  if (!applicationResult.success) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Application Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The application you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/recruiter/applications">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  const application = applicationResult.data

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/recruiter/applications">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <p className="text-muted-foreground mt-2">
          Review the application for {application.job_title} from {application.applicant_name}
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{application.applicant_name}</CardTitle>
                <CardDescription className="text-lg">Applied for: {application.job_title}</CardDescription>
              </div>
              <ApplicationStatusBadge status={application.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{application.applicant_email}</span>
                  </div>
                  {application.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{application.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Applied on {new Date(application.date_applied).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {application.resume_link && (
                    <div>
                      <h3 className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Resume
                      </h3>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href={application.resume_link} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {application.skills && application.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.split(",").map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              {typeof application.education === "string" && application.education.trim().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Education</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {application.education.split(",").map((edu: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {edu.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              {typeof application.experience === "string" && application.experience.trim().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Experience</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {application.experience.split(",").map((exp: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {exp.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              {application.introduction && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                  <p className="text-muted-foreground">{application.introduction}</p>
                </div>
              )}

              {application.about && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{application.about}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <h3 className="text-lg font-semibold mb-2 md:mb-0">Application Status</h3>
                  <ApplicationStatusSelect
                    applicationId={application.application_id.toString()}
                    currentStatus={application.status}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
