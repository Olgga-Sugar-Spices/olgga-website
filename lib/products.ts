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

  // Determine base URL safely
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      baseUrl = "http://localhost:3000";
    }
  }

  const url = `${baseUrl}/api/products?${searchParams.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch products: ${errorText}`);
  }

  return res.json() as Promise<Product[]>;
}