import { Truck, ShieldCheck, Gift, Sparkles } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="bg-[#000000] py-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Free Shipping */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 text-white p-4 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <p className="font-semibold text-white">
                Free Shipping
              </p>
              <p className="text-sm text-white">
                On orders above ₹500
              </p>
            </div>
          </div>

          {/* Authentic */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 text-white p-4 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-semibold text-white">
                100% Authentic
              </p>
              <p className="text-sm text-white">
                Quality guaranteed
              </p>
            </div>
          </div>

          {/* Gift Wrapping */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 text-white p-4 rounded-xl">
              <Gift size={24} />
            </div>
            <div>
              <p className="font-semibold text-white">
                Gift Wrapping
              </p>
              <p className="text-sm text-white">
                Free on gift boxes
              </p>
            </div>
          </div>

          {/* Fresh Products */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 text-white p-4 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-semibold text-white">
                Fresh Products
              </p>
              <p className="text-sm text-white">
                Packed on order
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
