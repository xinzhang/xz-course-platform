import { CourseSectionTable, CourseTable, LessonStatus, LessonTable, UserCourseAccessTable, UserRole } from "@/drizzle/schema"
import { getUserCourseAccessUserTag } from "@/features/courses/db/cache/userCourseAccess"
import { and, eq, or } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getLessonIdTag } from "../db/cache/lessons"
import { db } from "@/drizzle/db"
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections"

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

// export function canViewLesson(user: { role?: UserRole }, lessonStatus: "public" | "private" | "preview") {
//   if (user.role === "admin") return true
//   if (lessonStatus === "public") return true
//   if (lessonStatus === "preview") return true
//   return false
// }

export async function canViewLesson(
  {
    role,
    userId,
  }: {
    userId: string | undefined
    role: UserRole | undefined
  },
  lesson: { id: string; status: LessonStatus }
) {
  "use cache"
  if (role === "admin" || lesson.status === "preview") return true
  if (userId == null || lesson.status === "private") return false

  cacheTag(getLessonIdTag(lesson.id), getUserCourseAccessUserTag(userId))

  const [data] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .leftJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.courseId))
    .leftJoin(
      CourseSectionTable,
      and(
        eq(CourseSectionTable.courseId, CourseTable.id),
        wherePublicCourseSections
      )
    )
    .leftJoin(
      LessonTable,
      and(eq(LessonTable.sectionId, CourseSectionTable.id), wherePublicLessons)
    )
    .where(
      and(
        eq(LessonTable.id, lesson.id),
        eq(UserCourseAccessTable.userId, userId)
      )
    )
    .limit(1)

    return data != null && data.courseId != null
    
}


export const wherePublicLessons = or(
  eq(LessonTable.status, "public"),
  eq(LessonTable.status, "preview")
)
