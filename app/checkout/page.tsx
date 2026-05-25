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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { totalPrice } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [showForm, setShowForm] = useState(false);

  // LOAD RAZORPAY SCRIPT
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);
  }, []);

  async function fetchAddresses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    setAddresses(data || []);

    if (data?.length) {
      setSelected(data[0].id);
    }
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
    await supabase
      .from("addresses")
      .update({ is_default: false });

    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    fetchAddresses();
  }

  // PAYMENT FUNCTION
  async function handlePayment() {
  try {
    if (!selected) {
      alert("Please select an address");
      return;
    }

    const selectedAddress = addresses.find(
      (a) => a.id === selected
    );

    // CREATE ORDER
    const res = await fetch("/api/create-order", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount: totalPrice,
      }),
    });

    const order = await res.json();

    if (!order.id) {
      alert("Failed to create order");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: "Olgga Sugar & Spices",

      description: "Order Payment",

      order_id: order.id,

      handler: async function (response: any) {
        try {
          // VERIFY PAYMENT
          const verifyRes = await fetch(
            "/api/verify-payment",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {

  // GET USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not found");
    return;
  }

  const selectedAddress = addresses.find(
    (a) => a.id === selected
  );

  // CREATE ORDER
  const { data: orderData, error: orderError } =
    await supabase
      .from("orders")
      .insert({
        user_id: user.id,

        razorpay_order_id:
          response.razorpay_order_id,

        razorpay_payment_id:
          response.razorpay_payment_id,

        total_amount: totalPrice,

        status: "paid",

        first_name: selectedAddress?.first_name,
        last_name: selectedAddress?.last_name,
        email: selectedAddress?.email,
        phone: selectedAddress?.phone,
        address: selectedAddress?.address,
        pincode: selectedAddress?.pincode,
      })
      .select()
      .single();

  if (orderError || !orderData) {
    console.error(orderError);

    alert("Failed to save order");

    return;
  }

  // GET CART ITEMS
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      quantity,
      product:product_id (
        id,
        name,
        price
      )
    `)
    .eq("user_id", user.id);

  // SAVE ORDER ITEMS
  if (cartItems?.length) {

    const orderItems = cartItems.map(
      (item: any) => ({
        order_id: orderData.id,

        product_id: item.product.id,

        product_name: item.product.name,

        price: item.product.price,

        quantity: item.quantity,
      })
    );

    await supabase
      .from("order_items")
      .insert(orderItems);
  }

  // CLEAR CART
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  alert("Payment Successful!");

  window.location.href = "/cart";
}else {
            alert("Payment Verification Failed");
          }

        } catch (err) {
          console.error(err);

          alert("Verification failed");
        }
      },

      prefill: {
        name: `${selectedAddress?.first_name} ${selectedAddress?.last_name}`,

        email: selectedAddress?.email,

        contact: selectedAddress?.phone,
      },

      notes: {
        address: selectedAddress?.address,
      },

      theme: {
        color: "#EAB308",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (err) {
    console.error(err);

    alert("Something went wrong");
  }
}

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

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
                <label className="flex flex-col sm:flex-row gap-4 cursor-pointer">

                  <input
                    type="radio"
                    checked={selected === a.id}
                    onChange={() => setSelected(a.id)}
                    className="accent-yellow-400 mt-1 shrink-0"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      {a.first_name} {a.last_name}
                    </p>

                    <p className="text-gray-400">
                      {a.address}
                    </p>

                    <p className="text-gray-400">
                      {a.pincode}
                    </p>

                    <p className="text-gray-400">
                      {a.phone}
                    </p>
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

        {/* ADD ADDRESS BUTTON */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 text-yellow-400 font-semibold hover:text-yellow-300 transition"
        >
          + Add New Address
        </button>

        {/* ADDRESS FORM */}
        {showForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 bg-[#111111] p-6 rounded-2xl border border-[#2A2A2A]">

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
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
              />
            ))}

            <textarea
              placeholder="Full Address"
              className="bg-[#222222] border border-[#333333] text-white p-3 rounded-lg sm:col-span-2 outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

            <button
              onClick={saveAddress}
              className="sm:col-span-2 bg-yellow-500 text-black font-semibold py-3 rounded-full hover:bg-yellow-400 transition-all duration-300"
            >
              Save Address
            </button>
          </div>
        )}

        {/* PAYMENT SECTION */}
        <div className="border-t border-[#2A2A2A] pt-10 mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">

          <p className="text-3xl font-bold text-yellow-300">
            Total: ₹{totalPrice}
          </p>

          <button
            onClick={handlePayment}
            className="bg-yellow-500 text-black font-semibold px-8 sm:px-10 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 w-full sm:w-auto"
          >
            Proceed to Pay
          </button>

        </div>

      </div>
    </div>
  );
}