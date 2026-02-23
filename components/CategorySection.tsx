import Link from "next/link";

export default function CategorySection() {
  return (
    <section className="bg-[#FFFDF6] py-20">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Explore our wide range of premium spices, sugars, and more
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Spices */}
          <Link href="/shop/spices">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/spices.png"
                alt="Spices"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-red-800/60 group-hover:bg-red-800/80 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Spices
                </span>
              </div>
            </div>
          </Link>

          {/* Sugar */}
          <Link href="/shop/sugar">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/sugar.png"
                alt="Sugar"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-yellow-700/60 group-hover:bg-yellow-700/80 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Sugar
                </span>
              </div>
            </div>
          </Link>

          {/* Spice Blends */}
          <Link href="/shop/spice-blends">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/spice-blends.png"
                alt="Spice Blends"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/70 to-orange-300/70 group-hover:from-pink-400/85 group-hover:to-orange-300/85 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Spice Blends
                </span>
              </div>
            </div>
          </Link>

          {/* Herbs */}
          <Link href="/shop/herbs">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/herbs.png"
                alt="Herbs"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/70 to-emerald-400/70 group-hover:from-green-500/85 group-hover:to-emerald-400/85 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Herbs
                </span>
              </div>
            </div>
          </Link>

          {/* Salt */}
          <Link href="/shop/salt">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/salt.png"
                alt="Salt"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 to-indigo-400/70 group-hover:from-blue-500/85 group-hover:to-indigo-400/85 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Salt
                </span>
              </div>
            </div>
          </Link>

          {/* Gift Boxes */}
          <Link href="/shop/gift-boxes">
            <div className="relative h-[360px] rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-500 group-hover:shadow-2xl">
              <img
                src="/categories/giftbox.png"
                alt="Gift Boxes"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/70 to-amber-400/70 group-hover:from-orange-500/85 group-hover:to-amber-400/85 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold group-hover:-translate-y-1 transition">
                  Gift Boxes
                </span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
