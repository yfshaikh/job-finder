"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";


// Update recruiter profile
export async function updateRecruiterProfile(recruiterId: string, formData: FormData) {
  try {
    console.log("[UpdateRecruiterProfile] Received form data for recruiterId:", recruiterId);

    const name = formData.get("name") as string;
    const company_name = formData.get("company_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company_description = formData.get("company_description") as string;
    const company_website = formData.get("company_website") as string;
    const company_location = formData.get("company_location") as string;

    console.log("[UpdateRecruiterProfile] Parsed form fields:", {
      name,
      company_name,
      email,
      phone,
      company_description,
      company_website,
      company_location,
    });

    if (!name || !company_name || !email) {
      console.warn("[UpdateRecruiterProfile] Missing required fields:", { name, company_name, email });
      return { success: false, error: "Name, company name, and email are required" };
    }

    console.log("[UpdateRecruiterProfile] Updating recruiter profile in database...");

    await pool.execute(
      `UPDATE recruiters
        SET name = ?, company_name = ?, email = ?, phone = ?, company_description = ?, company_website = ?, company_location = ?
        WHERE recruiter_id = ?`,
      [
        name,
        company_name,
        email,
        phone || null,
        company_description || null,
        company_website || null,
        company_location || null,
        Number.parseInt(recruiterId),
      ]
    );

    console.log("[UpdateRecruiterProfile] Update successful. Revalidating /recruiter/profile...");
    revalidatePath("/recruiter/profile");

    return { success: true };
  } catch (error: any) {
    console.error("[UpdateRecruiterProfile] Error:", error.message);
    return { success: false, error: error.message };
  }
}


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


// Get recruiter profile
export async function getRecruiterProfile(recruiterId: string) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM recruiters WHERE recruiter_id = ?`,
      [Number.parseInt(recruiterId)]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return { success: false, error: "Recruiter not found" };
    }

    return { success: true, data: result[0] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

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

// Get applications for a specific job
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

// Get application details
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

// Update job posting
export async function updateJobPosting(recruiterId: string, jobId: string, formData: FormData) {
  try {
    console.log("[UpdateJobPosting] Updating job posting:", { recruiterId, jobId });

    const job_title = formData.get("job_title") as string;
    const job_description = formData.get("job_description") as string;
    const location = formData.get("location") as string;
    const salary_range = formData.get("salary_range") as string;

    console.log("[UpdateJobPosting] Parsed form fields:", {
      job_title,
      job_description,
      location,
      salary_range,
    });

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

    console.log("[UpdateJobPosting] Job verified, updating...");

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

    console.log("[UpdateJobPosting] Update successful. Revalidating cache...");

    revalidatePath("/recruiter/jobs");
    revalidatePath(`/recruiter/jobs/${jobId}`);

    return { success: true };
  } catch (error: any) {
    console.error("[UpdateJobPosting] Error:", error.message);
    return { success: false, error: error.message };
  }
}

