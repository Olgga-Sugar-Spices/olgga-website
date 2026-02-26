import { Product } from "@/types/product";

export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.append("category", params.category);
  }

  if (params?.featured) {
    searchParams.append("featured", "true");
  }

  if (params?.search) {
    searchParams.append("search", params.search);
  }

  const res = await fetch(
    `/api/products?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json() as Promise<Product[]>;
}