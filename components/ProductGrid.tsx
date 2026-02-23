"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  weight: string;
  rating: number;
  reviews: number;
  image: string;
  isOrganic: boolean;
  isBestseller: boolean;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  const { items, addToCart, increaseQty, decreaseQty } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.map((product) => {
        const cartItem = items.find((i) => i.id === product.id);

        return (
          <div
            key={product.id}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative h-[260px] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

              <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                <Heart size={18} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition">
                {!cartItem ? (
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className="w-full bg-yellow-500 text-white py-3 rounded-full flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-white rounded-full px-4 py-2">
                    <button onClick={() => decreaseQty(product.id)}>
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">
                      {cartItem.quantity}
                    </span>
                    <button onClick={() => increaseQty(product.id)}>
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs uppercase text-yellow-500 tracking-wider">
                {product.category}
              </p>
              <h3 className="font-semibold text-lg text-white">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.weight}</p>
              <p className="mt-3 text-2xl font-bold text-white">
                ₹{product.price}
                {product.mrp > product.price && (
                  <span className="ml-2 text-sm line-through text-gray-400">
                    ₹{product.mrp}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
