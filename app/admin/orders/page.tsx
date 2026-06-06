"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Package,
  IndianRupee,
  Truck,
  Clock3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  total_amount: number;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  // --- CORE STATE ---
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "purchases">("orders");

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- INVENTORY & PURCHASE STATE ---
  const [products, setProducts] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [purchaseForm, setPurchaseForm] = useState({
    productId: "",
    quantity: 0,
    costPrice: 0,
    supplier: "",
  });

  // --- ADMIN AUTH ---
  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }

  // --- FETCH FUNCTIONS ---
  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
    } else {
      setOrders(data || []);
    }
  }

  async function fetchInventory() {
    const { data, error } = await supabase
      .from("product") // Using lowercase based on DB pull
      .select("id, name, category, price, stock, image")
      .order("name", { ascending: true });

    if (!error && data) setProducts(data);
  }

  async function fetchPurchases() {
    const { data, error } = await supabase
      .from("Purchase")
      .select(`
        id, quantity, costPrice, supplier, createdAt,
        product (name)
      `)
      .order("createdAt", { ascending: false });

    if (!error && data) setPurchases(data);
  }

  // --- INITIALIZATION ---
  useEffect(() => {
    async function init() {
      setLoading(true);
      await checkAdmin();
      await fetchOrders();
      await fetchInventory();
      await fetchPurchases();
      setLoading(false);
    }

    init();
  }, []);

  // --- ORDER HANDLERS ---
  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update status");
      return;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }

  // --- PURCHASE HANDLER ---
  async function handleRecordPurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!purchaseForm.productId || purchaseForm.quantity <= 0) return;

    // 1. Record the Purchase
    const { error: purchaseError } = await supabase.from("Purchase").insert({
      productId: purchaseForm.productId,
      quantity: purchaseForm.quantity,
      costPrice: purchaseForm.costPrice,
      supplier: purchaseForm.supplier,
    });

    if (purchaseError) {
      console.error(purchaseError);
      alert("Failed to record purchase.");
      return;
    }

    // 2. Update Product Stock
    const product = products.find((p) => p.id === purchaseForm.productId);
    const newStock = (product?.stock || 0) + purchaseForm.quantity;

    const { error: stockError } = await supabase
      .from("product")
      .update({ stock: newStock })
      .eq("id", purchaseForm.productId);

    if (stockError) {
      console.error(stockError);
      alert("Purchase recorded, but failed to update stock.");
    } else {
      alert("Purchase recorded successfully!");
      setPurchaseForm({
        productId: "",
        quantity: 0,
        costPrice: 0,
        supplier: "",
      });
      fetchInventory(); // Refresh stock data
      fetchPurchases(); // Refresh ledger data
    }
  }

  // --- COMPUTED PROPERTIES ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.first_name.toLowerCase().includes(search.toLowerCase()) ||
        order.last_name.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.razorpay_order_id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "packed"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  if (!authorized && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* SIDEBAR + MAIN */}
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-[260px] bg-[#0D0D0D] border-r border-[#1F1F1F] flex-col p-6">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-black font-bold text-xl">
                O
              </div>
              <div>
                <h2 className="font-bold text-xl">Olgga Admin</h2>
                <p className="text-sm text-gray-400">Store Management</p>
              </div>
            </div>

            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full rounded-xl px-4 py-3 text-left font-semibold flex items-center gap-3 transition ${
                  activeTab === "orders"
                    ? "bg-yellow-500 text-black"
                    : "text-white hover:bg-[#1A1A1A]"
                }`}
              >
                <Package size={18} />
                Orders
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full rounded-xl px-4 py-3 text-left font-semibold flex items-center gap-3 transition ${
                  activeTab === "inventory"
                    ? "bg-yellow-500 text-black"
                    : "text-white hover:bg-[#1A1A1A]"
                }`}
              >
                <CheckCircle2 size={18} />
                Inventory
              </button>

              <button
                onClick={() => setActiveTab("purchases")}
                className={`w-full rounded-xl px-4 py-3 text-left font-semibold flex items-center gap-3 transition ${
                  activeTab === "purchases"
                    ? "bg-yellow-500 text-black"
                    : "text-white hover:bg-[#1A1A1A]"
                }`}
              >
                <Truck size={18} />
                Purchases
              </button>
            </nav>
          </div>

          <div className="mt-auto border-t border-[#1F1F1F] pt-6 text-sm text-gray-400">
            Secure Admin Panel
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10 overflow-hidden">
          
          {/* ======================= */}
          {/* ORDERS TAB */}
          {/* ======================= */}
          {activeTab === "orders" && (
            <>
              {/* TOPBAR */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-yellow-300">
                    Orders Dashboard
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Manage customer orders, payments, and fulfilment.
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={fetchOrders}
                    className="bg-[#171717] border border-[#2A2A2A] hover:border-yellow-500 transition px-5 py-3 rounded-xl flex items-center gap-2"
                  >
                    <RefreshCcw size={18} />
                    Refresh
                  </button>
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl flex items-center gap-2">
                    <ShieldCheck size={18} />
                    Secure Access
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <h2 className="text-3xl font-bold mt-2 text-yellow-300">
                        ₹{totalRevenue}
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                      <IndianRupee />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <h2 className="text-3xl font-bold mt-2">
                        {totalOrders}
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Package />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Orders</p>
                      <h2 className="text-3xl font-bold mt-2 text-orange-400">
                        {pendingOrders}
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                      <Clock3 />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Delivered</p>
                      <h2 className="text-3xl font-bold mt-2 text-green-400">
                        {deliveredOrders}
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                      <CheckCircle2 />
                    </div>
                  </div>
                </div>
              </div>

              {/* FILTERS */}
              <div className="bg-[#111111] border border-[#232323] rounded-3xl p-5 mb-10 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                <div className="relative flex-1 max-w-xl">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by customer, email, phone, order ID"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  {[
                    "all",
                    "paid",
                    "packed",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-5 py-3 rounded-2xl border transition capitalize ${
                        statusFilter === status
                          ? "bg-yellow-500 text-black border-yellow-500"
                          : "bg-[#1A1A1A] border-[#2A2A2A] hover:border-yellow-500"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* ORDERS TABLE */}
              <div className="bg-[#111111] border border-[#232323] rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead className="bg-[#151515] border-b border-[#232323]">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="px-6 py-5 font-medium">Customer</th>
                        <th className="px-6 py-5 font-medium">Contact</th>
                        <th className="px-6 py-5 font-medium">Order ID</th>
                        <th className="px-6 py-5 font-medium">Amount</th>
                        <th className="px-6 py-5 font-medium">Status</th>
                        <th className="px-6 py-5 font-medium">Date</th>
                        <th className="px-6 py-5 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-16 text-gray-400"
                          >
                            Loading orders...
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-16 text-gray-400"
                          >
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-[#1F1F1F] hover:bg-[#161616] transition"
                          >
                            <td className="px-6 py-6">
                              <div>
                                <p className="font-semibold text-white">
                                  {order.first_name} {order.last_name}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  {order.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-white">
                              {order.phone}
                            </td>
                            <td className="px-6 py-6 text-sm text-gray-300 break-all max-w-[260px]">
                              {order.razorpay_order_id}
                            </td>
                            <td className="px-6 py-6 font-bold text-yellow-300">
                              ₹{order.total_amount}
                            </td>
                            <td className="px-6 py-6">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order.id, e.target.value)
                                }
                                className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl px-4 py-2 outline-none"
                              >
                                <option value="paid">Paid</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-6 text-gray-300">
                              {new Date(order.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-6">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition"
                              >
                                View
                                <ChevronRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ======================= */}
          {/* INVENTORY TAB */}
          {/* ======================= */}
          {activeTab === "inventory" && (
            <div>
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-yellow-300">
                    Inventory Management
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Monitor live stock levels across all products.
                  </p>
                </div>
                <button
                  onClick={fetchInventory}
                  className="bg-[#171717] border border-[#2A2A2A] hover:border-yellow-500 transition px-5 py-3 rounded-xl flex items-center gap-2"
                >
                  <RefreshCcw size={18} />
                  Refresh
                </button>
              </div>

              <div className="bg-[#111111] border border-[#232323] rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#151515] border-b border-[#232323] text-gray-400 text-sm">
                    <tr>
                      <th className="px-6 py-5 font-medium">Product Name</th>
                      <th className="px-6 py-5 font-medium">Category</th>
                      <th className="px-6 py-5 font-medium">Selling Price</th>
                      <th className="px-6 py-5 font-medium">Current Stock</th>
                      <th className="px-6 py-5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#1F1F1F] hover:bg-[#161616] transition"
                      >
                        <td className="px-6 py-6 font-semibold text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-6 text-gray-400 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-6 text-yellow-300 font-bold">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-6 text-white text-lg">
                          {product.stock}
                        </td>
                        <td className="px-6 py-6">
                          {product.stock <= 5 ? (
                            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= */}
          {/* PURCHASES TAB */}
          {/* ======================= */}
          {activeTab === "purchases" && (
            <div>
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-yellow-300">
                    Restock Purchases
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Log incoming inventory. This automatically updates stock levels.
                  </p>
                </div>
              </div>

              {/* Purchase Entry Form */}
              <form
                onSubmit={handleRecordPurchase}
                className="bg-[#111111] border border-[#232323] p-6 rounded-3xl mb-10 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
              >
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Product
                  </label>
                  <select
                    required
                    value={purchaseForm.productId}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        productId: e.target.value,
                    })
                    }
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 outline-none focus:border-yellow-500 text-white"
                  >
                    <option value="">Select a product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Qty (Units)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={purchaseForm.quantity || ""}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={purchaseForm.costPrice || ""}
                    onChange={(e) =>
                      setPurchaseForm({
                        ...purchaseForm,
                        costPrice: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 outline-none focus:border-yellow-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-yellow-500 text-black font-semibold rounded-xl px-4 py-3 hover:bg-yellow-400 transition w-full"
                >
                  Log Purchase
                </button>
              </form>

              {/* Purchase Ledger Table */}
              <div className="bg-[#111111] border border-[#232323] rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#151515] border-b border-[#232323] text-gray-400 text-sm">
                    <tr>
                      <th className="px-6 py-5 font-medium">Date</th>
                      <th className="px-6 py-5 font-medium">Product</th>
                      <th className="px-6 py-5 font-medium">Quantity Added</th>
                      <th className="px-6 py-5 font-medium">Cost Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="border-b border-[#1F1F1F] hover:bg-[#161616] transition"
                      >
                        <td className="px-6 py-6 text-gray-400">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-6 font-semibold text-white">
                          {purchase.product?.name}
                        </td>
                        <td className="px-6 py-6 text-green-400 font-bold">
                          +{purchase.quantity}
                        </td>
                        <td className="px-6 py-6 text-white">
                          ₹{purchase.costPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#232323] rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-yellow-300">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={28} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                <p className="text-gray-400 mb-2">Customer</p>
                <p className="font-semibold text-xl">
                  {selectedOrder.first_name} {selectedOrder.last_name}
                </p>
                <p className="text-gray-300 mt-2">{selectedOrder.email}</p>
                <p className="text-gray-300 mt-1">{selectedOrder.phone}</p>
              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                <p className="text-gray-400 mb-2">Shipping Address</p>
                <p className="text-white leading-relaxed">
                  {selectedOrder.address}
                </p>
                <p className="text-gray-300 mt-2">{selectedOrder.pincode}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                  <p className="text-gray-400 mb-2">Payment ID</p>
                  <p className="break-all text-white text-sm">
                    {selectedOrder.razorpay_payment_id}
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                  <p className="text-gray-400 mb-2">Total Amount</p>
                  <p className="text-3xl font-bold text-yellow-300">
                    ₹{selectedOrder.total_amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}