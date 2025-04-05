"use client";

import { SortableItem, SortableList } from "@/components/SortableList";
import { LessonStatus } from "@/drizzle/schema";
import { deleteLessonAction, updateLessonOrdersAction } from "../actions/lessons";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  EyeClosed,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import LessonFormDialog from "./LessonFormDialog";

export function SortableLessonList({
  sections,
  lessons,
}: {
  sections: {
    id: string;
    name: string;
  }[];
  lessons: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  }[];
}) {
  return (
    <SortableList items={lessons} onOrderChange={updateLessonOrdersAction}>
      {(items) =>
        items.map((lesson) => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className='flex items-center gap-1'
          >
            <div
              className={cn(
                "contents",
                lesson.status === "private" && "text-muted-foreground"
              )}
            >
              {lesson.status === "private" && <EyeClosed className='size-4' />}
              {lesson.status === "preview" && <VideoIcon className='size-4' />}
              {lesson.name}
            </div>
            <LessonFormDialog lesson={lesson} sections={sections}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm' className='ml-auto'>
                  Edit
                </Button>
              </DialogTrigger>
            </LessonFormDialog>
            <ActionButton
              variant='destructiveOutline'
              requireAreYouSure
              action={deleteLessonAction.bind(null, lesson.id)}
              size='sm'
            >
              <Trash2Icon />
              <span className='sr-only'>Delete</span>
            </ActionButton>
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
