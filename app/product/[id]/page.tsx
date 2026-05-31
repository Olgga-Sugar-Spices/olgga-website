import { supabase } from "@/lib/supabase";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailsClient from "@/components/ProductDetailsClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data: product } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return (
      <div className="py-20 text-center text-white">
        Product not found
      </div>
    );
  }

  const { data: relatedProducts } = await supabase
    .from("product")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  return (
    <div className="bg-black min-h-screen">

      <ProductDetailsClient product={product} />

      <div className="max-w-7xl mx-auto px-8 py-20">

        <h2 className="text-3xl font-bold text-yellow-300 mb-10">
          You May Also Like
        </h2>

        <ProductGrid
          products={relatedProducts || []}
        />

      </div>

    </div>
  );
}