"use server";

import { revalidatePath } from "next/cache";
import { pool, type Recruiter, type JobSeeker } from "@/lib/db";



// create recruiter
export async function createRecruiter(
    name: string,
    email: string,
    password: string,
    company_name: string,
    phone?: string
  ) {
    try {
      await pool.execute(
        `INSERT INTO recruiters (name, email, password, company_name, phone) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, company_name, phone || null]
      );
  
      const [rows] = await pool.execute(
        `SELECT recruiter_id, company_name, name, email, phone, profile_created FROM recruiters WHERE email = ?`,
        [email]
      );
  
      return { success: true, data: (rows as Recruiter[])[0] };
    } catch (error: any) {
      return {
        success: false,
        error: error.message.includes("Duplicate entry") ? "Email or phone already exists" : "Failed to create account",
      };
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