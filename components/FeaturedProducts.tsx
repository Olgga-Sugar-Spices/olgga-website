import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

export default async function FeaturedProducts() {
  const products = await getProducts({ featured: true });

  return (
    <section id = "featured" className="bg-[#000000] py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-yellow-300">
              Featured Products
            </h2>
            <p className="mt-2 text-white">
              Our most popular and highly rated products
            </p>
          </div>

          <a
            href="/shop"
            className="border border-yellow-300 text-yellow-300 px-5 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-yellow-300 hover:text-white transition"
          >
            View All →
          </a>
        </div>

        {/* PRODUCTS */}
        <ProductGrid products={products} />

      </div>
    </section>
  );
}
