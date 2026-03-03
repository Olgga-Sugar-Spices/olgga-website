import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_25%,_rgba(0,0,0,0)_75%,_rgba(0,0,0,0.9)_100%),_linear-gradient(to_right,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0)_25%,_rgba(0,0,0,0)_75%,_rgba(0,0,0,0.9)_100%),_radial-gradient(ellipse_at_50%_50%,_#A67C00_20%,_#8B6B1F_45%,_#000000_100%)] min-h-[50vh] flex items-center">
  <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl text-white">

      {/* Badge */}
      <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs sm:text-sm">
        ✨ Premium Quality Guaranteed
      </span>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 leading-tight">
        The Finest{" "}
        <span className="text-yellow-300">
          Dryfruits & Honey
        </span>
        <br className="hidden sm:block" />
        From India
      </h1>

      {/* Description */}
      <p className="mt-6 text-base sm:text-lg text-white/90">
        Handpicked from the best farms, our premium spices and organic
        sugars bring authentic flavors to your kitchen.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Link href="/shop">
          <button className="bg-white text-[#8B3A12] px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
            Shop Now →
          </button>
        </Link>
      </div>

    </div>
  </div>
</section>
  );
}