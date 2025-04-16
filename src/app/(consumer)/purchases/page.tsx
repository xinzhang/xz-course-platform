import { PageHeader } from "@/components/PageHeader";
import { PurchaseTable } from "@/drizzle/schema";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/services/clerk";
import { Suspense } from "react";
import { getPurchaseUserTag } from "@/features/purchases/db/cache/purchases";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPurchaseTable } from "@/features/purchases/components/UserPurchaseTable";
import { UserPurchaseTableSkeleton } from "@/features/purchases/components/UserPurchaseTable";
import { db } from "@/drizzle/db";

export default function PurchasesPage() {
  return (
    <div className="container my-6">
      <PageHeader title="Purchase History" />
      <Suspense fallback={<UserPurchaseTableSkeleton />}>
        <SuspenseBoundary />
      </Suspense>
    </div>
  )
}

async function SuspenseBoundary() {
  const { userId, redirectToSignIn } = await getCurrentUser()
  if (userId == null) return redirectToSignIn()

  const purchases = await getPurchases(userId)

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-start">
        You have made no purchases yet
        <Button asChild size="lg">
          <Link href="/">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return <UserPurchaseTable purchases={purchases} />
}

async function getPurchases(userId: string) {
  "use cache"
  cacheTag(getPurchaseUserTag(userId))

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    where: eq(PurchaseTable.userId, userId),
    orderBy: desc(PurchaseTable.createdAt),
  })
}
