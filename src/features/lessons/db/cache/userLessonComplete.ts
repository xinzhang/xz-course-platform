import { getCourseTag, getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUserLessonCompleteGlobalTag() {
  return getGlobalTag("userLessonComplete")
}

export function getUserLessonCompleteIdTag({
  lessonId,
  userId,
}: {
  lessonId: string
  userId: string
}) {
  return getIdTag("userLessonComplete", `lesson:${lessonId}-user:${userId}`)
}

export function getUserLessonCompleteUserTag(useId: string) {
  return getUserTag("userLessonComplete", useId)
}

export function revalidateUserLessonCompleteCache({
  lessonId,
  userId,
}: {
  lessonId: string
  userId: string
}) {
  revalidateTag(getUserLessonCompleteGlobalTag())
  revalidateTag(getUserLessonCompleteIdTag({ lessonId, userId }))
  revalidateTag(getUserLessonCompleteUserTag(userId))
}
