import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="bg-[#000000] py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#8B6B1F] to-[#C9A227]">
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-10 p-12">

            {/* Left Content */}
            <div className="text-white">
              <span className="inline-block mb-4 bg-white/20 px-4 py-1 rounded-full text-sm">
                Limited Time Offer
              </span>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Get 20% OFF on Your <br /> First Order!
              </h2>

              <p className="mt-4 text-white/90 max-w-md">
                Use code <span className="font-semibold">SPICE20</span> at checkout.
                Valid for new customers only.
              </p>

              {/* CTA */}
              <Link href="/shop">
                <button className="mt-8 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-100 transition">
                  Shop Now
                </button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end">
              <img
                src="/categories/spices.png"
                alt="Spices"
                className="rounded-2xl w-full max-w-md object-cover shadow-2xl"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
