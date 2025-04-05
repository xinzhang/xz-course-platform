'use server'

import { sectionSchema } from "../schemas/sectionSchema"
import { z } from "zod"
import { getCurrentUser } from "@/services/clerk"
import { canCreateCourseSections, canDeleteCourseSections, canUpdateCourseSections } from "../permissions/sections"
import { deleteSection, getNextCourseSectionOrder, insertSection, updateSection, updateSectionOrders } from "../db/sections"

// missing order for now
export async function createSectionAction(courseId: string,unsafeData: z.infer<typeof sectionSchema>) {
  const {success, data} = sectionSchema.safeParse(unsafeData)
  
  if (!success || !canCreateCourseSections(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  const order = await getNextCourseSectionOrder(courseId)
  await insertSection({...data, courseId, order})
  return {error: false, message: "Section created"}
}

export async function updateSectionAction(id: string, unsafeData: z.infer<typeof sectionSchema>) {
  const {success, data} = sectionSchema.safeParse(unsafeData)
  
  if (!success || !canUpdateCourseSections(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  await updateSection(id, data)
  return {error: false, message: "Section updated"}
}

export async function updateSectionOrdersAction(sectionIds: string[]) {
  if (
    sectionIds.length === 0 ||
    !canUpdateCourseSections(await getCurrentUser())
  ) {
    return { error: true, message: "Error reordering your sections" }
  }

  await updateSectionOrders(sectionIds)

  return { error: false, message: "Successfully reordered your sections" }
}

export async function deleteCourseSectionAction(id: string) {  
  if (!canDeleteCourseSections(await getCurrentUser())) {
    return {error: true, message: "Invalid data"}
  }

  await deleteSection(id)
  return { error: false, message: "Course deleted" }
}