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

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ADMIN AUTH
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

  async function fetchOrders() {
    setLoading(true);

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

    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      await checkAdmin();
      await fetchOrders();
    }

    init();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
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
      prev.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.first_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.last_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.razorpay_order_id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) =>
      o.status === "paid" ||
      o.status === "packed"
  ).length;

  const shippedOrders = orders.filter(
    (o) => o.status === "shipped"
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
                <h2 className="font-bold text-xl">
                  Olgga Admin
                </h2>

                <p className="text-sm text-gray-400">
                  Order Management
                </p>
              </div>

            </div>

            <nav className="space-y-3">

              <button className="w-full bg-yellow-500 text-black rounded-xl px-4 py-3 text-left font-semibold flex items-center gap-3">
                <Package size={18} />
                Orders
              </button>

            </nav>
          </div>

          <div className="mt-auto border-t border-[#1F1F1F] pt-6 text-sm text-gray-400">
            Secure Admin Panel
          </div>

        </aside>

        {/* MAIN CONTENT */}

        <main className="flex-1 p-6 lg:p-10 overflow-hidden">

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
                Secure Admin Access
              </div>

            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <div className="bg-[#111111] border border-[#232323] rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    Total Revenue
                  </p>

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
                  <p className="text-gray-400 text-sm">
                    Total Orders
                  </p>

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
                  <p className="text-gray-400 text-sm">
                    Pending Orders
                  </p>

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
                  <p className="text-gray-400 text-sm">
                    Delivered
                  </p>

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

          {/* TABLE */}

          <div className="bg-[#111111] border border-[#232323] rounded-3xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-[#151515] border-b border-[#232323]">

                  <tr className="text-left text-gray-400 text-sm">

                    <th className="px-6 py-5 font-medium">
                      Customer
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Contact
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Order ID
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Amount
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Date
                    </th>

                    <th className="px-6 py-5 font-medium">
                      Actions
                    </th>

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
                              updateStatus(
                                order.id,
                                e.target.value
                              )
                            }
                            className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl px-4 py-2 outline-none"
                          >
                            <option value="paid">
                              Paid
                            </option>

                            <option value="packed">
                              Packed
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </td>

                        <td className="px-6 py-6 text-gray-300">
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-6">

                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
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

                <p className="text-gray-400 mb-2">
                  Customer
                </p>

                <p className="font-semibold text-xl">
                  {selectedOrder.first_name} {selectedOrder.last_name}
                </p>

                <p className="text-gray-300 mt-2">
                  {selectedOrder.email}
                </p>

                <p className="text-gray-300 mt-1">
                  {selectedOrder.phone}
                </p>

              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">

                <p className="text-gray-400 mb-2">
                  Shipping Address
                </p>

                <p className="text-white leading-relaxed">
                  {selectedOrder.address}
                </p>

                <p className="text-gray-300 mt-2">
                  {selectedOrder.pincode}
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">

                  <p className="text-gray-400 mb-2">
                    Payment ID
                  </p>

                  <p className="break-all text-white text-sm">
                    {selectedOrder.razorpay_payment_id}
                  </p>

                </div>

                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">

                  <p className="text-gray-400 mb-2">
                    Total Amount
                  </p>

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
