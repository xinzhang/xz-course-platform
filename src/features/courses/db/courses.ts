import { db } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema/course';
import { eq } from 'drizzle-orm';

export async function createCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db
    .insert(CourseTable)
    .values(data)
    .returning()

  if (newCourse == null) throw new Error("Failed to create course")

  return newCourse
}

export async function updateCourse(
  id: string, 
  data: Partial<typeof CourseTable.$inferInsert>
) {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(CourseTable.id, id))
    .returning()

  if (updatedCourse == null) throw new Error("Failed to update course")

  return updatedCourse
}

export async function deleteCourse(id: string) {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, id))
    .returning()

  if (deletedCourse == null) throw new Error("Failed to delete course")

  return deletedCourse
}

export async function getCourse(id: string) {
  const [course] = await db
    .select()
    .from(CourseTable)
    .where(eq(CourseTable.id, id))
    .limit(1)

  if (course == null) throw new Error("Course not found")

  return course
}

export async function getCourses() {
  return await db
    .select()
    .from(CourseTable)
    .orderBy(CourseTable.createdAt)
} 