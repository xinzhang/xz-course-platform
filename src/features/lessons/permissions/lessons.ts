import { LessonTable, UserRole } from "@/drizzle/schema"
import { eq, or } from "drizzle-orm"

export function canCreateLessons(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canEditLessons(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canDeleteLessons(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canUpdateLessons(user: { role?: UserRole }) {
  return user.role === "admin"
}

export function canViewLesson(user: { role?: UserRole }, lessonStatus: "public" | "private" | "preview") {
  if (user.role === "admin") return true
  if (lessonStatus === "public") return true
  if (lessonStatus === "preview") return true
  return false
}

export function canAccessLesson(
  user: { role?: UserRole }, 
  lessonStatus: "public" | "private" | "preview",
  hasAccess: boolean
) {
  if (user.role === "admin") return true
  if (!hasAccess) return false
  return lessonStatus !== "private" || hasAccess
} 

export const wherePublicLessons = or(
  eq(LessonTable.status, "public"),
  eq(LessonTable.status, "preview")
)
