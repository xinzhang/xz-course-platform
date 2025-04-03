'use client'

import { CourseSectionStatus } from "@/drizzle/schema"

export function SortableSectionList({
  courseId, 
  sections
}: { 
  courseId: string, 
  sections: {
    id: string
    name: string
    status: CourseSectionStatus
  }[] 
}) {
  return (
    <div>
      sortable list
    </div>
  )
}