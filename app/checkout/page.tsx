"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

type Address = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  is_default: boolean;
};

export default function CheckoutPage() {
  const { totalPrice } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [showForm, setShowForm] = useState(false);

  async function fetchAddresses() {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false });

    setAddresses(data || []);
    if (data?.length) setSelected(data[0].id);
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function saveAddress() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const newAddress = {
      ...form,
      user_id: user.id,
      is_default: addresses.length === 0,
    };

    await supabase.from("addresses").insert(newAddress);

    setShowForm(false);
    setForm({});
    fetchAddresses();
  }

  async function setDefault(id: string) {
    await supabase.from("addresses").update({ is_default: false });
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    fetchAddresses();
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-20">

        <h1 className="text-4xl font-bold mb-10 text-yellow-300">
          Checkout
        </h1>

        {/* SAVED ADDRESSES */}
        {addresses.length > 0 && (
          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-semibold text-white">
              Saved Addresses
            </h2>

            {addresses.map((a) => (
              <div
                key={a.id}
                className={`bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl transition-all duration-300 ${
                  selected === a.id
                    ? "border-yellow-400 shadow-lg"
                    : ""
                }`}
              >
                <label className="flex gap-4 cursor-pointer">
                  <input
                    type="radio"
                    checked={selected === a.id}
                    onChange={() => setSelected(a.id)}
                    className="accent-yellow-400"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {a.first_name} {a.last_name}
                    </p>
                    <p className="text-gray-400">{a.address}</p>
                    <p className="text-gray-400">{a.pincode}</p>
                    <p className="text-gray-400">{a.phone}</p>
                  </div>
                </label>

                {!a.is_default && (
                  <button
                    onClick={() => setDefault(a.id)}
                    className="text-sm text-yellow-400 mt-3 hover:text-yellow-300 transition"
                  >
                    Make Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADD NEW ADDRESS */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 text-yellow-400 font-semibold hover:text-yellow-300 transition"
        >
          + Add New Address
        </button>

        {showForm && (
          <div className="grid grid-cols-2 gap-4 mb-10 bg-[#111111] p-6 rounded-2xl border border-[#2A2A2A]">
            {[
              ["first_name", "First Name"],
              ["last_name", "Last Name"],
              ["email", "Email"],
              ["phone", "Mobile"],
              ["pincode", "Pincode"],
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                className="bg-[#222222] border border-[#333333] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ))}

            <textarea
              placeholder="Full Address"
              className="bg-[#222222] border border-[#333333] text-white p-3 rounded-lg col-span-2 outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <button
              onClick={saveAddress}
              className="col-span-2 bg-yellow-500 text-black font-semibold py-3 rounded-full hover:bg-yellow-400 transition-all duration-300"
            >
              Save Address
            </button>
          </div>
        )}

        {/* PAYMENT SECTION */}
        <div className="border-t border-[#2A2A2A] pt-10 mt-10 flex justify-between items-center">
          <p className="text-3xl font-bold text-yellow-300">
            Total: ₹{totalPrice}
          </p>

          <button className="bg-yellow-500 text-black font-semibold px-10 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300">
            Proceed to Pay
          </button>
        </div>

      </div>
    </div>
  );
}