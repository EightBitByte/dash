"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password");

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return { error: "Incorrect password" };
  }

  const token = await signToken({ authenticated: true });

  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // Redirect removed to allow client-side window.location.href
  return { success: true };
}
