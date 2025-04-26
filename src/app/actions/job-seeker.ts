"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";

// Update job seeker profile
export async function updateJobSeekerProfile(jobSeekerId: string, formData: FormData) {
  try {
    console.log("[UpdateJobSeekerProfile] Updating profile for jobSeekerId:", jobSeekerId);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resume_link = formData.get("resume_link") as string;
    const skills = formData.get("skills") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const introduction = formData.get("introduction") as string;
    const about = formData.get("about") as string;

    console.log("[UpdateJobSeekerProfile] Parsed fields:", { name, email, phone, skills, education, experience });

    if (!name || !email) {
      console.warn("[UpdateJobSeekerProfile] Missing name or email");
      return { success: false, error: "Name and email are required" };
    }

    // Store skills, education, experience as comma-separated strings
    const skillsString = skills || null;
    const educationString = education || null;
    const experienceString = experience || null;

    await pool.execute(
      `UPDATE job_seekers
       SET name = ?, email = ?, phone = ?, resume_link = ?, skills = ?, education = ?, experience = ?, introduction = ?, about = ?, profile_completed = true
       WHERE job_seeker_id = ?`,
      [
        name,
        email,
        phone || null,
        resume_link || null,
        skillsString,
        educationString,
        experienceString,
        introduction || null,
        about || null,
        Number.parseInt(jobSeekerId)
      ]
    );

    console.log("[UpdateJobSeekerProfile] Profile updated successfully");
    revalidatePath("/job-seeker/profile");

    return { success: true };
  } catch (error: any) {
    console.error("[UpdateJobSeekerProfile] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Get job seeker profile
export async function getJobSeekerProfile(jobSeekerId: string) {
  try {
    console.log("[GetJobSeekerProfile] Fetching profile for jobSeekerId:", jobSeekerId);

    const [rows] = await pool.execute(
      `SELECT * FROM job_seekers WHERE job_seeker_id = ?`,
      [Number.parseInt(jobSeekerId)]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return { success: false, error: "Job seeker not found" };
    }

    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("[GetJobSeekerProfile] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Apply for a job
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

// Get job details
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


// Get recommended jobs based on skills
export async function getRecommendedJobs(jobSeekerId: string) {
  try {
    console.log("[GetRecommendedJobs] Fetching skills for jobSeekerId:", jobSeekerId);

    const [profileRows] = await pool.execute(
      `SELECT skills FROM job_seekers WHERE job_seeker_id = ?`,
      [Number.parseInt(jobSeekerId)]
    );

    const profileResult = profileRows as any[];

    if (profileResult.length === 0 || !profileResult[0].skills) {
      console.warn("[GetRecommendedJobs] No skills found, returning recent jobs");

      const [recentJobs] = await pool.execute(
        `SELECT * FROM job_postings ORDER BY date_posted DESC LIMIT 5`
      );

      return { success: true, data: recentJobs };
    }

    const skills = profileResult[0].skills.split(",").map((s: string) => s.trim());

    console.log("[GetRecommendedJobs] Matching based on skills:", skills);

    const [jobs] = await pool.execute(
      `SELECT * FROM job_postings
       WHERE LOWER(job_title) LIKE ? OR LOWER(job_description) LIKE ?
       ORDER BY date_posted DESC
       LIMIT 10`,
      [`%${skills[0].toLowerCase()}%`, `%${skills[0].toLowerCase()}%`]
    );

    return { success: true, data: jobs };
  } catch (error: any) {
    console.error("[GetRecommendedJobs] Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Search jobs
export async function searchJobs(query: string) {
  try {
    console.log("[SearchJobs] Searching jobs with query:", query);

    const [rows] = await pool.execute(
      `SELECT * FROM job_postings
       WHERE LOWER(job_title) LIKE ? OR LOWER(job_description) LIKE ? OR LOWER(company_name) LIKE ? OR LOWER(location) LIKE ?
       ORDER BY date_posted DESC`,
      [
        `%${query.toLowerCase()}%`,
        `%${query.toLowerCase()}%`,
        `%${query.toLowerCase()}%`,
        `%${query.toLowerCase()}%`
      ]
    );

    return { success: true, data: rows };
  } catch (error: any) {
    console.error("[SearchJobs] Error:", error.message);
    return { success: false, error: error.message };
  }
}
