"use server"

import { getCurrentUser } from "@/services/clerk"
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from "../permissions/products"
import { deleteProduct, insertProduct, updateProduct } from "../db/products"
import { productSchema } from "../schemas/productSchema"
import { redirect } from "next/navigation"
import { z } from "zod"

export async function deleteProductAction(id: string) {  
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: "Error deleting your product" }
  }

  await deleteProduct(id)
  return { error: false, message: "Successfully deleted your product" }
} 

export async function createProductAction(unsafeData: z.infer<typeof productSchema>) {
  const {success, data} = productSchema.safeParse(unsafeData)
  
  if (!success || !canCreateProducts(await getCurrentUser())) {
    return {error: true, message: "Invalid data or unauthorized"}
  }
  
  await insertProduct(data)

  redirect(`/admin/products/`)  
}

export async function updateProductAction(id: string, unsafeData: z.infer<typeof productSchema>) {
  const {success, data} = productSchema.safeParse(unsafeData)
  
  if (!success || !canUpdateProducts(await getCurrentUser())) {
    return {error: true, message: "Invalid data or unauthorized"}
  }

  await updateProduct(id, data)

  redirect(`/admin/products/`)  
}

