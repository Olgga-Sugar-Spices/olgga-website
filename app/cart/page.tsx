"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const {
    items,
    increaseQty,
    decreaseQty,
    totalPrice,
  } = useCart();

  const [orders, setOrders] = useState<any[]>([]);

  // FETCH ORDER HISTORY
  async function fetchOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setOrders(data || []);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* CART */}

      <h1 className="text-4xl font-bold mb-10 text-yellow-300">
        Shopping Cart
      </h1>

      {items.length === 0 ? (

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold text-white">
            Your cart is empty
          </h2>

          <Link href="/shop">
            <button className="mt-6 bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-400 transition">
              Continue Shopping
            </button>
          </Link>

        </div>

      ) : (

        <>
          <div className="space-y-6">

            {items.map((item) => (

              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-6 bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
              >

                <Image
                  src={item.image}
                  alt={item.name}
                  width={90}
                  height={90}
                />

                <div className="flex-1">

                  <h3 className="font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="text-gray-400">
                    ₹{item.price}
                  </p>

                </div>

                <div className="flex items-center gap-3 bg-[#222222] border border-[#333333] px-4 py-2 rounded-full text-white shrink-0">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="hover:text-yellow-400 transition"
                  >
                    <Minus />
                  </button>

                  {item.quantity}

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="hover:text-yellow-400 transition"
                  >
                    <Plus />
                  </button>

                </div>

                <p className="font-bold text-white sm:ml-auto">
                  ₹{item.price * item.quantity}
                </p>

              </div>
            ))}

          </div>

          {/* TOTAL */}

          <div className="mt-14 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 border-t border-[#2A2A2A] pt-8">

            <p className="text-3xl font-bold text-yellow-300">
              Total: ₹{totalPrice}
            </p>

            <Link href="/checkout">

              <button className="mt-6 bg-yellow-500 text-black font-semibold px-10 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300">

                Proceed to Checkout

              </button>

            </Link>

          </div>
        </>
      )}

      {/* ORDER HISTORY */}

      <div className="mt-24">

        <h2 className="text-4xl font-bold mb-10 text-yellow-300">
          Order History
        </h2>

        {orders.length === 0 ? (

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 text-center">

            <p className="text-gray-400">
              No previous orders found
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6"
              >

                <div className="flex flex-col sm:flex-row sm:justify-between gap-6">

                  <div>

                    <p className="text-sm text-gray-400">
                      Order ID
                    </p>

                    <p className="text-white font-semibold break-all">
                      {order.razorpay_order_id}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-400">
                      Amount
                    </p>

                    <p className="text-yellow-300 font-bold">
                      ₹{order.total_amount}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-400">
                      Status
                    </p>

                    <p className="text-green-400 capitalize font-semibold">
                      {order.status}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-400">
                      Date
                    </p>

                    <p className="text-white">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}