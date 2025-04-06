"use server"

import { getCurrentUser } from "@/services/clerk"
import { canDeleteProducts } from "../permissions/products"
import { deleteProduct } from "../db/products"

export async function deleteProductAction(id: string) {  
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: "Error deleting your product" }
  }

  await deleteProduct(id)
  return { error: false, message: "Successfully deleted your product" }
} 