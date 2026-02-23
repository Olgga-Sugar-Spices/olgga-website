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
    <header className="bg-[#000000] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 relative flex items-center justify-center overflow-visible">
  <img
    src="/categories/logo-transparent-png.png"
    alt="Olgga Logo"
    className="w-full h-full object-contain scale-[3.5] -translate-x-10"
  />
</div>


        </Link>

        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for spices, sugar, blends..."
            className="w-full h-12 rounded-full bg-white text-black px-6 pr-14 outline-none text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 w-9 h-9 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
          >
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-5 shrink-0 relative">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm hover:text-yellow-300 transition"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-sm hover:text-yellow-300 transition"
            >
              <User size={16} />
              <span>{user.email?.split("@")[0]}</span>
              <ChevronDown size={14} />
            </button>
          )}

          {open && user && (
            <div className="absolute right-0 top-12 bg-white text-black rounded-xl shadow-lg w-40 overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}

          <Link href="/cart" className="relative hover:text-yellow-300 transition">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="w-full bg-black border-b border-[#8B6B1F]/40">
  <div className="container mx-auto px-4">
    <ul className="flex gap-8 py-3 text-sm text-white">
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
    </header>
  );
}
