import { revalidateTag } from "next/cache"
import { getGlobalTag, getIdTag } from "@/lib/dataCache"

export function getUserGlobalTag() {
  return getGlobalTag("users")
}

export function getUserIdTag(userId: string) {
  return getIdTag("users", userId)
}

export function revalidateUserCache(userId: string) {
  revalidateTag(getUserGlobalTag())
  revalidateTag(getUserIdTag(userId))
}
