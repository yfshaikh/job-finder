"use server";

import { revalidatePath } from "next/cache";
import { pool, type JobSeeker } from "@/lib/db";




// Get job seeker's applications
export async function getJobSeekerApplications(jobSeekerId: string) {
  try {
    console.log("[GetJobSeekerApplications] Fetching applications for jobSeekerId:", jobSeekerId);

    const [rows] = await pool.execute(
      `SELECT 
          applications.application_id,
          applications.job_seeker_id,
          applications.job_id,
          applications.status,
          applications.date_applied,
          job_postings.job_title,
          job_postings.company_name,
          job_postings.location,
          job_postings.date_posted
       FROM applications
       JOIN job_postings AS job_postings ON applications.job_id = job_postings.job_id
       WHERE applications.job_seeker_id = ?
       ORDER BY applications.date_applied DESC`,
      [Number.parseInt(jobSeekerId)]
    );

    return { success: true, data: rows };
  } catch (error: any) {
    console.error("[GetJobSeekerApplications] Error:", error.message);
    return { success: false, error: error.message };
  }
}


// Get all available jobs
export async function getAllJobs() {
  try {
    console.log("[GetAllJobs] Fetching all jobs");

    const [rows] = await pool.execute(
      `SELECT * FROM job_postings ORDER BY date_posted DESC`
    );

    return { success: true, data: rows };
  } catch (error: any) {
    console.error("[GetAllJobs] Error:", error.message);
    return { success: false, error: error.message };
  }
}


// verify credentials (login)
export async function verifyJobSeekerCredentials(email: string, password: string) {
  try {
    const [rows] = await pool.execute(
      `SELECT job_seeker_id, name, email, phone, resume_link, profile_created FROM job_seekers WHERE email = ? AND password = ?`,
      [email, password]
    );

    const result = rows as JobSeeker[];

    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true, data: result[0] };
  } catch {
    return { success: false, error: "Authentication failed" };
  }
}





