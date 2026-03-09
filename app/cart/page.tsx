"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-white">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-10 text-yellow-300">Shopping Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-6 bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
          >
            <Image src={item.image} alt={item.name} width={90} height={90} />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{item.name}</h3>
              <p className="text-gray-400">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-3 bg-[#222222] border border-[#333333] px-4 py-2 rounded-full text-white shrink-0">
              <button onClick={() => decreaseQty(item.id)} className="hover:text-yellow-400 transition">
                <Minus />
              </button>
              {item.quantity}
              <button onClick={() => increaseQty(item.id)} className="hover:text-yellow-400 transition">
                <Plus />
              </button>
            </div>
            <p className="font-bold text-white sm:ml-auto">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 border-t border-[#2A2A2A] pt-8">
        <p className="text-3xl font-bold text-yellow-300">Total: ₹{totalPrice}</p>
        <Link href="/checkout">
  <button className="mt-6 bg-yellow-500 text-black font-semibold px-10 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300">
    Proceed to Checkout
  </button>
</Link>

      </div>
    </div>
  );
}
