import { PageHeader } from "@/components/PageHeader"
import { db } from "@/drizzle/db"
import { getPurchaseGlobalTag } from "@/features/purchases/db/cache/purchases"
import { getUserGlobalTag } from "@/features/users/db/cache"
import { desc } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { PurchaseTable as DbPurchaseTable } from "@/drizzle/schema"
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="container my-6">
      <PageHeader title="Sales" />

      <PurchaseTable purchases={purchases} />
    </div>
  )
}

async function getPurchases() {
  "use cache"
  cacheTag(getPurchaseGlobalTag(), getUserGlobalTag())

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    orderBy: desc(DbPurchaseTable.createdAt),
    with: { user: { columns: { name: true } } },
  })
}
