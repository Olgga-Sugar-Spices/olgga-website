"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Truck, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductDetailsClient({
  product,
}: {
  product: any;
}) {
  const router = useRouter();

  const {
    items,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const cartItem = items.find(
    (i) => i.id === product.id
  );

  const discountPercentage =
    product.mrp && product.mrp > product.price
      ? Math.round(
          ((product.mrp - product.price) /
            product.mrp) *
            100
        )
      : 0;

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* IMAGE SECTION */}

        <div>
          <div className="bg-[#111111] rounded-3xl p-8 flex items-center justify-center min-h-[650px]">
            <Image
              src={product.image}
              alt={product.name}
              width={700}
              height={700}
              priority
              className="object-contain max-h-[600px] hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* DETAILS */}

        <div>

          <p className="text-yellow-400 uppercase tracking-[3px] text-sm">
            {product.category}
          </p>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mt-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mt-5">
            <span className="text-yellow-400 font-semibold">
              ⭐ {product.rating}
            </span>

            <span className="text-gray-400">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* PRICE */}

          <div className="mt-10">
            <div className="flex items-center gap-4 flex-wrap">

              <span className="text-5xl font-bold text-yellow-300">
                ₹{product.price}
              </span>

              {product.mrp > product.price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.mrp}
                  </span>

                  <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {product.weight && (
              <p className="mt-3 text-gray-400">
                Pack Size: {product.weight}
              </p>
            )}
          </div>

          {/* TRUST BADGES */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">

            <div className="bg-[#111111] border border-[#232323] rounded-2xl p-4 flex items-center gap-3">
              <Truck size={18} className="text-yellow-400" />
              <span className="text-sm text-white">
                Free Shipping
              </span>
            </div>

            <div className="bg-[#111111] border border-[#232323] rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck size={18} className="text-yellow-400" />
              <span className="text-sm text-white">
                Secure Payment
              </span>
            </div>

            <div className="bg-[#111111] border border-[#232323] rounded-2xl p-4 flex items-center gap-3">
              <Leaf size={18} className="text-yellow-400" />
              <span className="text-sm text-white">
                Natural Product
              </span>
            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Description
            </h3>

            <p className="text-gray-300 leading-8">
              {product.description}
            </p>
          </div>

          {/* BENEFITS */}

          <div className="mt-10 space-y-4">
            <p className="text-white text-lg">
              ✓ Premium Quality
            </p>

            <p className="text-white text-lg">
              ✓ Farm Fresh
            </p>

            <p className="text-white text-lg">
              ✓ No Artificial Preservatives
            </p>
          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-12 flex flex-col sm:flex-row gap-4">

            {!cartItem ? (
              <>
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="bg-yellow-500 text-black font-semibold px-10 py-4 rounded-full hover:bg-yellow-400 transition"
                >
                  Add To Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="border border-yellow-500 text-yellow-400 px-10 py-4 rounded-full hover:bg-yellow-500 hover:text-black transition"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between bg-white rounded-full px-8 py-4 w-[240px]">

                <button
                  onClick={() =>
                    decreaseQty(product.id)
                  }
                  className="text-black text-xl font-bold"
                >
                  -
                </button>

                <span className="font-bold text-black text-lg">
                  {cartItem.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQty(product.id)
                  }
                  className="text-black text-xl font-bold"
                >
                  +
                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}