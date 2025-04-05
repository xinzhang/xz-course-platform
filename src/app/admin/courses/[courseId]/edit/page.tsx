import { ActionButton } from "@/components/ActionButton";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import CourseForm from "@/features/courses/components/CourseForm";
import { getCourseIdTag } from "@/features/courses/db/cache/courses";
import { deleteCourseSectionAction } from "@/features/courseSections/actions/sections";
import SectionFormDialog from "@/features/courseSections/components/SectionFormDialog";
import { SortableSectionList } from "@/features/courseSections/components/SrotableSectionList";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lessons";
import { cn } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import { EyeClosedIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (course == null) return notFound();

  return (
    <div className='container my-6'>
      <PageHeader title={course.name} />
      <Tabs defaultValue='lessons'>
        <TabsList>
          <TabsTrigger value='lessons'>Lessons</TabsTrigger>
          <TabsTrigger value='details'>Details</TabsTrigger>
        </TabsList>
        <TabsContent value='lessons' className='flex flex-col gap-2'>
          <Card>
            <CardHeader className='flex items-center flex-row justify-between'>
              <CardTitle>Sections</CardTitle>
              <SectionFormDialog courseId={course.id}>
                <DialogTrigger asChild>
                  <Button variant='outline'>
                    <PlusIcon />
                    New section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              {/* <SortableSectionList
                courseId={course.id}
                sections={course.courseSections}
              /> */}
              {course.courseSections.map((section) => {
                return (
                  <div key={section.id} className='flex items-center gap-1'>
                    <div
                      className={cn(
                        "contents",
                        section.status === "private" && "text-muted-foreground"
                      )}
                    >
                      {section.status === "private" && (
                        <EyeClosedIcon className='size-4' />
                      )}
                      {section.status === "public" && (
                        <EyeIcon className='size-4' />
                      )}
                    </div>
                    {section.name}
                    <SectionFormDialog courseId={course.id} section={section}>
                      <DialogTrigger asChild>
                        <Button variant='outline' size='sm' className='ml-auto'>
                          Edit
                        </Button>
                      </DialogTrigger>
                    </SectionFormDialog>
                    <ActionButton
                      variant='destructiveOutline'
                      requireAreYouSure
                      action={deleteCourseSectionAction.bind(null, section.id)}
                      size='sm'
                    >
                      <Trash2Icon />
                      <span className='sr-only'>Delete</span>
                    </ActionButton>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='details'>
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return <div>CourseEditPage</div>;
}

async function getCourse(id: string) {
  "use cache";
  cacheTag(
    getCourseIdTag(id),
    getCourseSectionCourseTag(id),
    getLessonCourseTag(id)
  );

  return db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, id),
    with: {
      courseSections: {
        orderBy: asc(CourseSectionTable.order),
        columns: { id: true, status: true, name: true },
        with: {
          lessons: {
            orderBy: asc(LessonTable.order),
            columns: {
              id: true,
              name: true,
              status: true,
              description: true,
              youtubeVideoId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  });
}
