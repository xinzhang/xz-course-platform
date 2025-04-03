'use server'

import { z } from "zod"
import { deleteCourse, insertCourse, updateCourse } from "../db/courses"
import { courseSchema } from "../schemas/courseSchema"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/services/clerk"
import { canCreateCourses, canDeleteCourses, canUpdateCourses } from "@/permissions/utils"

export async function createCourseAction(unsafeData: z.infer<typeof courseSchema>) {
  const {success, data} = courseSchema.safeParse(unsafeData)
  
  if (!success || !canCreateCourses(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  const course = await insertCourse(data)
  redirect(`/admin/courses/${course.id}/edit`)
}

export async function updateCourseAction(id: string,unsafeData: z.infer<typeof courseSchema>) {
  const {success, data} = courseSchema.safeParse(unsafeData)
  
  if (!success || !canUpdateCourses(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  await updateCourse(id, data)
  return { error: false, message: "Course updated" }
}


export async function deleteCourseAction(id: string) {  
  if (!canDeleteCourses(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }
  await new Promise(resolve => setTimeout(resolve, 1000))

  await deleteCourse(id)
  return { error: false, message: "Course deleted" }
}