import { getCurrentUser } from "@/services/clerk"
import { canUpdateUserLessonCompleteStatus } from "../permissions/userLessonComplete"

export async function updateLessonCompleteStatusAction(
  lessonId: string,
  complete: boolean
) {
  const { userId } = await getCurrentUser()

  const hasPermission = await canUpdateUserLessonCompleteStatus(
    { userId },
    lessonId
  )

  if (userId == null || !hasPermission) {
    return { error: true, message: "Error updating lesson completion status" }
  }

  await updateLessonCompleteStatus({ lessonId, userId, complete })

  return {
    error: false,
    message: "Successfully updated lesson completion status",
  }
}
