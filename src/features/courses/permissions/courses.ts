import { UserRole } from "@/drizzle/schema"

export function canCreateCourses(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canEditCourses(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canDeleteCourses(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canUpdateCourses(user: { role?: UserRole }) {
  return user.role === "admin"
}

