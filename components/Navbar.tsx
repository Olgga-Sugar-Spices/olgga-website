"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query)}`);
    setQuery("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  }

  return (
  <header className="bg-black text-white sticky top-0 z-50">
    
    {/* TOP BAR */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 gap-4">

        {/* LOGO */}
        <Link href="/" className="h-16 flex items-center shrink-0 overflow-visible">
          <img
            src="/categories/logo-transparent-png.png"
            alt="Olgga Logo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* SEARCH (hidden on very small screens) */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:block flex-1 relative max-w-xl"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 rounded-full bg-white text-black px-5 pr-14 text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center"
          >
            <Search size={16} />
          </button>
        </form>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 shrink-0 relative">

          {!user ? (
            <Link href="/login" className="text-sm hover:text-yellow-300">
              Login
            </Link>
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="text-sm hover:text-yellow-300"
            >
              {user.email?.split("@")[0]}
            </button>
          )}

          {open && user && (
            <div className="absolute right-0 top-10 bg-white text-black rounded-xl shadow-lg w-40">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </div>

    {/* CATEGORY BAR */}
    <div className="border-t border-[#8B6B1F]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <ul className="flex gap-6 py-3 text-sm whitespace-nowrap">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/shop/dryfruits">Dry Fruits</Link></li>
            <li><Link href="/shop/spices">Spices</Link></li>
            <li><Link href="/shop/spice-blends">Spice Blends</Link></li>
            <li><Link href="/shop/herbs">Herbs</Link></li>
            <li><Link href="/shop/salt">Salt</Link></li>
            <li><Link href="/shop/gift-boxes">Gift Boxes</Link></li>
          </ul>
        </div>
      </div>
    </div>

  </header>
);
}
