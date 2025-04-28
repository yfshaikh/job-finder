"use server";

import { revalidatePath } from "next/cache";
import { pool, type Recruiter, type JobSeeker } from "@/lib/db";




// Create job posting 
export async function createJobPosting(recruiterId: string, formData: FormData) {
  try {
    console.log("[CreateJobPosting] Received form data for recruiterId:", recruiterId);

    const job_title = formData.get("job_title") as string;
    const job_description = formData.get("job_description") as string;
    const location = formData.get("location") as string;
    const salary_range = formData.get("salary_range") as string;
    const company_name = formData.get("company_name") as string;
    const job_type = formData.get("job_type") as string;
    const experience_level = formData.get("experience_level") as string;

    console.log("[CreateJobPosting] Parsed form fields:", {
      job_title,
      job_description,
      location,
      salary_range,
      company_name,
      job_type,
      experience_level,
    });

    if (!job_title || !job_description || !location || !company_name) {
      console.warn("[CreateJobPosting] Missing required fields");
      return { success: false, error: "Job title, description, location, and company name are required" };
    }

    console.log("[CreateJobPosting] Inserting job posting into database...");

    await pool.execute(
      `INSERT INTO job_postings (job_title, job_description, location, salary_range, company_name, recruiter_id, job_type, experience_level, date_posted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        job_title,
        job_description,
        location,
        salary_range || null,
        company_name,
        Number.parseInt(recruiterId),
        job_type || null,
        experience_level || null,
      ]
    );

    console.log("[CreateJobPosting] Insert successful. Revalidating /recruiter/jobs cache...");
    revalidatePath("/recruiter/jobs");

    return { success: true };
  } catch (error: any) {
    console.error("[CreateJobPosting] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Update job posting
export async function updateJobPosting(recruiterId: string, jobId: string, formData: FormData) {
    try {
  
      const job_title = formData.get("job_title") as string;
      const job_description = formData.get("job_description") as string;
      const location = formData.get("location") as string;
      const salary_range = formData.get("salary_range") as string;

  
      if (!job_title || !job_description || !location) {
        console.warn("[UpdateJobPosting] Missing required fields");
        return { success: false, error: "Job title, description, and location are required" };
      }
  
      // First, verify that this job belongs to the recruiter
      const [jobCheckRows] = await pool.execute(
        `SELECT recruiter_id FROM job_postings WHERE job_id = ?`,
        [Number.parseInt(jobId)]
      );
  
      const jobCheck = jobCheckRows as any[];
  
      if (jobCheck.length === 0) {
        console.warn("[UpdateJobPosting] Job not found");
        return { success: false, error: "Job not found" };
      }
  
      if (jobCheck[0].recruiter_id.toString() !== recruiterId) {
        console.warn("[UpdateJobPosting] Recruiter does not own this job");
        return { success: false, error: "You don't have permission to edit this job" };
      }
  
  
      await pool.execute(
        `UPDATE job_postings
         SET job_title = ?, job_description = ?, location = ?, salary_range = ?
         WHERE job_id = ? AND recruiter_id = ?`,
        [
          job_title,
          job_description,
          location,
          salary_range || null,
          Number.parseInt(jobId),
          Number.parseInt(recruiterId),
        ]
      );
  
  
      revalidatePath("/recruiter/jobs");
      revalidatePath(`/recruiter/jobs/${jobId}`);
  
      return { success: true };
    } catch (error: any) {
      console.error("[UpdateJobPosting] Error:", error.message);
      return { success: false, error: error.message };
    }
  }

// Update application status
export async function updateApplicationStatus(applicationId: string, status: string) {
    try {
      await pool.execute(
        `UPDATE applications SET status = ? WHERE application_id = ?`,
        [status, Number.parseInt(applicationId)]
      );
  
      revalidatePath("/recruiter/applications");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  // Delete job posting
  export async function deleteJobPosting(jobId: string) {
    try {
      await pool.execute(
        `DELETE FROM job_postings WHERE job_id = ?`,
        [Number.parseInt(jobId)]
      );
  
      revalidatePath("/recruiter/jobs");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
