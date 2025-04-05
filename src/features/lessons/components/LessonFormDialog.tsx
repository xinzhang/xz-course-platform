"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import LessonForm from "./LessonForm";

export default function LessonFormDialog({
  sections,
  defaultSectionId,
  lesson,
  children,
}: {
  children: ReactNode;
  sections: { id: string; name: string }[];
  defaultSectionId?: string;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    description?: string | null;
    youtubeVideoId: string;
    sectionId: string
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lesson == null ? "New Lesson" : `Edit ${lesson.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <LessonForm
            sections={sections}
            onSuccess={() => setIsOpen(false)}
            lesson={lesson}
            defaultSectionId={defaultSectionId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
