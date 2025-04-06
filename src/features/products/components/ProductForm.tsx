import { ProductStatus } from "@/drizzle/schema";

export function ProductForm({
  product,
  courses
}: {
  product?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInDollars: number;
    status: ProductStatus;
    courseIds: string[];
  }
  courses: {
    id: string
    name: string
  }[]
}) {
  return <div>ProductForm</div>;
}
