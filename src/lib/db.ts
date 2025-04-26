import mysql from "mysql2/promise"

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "jobfinder",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// User types
export type UserType = "job_seeker" | "recruiter"

export interface JobSeeker {
  job_seeker_id: number
  name: string
  email: string
  phone: string | null
  resume_link: string | null
  profile_created: Date
}

export interface Recruiter {
  recruiter_id: number
  company_name: string
  name: string
  email: string
  phone: string | null
  profile_created: Date
}

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