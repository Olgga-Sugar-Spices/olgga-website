import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#000000] to-[#8B6B1F] py-24 flex items-center px-8">
      <div className="max-w-2xl text-white">
        
        {/* Badge */}
        <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm">
          ✨ Premium Quality Guaranteed
        </span>

        {/* Heading */}
        <h1 className="text-5xl font-bold mt-6 leading-tight">
          The Finest <span className="text-yellow-300">Dryfryuits & Honey</span>
          <br /> From India
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-white/90">
          Handpicked from the best farms, our premium spices and organic
          sugars bring authentic flavors to your kitchen.
        </p>

        {/* CTA + Divider + Stats */}
        <div className="mt-8">
          
          {/* CTA BUTTON */}
          <Link href="/shop">
            <button className="bg-white text-[#8B3A12] px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
              Shop Now →
            </button>
          </Link>

          

        </div>

      </div>
    </section>
  );
}
