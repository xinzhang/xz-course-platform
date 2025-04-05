"use client";

import { SortableItem, SortableList } from "@/components/SortableList";
import { CourseSectionStatus } from "@/drizzle/schema";
import {
  deleteCourseSectionAction,
  updateSectionOrdersAction,
} from "../actions/sections";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { EyeClosedIcon, EyeIcon, Trash2Icon } from "lucide-react";
import SectionFormDialog from "./SectionFormDialog";

export function SortableSectionList({
  courseId,
  sections,
}: {
  courseId: string;
  sections: {
    id: string;
    name: string;
    status: CourseSectionStatus;
  }[];
}) {
  return (
    <SortableList items={sections} onOrderChange={updateSectionOrdersAction}>
      {(items) =>
        items.map((section) => (
          <SortableItem
            key={section.id}
            id={section.id}
            className='flex items-center gap-1'
          >
            <div
              className={cn(
                "contents",
                section.status === "private" && "text-muted-foreground"
              )}
            >
              {section.status === "private" && (
                <EyeClosedIcon className='size-4' />
              )}
              {section.status === "public" && <EyeIcon className='size-4' />}
            </div>
            {section.name}
            <SectionFormDialog courseId={courseId} section={section}>
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
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
