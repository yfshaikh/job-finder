"use server";

import { revalidatePath } from "next/cache";
import { pool, type Recruiter, type JobSeeker } from "@/lib/db";



// Get recruiter's job postings
export async function getRecruiterJobs(recruiterId: string) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM job_postings WHERE recruiter_id = ? ORDER BY date_posted DESC`,
        [Number.parseInt(recruiterId)]
      );
  
      return { success: true, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  
  // Get all applications for recruiter
export async function getRecruiterApplications(recruiterId: string) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          applications.application_id,
          applications.job_seeker_id,
          applications.job_id,
          applications.status,
          applications.date_applied,
          job_postings.job_title,
          job_seekers.name AS applicant_name,
          job_seekers.email AS applicant_email
        FROM applications
        JOIN job_postings AS job_postings ON applications.job_id = job_postings.job_id
        JOIN job_seekers AS job_seekers ON applications.job_seeker_id = job_seekers.job_seeker_id
        WHERE job_postings.recruiter_id = ?
        ORDER BY applications.date_applied DESC;
        `,
        [Number.parseInt(recruiterId)]
      );
  
      return { success: true, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  export async function verifyRecruiterCredentials(email: string, password: string) {
    try {
      const [rows] = await pool.execute(
        `SELECT recruiter_id, company_name, name, email, phone, profile_created FROM recruiters WHERE email = ? AND password = ?`,
        [email, password]
      );
  
      const result = rows as Recruiter[];
  
      if (result.length === 0) {
        return { success: false, error: "Invalid email or password" };
      }
  
      return { success: true, data: result[0] };
    } catch {
      return { success: false, error: "Authentication failed" };
    }
  }


  // Get applications for a specific job (recruiter)
export async function getJobApplications(jobId: string) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            applications.application_id,
            applications.job_seeker_id,
            applications.job_id,
            applications.status,
            applications.date_applied,
            job_seekers.name AS applicant_name,
            job_seekers.email AS applicant_email,
            job_seekers.phone,
            job_seekers.resume_link
         FROM applications
         JOIN job_seekers AS job_seekers ON applications.job_seeker_id = job_seekers.job_seeker_id
         WHERE applications.job_id = ?
         ORDER BY applications.date_applied DESC`,
        [Number.parseInt(jobId)]
      );
  
      return { success: true, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }