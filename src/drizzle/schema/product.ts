import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { CourseProductTable } from './courseProduct';

export const productStatuses = ["public", "private"] as const
export type ProductStatus = typeof productStatuses[number]
export const productStatusEnums = pgEnum("product_status", productStatuses)

export const ProductTable = pgTable("products", {
  id,
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  priceInDollars: integer().notNull(),
  status: productStatusEnums().notNull().default("private"),
  createdAt,
  updatedAt,
})

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
}))
