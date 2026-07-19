import React, { useState, useEffect } from "react";
import { Grow } from "@/api/GrowClient";
import { Package, Zap, MessageCircle, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/shared/StatCard";
import ChannelIcon from "@/components/shared/ChannelIcon";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [o, c, ch] = await Promise.all([
          Grow.entities.Order.list().catch(() => []),
          Grow.entities.Conversation.list().catch(() => []),
          Grow.entities.Channel.list().catch(() => [])
        ]);
        setOrders(o || []);
        setConversations(c || []);
        setChannels(ch || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const connectedChannels = channels.filter(c => c.status === "connected").length;
  const activeConversations = conversations.filter(c => c.ai_active).length;
  const revenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Orders" value={orders.length} icon={Package} color="teal" trend="+12% this month" />
        <StatCard title="Connected Channels" value={`${connectedChannels}/3`} icon={Zap} color="blue" />
        <StatCard title="Active AI Conversations" value={activeConversations} icon={MessageCircle} color="purple" />
        <StatCard title="Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} color="amber" trend="Lifetime total" />
      </div>

      {/* Orders Section */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <Link to="/orders" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <ChannelIcon channel={order.channel} />
                  <div>
                    <p className="text-sm font-medium text-white">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.product_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-400">${order.total_price}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
