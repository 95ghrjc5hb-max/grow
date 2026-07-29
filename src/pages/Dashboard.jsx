import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Zap, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  Loader2, 
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch real dashboard metrics
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("grow_secure_token");
      const response = await fetch("http://localhost:5000/api/dashboard/stats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || "Failed to load dashboard stats.");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to sync live server data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-100 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back. Here's your business performance overview.
          </p>
        </div>

        <Button
          onClick={fetchDashboardStats}
          disabled={loading}
          variant="outline"
          className="w-fit bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} />
          Sync Data
        </Button>
      </div>

      {/* Loader View */}
      {loading && !stats ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button onClick={fetchDashboardStats} size="sm" variant="ghost" className="text-xs text-red-400 underline">
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* 4 Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Orders */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-teal-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Total Orders</span>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</span>
                <p className="text-[11px] text-teal-400 mt-1 font-medium">{stats?.ordersGrowth || "+0% this month"}</p>
              </div>
            </div>

            {/* Metric 2: Connected Channels */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Connected Channels</span>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">
                  {stats?.connectedChannels || 0}<span className="text-lg text-slate-500">/{stats?.maxChannels || 3}</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Active social integrations</p>
              </div>
            </div>

            {/* Metric 3: Active AI Conversations */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Active AI Conversations</span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">{stats?.activeConversations || 0}</span>
                <p className="text-[11px] text-purple-400 mt-1 font-medium">Real-time handling</p>
              </div>
            </div>

            {/* Metric 4: Revenue */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Revenue</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">
                  ${stats?.revenue ? stats.revenue.toLocaleString() : "0"}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Lifetime total earnings</p>
              </div>
            </div>

          </div>

          {/* Recent Orders Section */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Orders</h2>
                <p className="text-xs text-slate-400">Latest transactions generated via AI Chatbots</p>
              </div>
              <Link to="/orders" className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table / List */}
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Channel</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 font-mono text-teal-400 font-medium">{order.id}</td>
                        <td className="py-3.5 text-slate-200 font-medium">{order.customer}</td>
                        <td className="py-3.5 text-slate-400">{order.channel}</td>
                        <td className="py-3.5 font-semibold text-white">${order.amount}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            order.status === "Completed" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : order.status === "Processing"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-slate-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No orders generated yet. Connected channels will display live incoming orders here.
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
