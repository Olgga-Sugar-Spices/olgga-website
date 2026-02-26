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

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;

  const url = `${base}/api/products?${searchParams.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json() as Promise<Product[]>;
}