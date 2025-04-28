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
