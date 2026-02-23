import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const products = await getProducts({ category });

  const readableCategory = category.replace(/-/g, " ");

  return (
    <section className="bg-[#000000] py-20">
      <div className="max-w-7xl mx-auto px-8">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-yellow-300 capitalize">
            {readableCategory}
          </h1>
          <p className="mt-2 text-white">
            Explore our premium range of {readableCategory}
          </p>
        </div>

        {/* PRODUCTS */}
        <ProductGrid products={products} />

      </div>
    </section>
  );
}
