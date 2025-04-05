import { z } from "zod"
import { lessonStatuses } from "@/drizzle/schema"

export const lessonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sectionId: z.string().min(1, "Required"),
  status: z.enum(lessonStatuses).default("private"),
  youtubeVideoId: z.string().min(1, "Required"),
  description: z.string()
    .transform(v => (v === "" ? null : v))
    .nullable(),
}) 