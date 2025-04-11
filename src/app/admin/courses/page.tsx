// /app/admin/courses/page.tsx
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";

import { CourseTable as DbCourseTable } from "@/drizzle/schema/course";
import { asc, countDistinct, eq } from "drizzle-orm"
import { CourseSectionTable, LessonTable, UserCourseAccessTable } from "@/drizzle/schema";
import { getUserCourseAccessGlobalTag } from "@/features/courses/db/cache/userCourseAccess";
import { getCourseSectionGlobalTag } from "@/features/courseSections/db/cache";
import { getLessonGlobalTag } from "@/features/lessons/db/cache/lessons";

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className='container my-6'>
      <PageHeader title='Courses'>
        <Button asChild>
          <Link href='/admin/courses/new'>Add Course</Link>
        </Button>
      </PageHeader>
      <CourseTable courses={courses} />
    </div>
  );
}

async function getCourses() {
  "use cache"
  cacheTag(
    getCourseGlobalTag(),
    getUserCourseAccessGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag()
  )

  return db
    .select({
      id: DbCourseTable.id,
      name: DbCourseTable.name,
      description: DbCourseTable.description,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
    })
    .from(DbCourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, DbCourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, DbCourseTable.id)
    )
    .orderBy(asc(DbCourseTable.name))
    .groupBy(DbCourseTable.id)
}
