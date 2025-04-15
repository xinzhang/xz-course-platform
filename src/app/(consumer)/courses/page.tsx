import { PageHeader } from "@/components/PageHeader";
import {
  SkeletonArray,
  SkeletonButton,
  SkeletonText,
} from "@/components/Skeleton";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserLessonCompleteTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { getUserCourseAccessUserTag } from "@/features/courses/db/cache/userCourseAccess";
import { getUserLessonCompleteUserTag } from "@/features/lessons/db/cache/userLessonComplete";
import { getCurrentUser } from "@/services/clerk";
import { countDistinct, eq, and } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";
import { wherePublicCourseSections } from "@/features/courseSections/permissions/sections";
import { wherePublicLessons } from "@/features/lessons/permissions/lessons";
import { getCourseIdTag } from "@/features/courses/db/cache/courses";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPlural } from "@/lib/formatters";
export default function CoursesPage() {
  return (
    <div className='container my-6'>
      <PageHeader title='My Courses' />
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        <Suspense
          fallback={
            <SkeletonArray amount={3}>
              <SkeletonCourseCard />
            </SkeletonArray>
          }
        >
          <CourseGrid />
        </Suspense>
      </div>
    </div>
  );
}

async function CourseGrid() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const courses = await getUserCourses(userId);

  if (courses.length === 0) {
    return (
      <div className='flex flex-col gap-2 items-start'>
        You have no courses yet.
        <Button asChild size='lg'>
          <Link href='/courses/explore'>Explore Courses</Link>
        </Button>
      </div>
    );
  }

  return courses.map((course) => (
    <Card key={course.id} className='overflow-hidden flex flex-col'>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>
          {formatPlural(course.sectionsCount, {
            plural: "sections",
            singular: "section",
          })}{" "}
          •{" "}
          {formatPlural(course.lessonsCount, {
            plural: "lessons",
            singular: "lesson",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className='line-clamp-3' title={course.description}>
        {course.description}
      </CardContent>
      <div className='flex-grow' />
      <CardFooter>
        <Button asChild>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
      <div
        className='bg-accent h-2 -mt-2'
        style={{
          width: `${(course.lessonsComplete / course.lessonsCount) * 100}%`,
        }}
      />
    </Card>
  ));
}

function SkeletonCourseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonText className='w-3/4' />
        </CardTitle>
        <CardDescription>
          <SkeletonText className='w-1/2' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonText rows={3} />
      </CardContent>
      <CardFooter>
        <SkeletonButton />
      </CardFooter>
    </Card>
  );
}

async function getUserCourses(userId: string) {
  "use cache";
  cacheTag(
    getUserCourseAccessUserTag(userId),
    getUserLessonCompleteUserTag(userId)
  );

  const courses = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionsCount: countDistinct(CourseSectionTable.id),
      lessonsCount: countDistinct(LessonTable.id),
      lessonsComplete: countDistinct(UserLessonCompleteTable.lessonId),
    })
    .from(CourseTable)
    .leftJoin(
      UserCourseAccessTable,
      and(
        eq(CourseTable.id, UserCourseAccessTable.courseId),
        eq(UserCourseAccessTable.userId, userId)
      )
    )
    .leftJoin(
      CourseSectionTable,
      and(
        eq(CourseTable.id, CourseSectionTable.courseId),
        wherePublicCourseSections
      )
    )
    .leftJoin(
      LessonTable,
      and(eq(CourseSectionTable.id, LessonTable.sectionId), wherePublicLessons)
    )
    .leftJoin(
      UserLessonCompleteTable,
      and(
        eq(LessonTable.id, UserLessonCompleteTable.lessonId),
        eq(UserLessonCompleteTable.userId, userId)
      )
    )
    .orderBy(CourseTable.name)
    .groupBy(CourseTable.id);

  courses.forEach((course) => {
    cacheTag(
      getCourseIdTag(course.id),
      getCourseSectionCourseTag(course.id),
      getLessonCourseTag(course.id)
    );
  });

  return courses;
}
