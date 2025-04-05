'use server'

import { z } from "zod"
import { createLesson, updateLesson, deleteLesson, getNextCourseLessonOrder, updateLessonOrders } from "../db/lessons"
import { lessonSchema } from "../schemas/lessonSchema"
import { getCurrentUser } from "@/services/clerk"
import { canCreateLessons, canDeleteLessons, canUpdateLessons } from "../permissions/lessons"

export async function createLessonAction(unsafeData: z.infer<typeof lessonSchema>) {
  const {success, data} = lessonSchema.safeParse(unsafeData)
  
  if (!success || !canCreateLessons(await getCurrentUser())) {
    return {error: true, message: "Invalid data or unauthorized"}
  }
  const order = await getNextCourseLessonOrder(data.sectionId)
  
  await createLesson({ ...data, order })
  
  return { error: false, message: "Lesson created"}
}

export async function updateLessonAction(id: string, unsafeData: z.infer<typeof lessonSchema>) {
  const {success, data} = lessonSchema.safeParse(unsafeData)
  
  if (!success || !canUpdateLessons(await getCurrentUser())) {
    return {error: true, message: "Invalid data or unauthorized"}
  }

  await updateLesson(id, data)
  return { error: false, message: "Lesson updated" }
}

export async function deleteLessonAction(id: string) {  
  if (!canDeleteLessons(await getCurrentUser())) {
    return {error: true, message: "Unauthorized"}
  }

  await deleteLesson(id)
  return { error: false, message: "Lesson deleted" }
}

export async function updateLessonOrdersAction(lessonIds: string[]) {
  if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
    return { error: true, message: "Error reordering your lessons" }
  }

  await updateLessonOrders(lessonIds)

  return { error: false, message: "Successfully reordered your lessons" }
}
