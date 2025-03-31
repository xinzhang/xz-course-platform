'use server'

import { z } from "zod"
import { deleteCourse, insertCourse } from "../db/courses"
import { courseSchema } from "../schemas/courseSchema"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/services/clerk"
import { canCreateCourses, canDeleteCourses } from "@/permissions/utils"

export async function createCourseAction(unsafeData: z.infer<typeof courseSchema>) {
  const {success, data} = courseSchema.safeParse(unsafeData)
  
  if (!success || !canCreateCourses(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  const course = await insertCourse(data)
  redirect(`/admin/courses/${course.id}/edit`)
}

export async function deleteCourseAction(id: string) {  
  if (!canDeleteCourses(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }
  await new Promise(resolve => setTimeout(resolve, 1000))

  await deleteCourse(id)
  return { error: false, message: "Course deleted" }
}