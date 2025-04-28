"use server";

import { revalidatePath } from "next/cache";
import { pool, type JobSeeker } from "@/lib/db";

// Apply for a job (seeker)
export async function applyForJob(jobSeekerId: string, jobId: string) {
  try {
    console.log("[ApplyForJob] jobSeekerId:", jobSeekerId, "jobId:", jobId);

    const [existingRows] = await pool.execute(
      `SELECT * FROM applications WHERE job_seeker_id = ? AND job_id = ?`,
      [Number.parseInt(jobSeekerId), Number.parseInt(jobId)]
    );

    const existingApplication = existingRows as any[];

    if (existingApplication.length > 0) {
      console.warn("[ApplyForJob] Already applied for this job");
      return { success: false, error: "You have already applied for this job" };
    }

    await pool.execute(
      `INSERT INTO applications (job_seeker_id, job_id, status, date_applied)
       VALUES (?, ?, 'Pending', CURRENT_TIMESTAMP)`,
      [Number.parseInt(jobSeekerId), Number.parseInt(jobId)]
    );

    console.log("[ApplyForJob] Application submitted successfully");
    revalidatePath("/job-seeker/applications");

    return { success: true };
  } catch (error: any) {
    console.error("[ApplyForJob] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Get job details (seeker)
export async function getJobDetails(jobId: string) {
    try {
      console.log("[GetJobDetails] Fetching details for jobId:", jobId);
  
      const [rows] = await pool.execute(
        `SELECT 
            job_postings.job_id,
            job_postings.recruiter_id,
            job_postings.job_title,
            job_postings.job_description,
            job_postings.salary_range,
            job_postings.location,
            job_postings.company_name,
            job_postings.job_type,
            job_postings.experience_level,
            job_postings.date_posted,
            recruiters.company_description,
            recruiters.company_website,
            recruiters.company_location
         FROM job_postings
         LEFT JOIN recruiters AS recruiters ON job_postings.recruiter_id = recruiters.recruiter_id
         WHERE job_postings.job_id = ?`,
        [Number.parseInt(jobId)]
      );
  
      const result = rows as any[];
  
      if (result.length === 0) {
        return { success: false, error: "Job not found" };
      }
  
      return { success: true, data: result[0] };
    } catch (error: any) {
      console.error("[GetJobDetails] Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Get application details (recruiter)
export async function getApplicationDetails(applicationId: string) {
  try {
    console.log("[GetApplicationDetails] Fetching details for applicationId:", applicationId);

    const [rows] = await pool.execute(
      `SELECT 
        applications.application_id, 
        applications.job_seeker_id, 
        applications.job_id, 
        applications.status, 
        applications.date_applied,
        j.job_title,
        js.name AS applicant_name,
        js.email AS applicant_email,
        js.phone,
        js.resume_link,
        js.skills,
        js.education,
        js.experience,
        js.introduction,
        js.about
      FROM applications
      JOIN job_postings AS j ON applications.job_id = j.job_id
      JOIN job_seekers AS js ON applications.job_seeker_id = js.job_seeker_id
      WHERE applications.application_id = ?
      `,
      [Number.parseInt(applicationId)]
    );

    const result = rows as any[];

    if (result.length === 0) {
      console.warn("[GetApplicationDetails] No application found for id:", applicationId);
      return { success: false, error: "Application not found" };
    }

    console.log("[GetApplicationDetails] Application found:", result[0]);
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("[GetApplicationDetails] Error:", error.message);
    return { success: false, error: error.message };
  }
}




