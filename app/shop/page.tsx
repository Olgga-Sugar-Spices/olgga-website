import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { search } = await searchParams; // ✅ IMPORTANT

  const products = await getProducts({
    search,
  });

  return (
    <section className="bg-[#000000] py-20">
      <div className="max-w-7xl mx-auto px-8">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-yellow-300">
            {search ? `Search results for "${search}"` : "All Products"}
          </h1>

          <p className="mt-2 text-white">
            {search
              ? "Showing matching products"
              : "Discover our complete range of premium spices and sugars"}
          </p>
        </div>

        <ProductGrid products={products} />

      </div>
    </section>
  );
}
