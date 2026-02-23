"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 🔹 Fetch cart from Supabase
  async function fetchCart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        quantity,
        product:product_id (
          id,
          name,
          price,
          image
        )
      `
      );

    if (error) {
      console.error("Fetch cart error:", error);
      setItems([]);
      return;
    }

    const formatted: CartItem[] =
      data?.map((row: any) => ({
        id: row.product.id,
        name: row.product.name,
        price: row.product.price,
        image: row.product.image,
        quantity: row.quantity,
      })) || [];

    setItems(formatted);
  }

  // 🔹 Load cart on mount + auth change
  useEffect(() => {
    fetchCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Add to cart
  async function addToCart(product: Omit<CartItem, "quantity">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("user_id", user.id)
      .eq("product_id", product.id);
  } else {
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1,
    });
  }

  fetchCart();
}


  // 🔹 Increase quantity
  async function increaseQty(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    await supabase
      .from("cart_items")
      .update({ quantity: item.quantity + 1 })
      .eq("user_id", user.id)
      .eq("product_id", id);

    fetchCart();
  }

  // 🔹 Decrease quantity
  async function decreaseQty(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
    } else {
      await supabase
        .from("cart_items")
        .update({ quantity: item.quantity - 1 })
        .eq("user_id", user.id)
        .eq("product_id", id);
    }

    fetchCart();
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQty,
        decreaseQty,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
