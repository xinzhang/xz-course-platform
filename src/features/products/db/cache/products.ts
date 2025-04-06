import { revalidateTag } from "next/cache"
import { getGlobalTag, getIdTag } from "@/lib/dataCache"

export function getProductGlobalTag() {
  return getGlobalTag("products")
}

export function getProductIdTag(id: string) {
  return getIdTag("products", id)
}

export function revalidateProductCache(id: string) {
  revalidateTag(getProductGlobalTag())
  revalidateTag(getProductIdTag(id))
}
