"use server"

import { getCurrentUser } from "@/services/clerk"
import { canRefundPurchases } from "../permissions/purchases"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { updatePurchase } from "../db/purchases"
import { PurchaseTable } from "@/drizzle/schema"


export async function refundPurchasesAction(id: string) {
  if (!canRefundPurchases(await getCurrentUser())) {
    return {
      error: true,
      message: "You are not authorized to refund purchases"
    }
  }
   
  const data = await db.transaction(async (trx) => {
    const refundedPurchase = await updatePurchase(
      id,
      { refundedAt: new Date() },
      trx
    )

    const session = stripeServerClient.checkout.sessions.retrieve(
      refundedPurchase.stripeSessionId
    )

    if (session.payment_intent == null) {
      trx.rollback()
      return {
        error: true,
        message: "There was an error refunding your purchase"
      }
    }
    
    try {
      await stripeServerClient.refunds.create({
        payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent.id,
      })
      await revokeUserCourseAccess(refundedPurchase, trx)
    } catch {
      trx.rollback()
      return {
        error: true,
        message: "There was an error refunding this purchase",
      }
    }
  })

  return data ?? { error: false, message: "Successfully refunded purchase" }
}

