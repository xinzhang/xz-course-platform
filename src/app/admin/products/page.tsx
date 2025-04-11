export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { ProductTable } from "@/features/products/components/ProductTable";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { getProductGlobalTag } from "@/features/products/db/cache/products";

import { ProductTable as DbProductTable } from "@/drizzle/schema/product";
import { asc, countDistinct, eq } from "drizzle-orm";
import { CourseProductTable, PurchaseTable } from "@/drizzle/schema";


export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className='container my-6'>
      <PageHeader title='Products'>
        <Button asChild>
          <Link href='/admin/products/new'>New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable products={products} />
    </div>
  );
}

async function getProducts() {
  "use cache";
  cacheTag(
    getProductGlobalTag(),
  );

  return db
    .select({
      id: DbProductTable.id,
      name: DbProductTable.name,
      status: DbProductTable.status,
      priceInDollars: DbProductTable.priceInDollars,
      description: DbProductTable.description,
      imageUrl: DbProductTable.imageUrl,
      coursesCount: countDistinct(CourseProductTable.courseId),
      customersCount: countDistinct(PurchaseTable.userId),
    })
    .from(DbProductTable)
    .leftJoin(
      PurchaseTable,
      eq(PurchaseTable.productId, DbProductTable.id)
    )
    .leftJoin(CourseProductTable, eq(CourseProductTable.productId, DbProductTable.id))
    .orderBy(asc(DbProductTable.name))
    .groupBy(DbProductTable.id);
}
