"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"


import { createJobSeeker } from "./job-seeker-profile"
import { verifyJobSeekerCredentials } from "./job-seeker-dashboard"

import { createRecruiter } from "./recruiter-profile"
import { verifyRecruiterCredentials } from "./recruiter-dashboard"

function hashPassword(password) {
  return password // This is not secure, just for demo
}

export async function signUpJobSeeker(formData) {
  const name = formData.get("name") 
  const email = formData.get("email") 
  const password = formData.get("password") 
  const phone = formData.get("phone")

  if (!name || !email || !password) {
    return { success: false, error: "Name, email, and password are required" }
  }

  const hashedPassword = hashPassword(password)
  const result = await createJobSeeker(name, email, hashedPassword, phone)

  if (result.success) {
    // Set authentication cookie
    cookies().set("user_type", "job_seeker", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("user_id", String(result.data.job_seeker_id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    redirect("/job-seeker/dashboard")
  }

  return result
}

export async function signUpRecruiter(formData) {
  const name = formData.get("name") 
  const email = formData.get("email") 
  const password = formData.get("password") 
  const company_name = formData.get("company_name") 
  const phone = formData.get("phone") 

  if (!name || !email || !password || !company_name) {
    return { success: false, error: "Name, email, password, and company name are required" }
  }

  const hashedPassword = hashPassword(password)
  const result = await createRecruiter(name, email, hashedPassword, company_name, phone)

  if (result.success) {
    // Set authentication cookie
    cookies().set("user_type", "recruiter", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("user_id", String(result.data.recruiter_id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    redirect("/recruiter/dashboard")
  }

  return result
}

export async function signIn(formData) {
  const email = formData.get("email")
  const password = formData.get("password") 
  const userType = formData.get("user_type")

  if (!email || !password || !userType) {
    return { success: false, error: "Email, password, and user type are required" }
  }

  const hashedPassword = hashPassword(password)

  let result
  if (userType === "job_seeker") {
    result = await verifyJobSeekerCredentials(email, hashedPassword)

    if (result.success) {
      cookies().set("user_type", "job_seeker", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      cookies().set("user_id", String(result.data.job_seeker_id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      redirect("/job-seeker/dashboard")
    }
  } else {
    result = await verifyRecruiterCredentials(email, hashedPassword)

    if (result.success) {
      cookies().set("user_type", "recruiter", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      cookies().set("user_id", String(result.data.recruiter_id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      redirect("/recruiter/dashboard")
    }
  }

  return result
}

export async function signOut() {
  cookies().delete("user_type")
  cookies().delete("user_id")
  redirect("/")
}

export async function getUserSession() {
  const cookieStore = await cookies()
  const userType = cookieStore.get("user_type")?.value
  const userId = cookieStore.get("user_id")?.value

  if (!userType || !userId) {
    return null
  }

  return { userType, userId }
}
