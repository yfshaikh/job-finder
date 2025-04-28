"use server";

import { revalidatePath } from "next/cache";
import { pool, type JobSeeker } from "@/lib/db";



export async function createJobSeeker(name: string, email: string, password: string, phone?: string) {
    try {
      console.log("Starting to create job seeker:", { name, email, phone });
  
      // Insert new job seeker
      await pool.execute(
        `INSERT INTO job_seekers (name, email, password, phone) VALUES (?, ?, ?, ?)`,
        [name, email, password, phone || null]
      );
      console.log("Insert into job_seekers successful.");
  
      // Fetch inserted job seeker
      const [rows] = await pool.execute(
        `SELECT job_seeker_id, name, email, phone, resume_link, profile_created FROM job_seekers WHERE email = ?`,
        [email]
      );
      console.log("Fetched inserted job seeker:", rows);
  
      return { success: true, data: (rows as JobSeeker[])[0] };
    } catch (error: any) {
      console.error("Error creating job seeker:", error.message);
  
      return {
        success: false,
        error: error.message.includes("Duplicate entry") ? "Email or phone already exists" : "Failed to create account",
      };
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
  
  