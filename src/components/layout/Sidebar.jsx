import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Inbox, Bot, Package, Settings, Zap, LogOut } from "lucide-react";
import { Grow } from "@/api/GrowClient";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Unified Inbox", path: "/inbox", icon: Inbox },
  { label: "Bot Training & Inventory", path: "/training", icon: Bot },
  { label: "Order Management", path: "/orders", icon: Package },
  { label: "Integrations", path: "/integrations", icon: Zap },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[hsl(220,18%,8%)] border-r border-border flex flex-col z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[hsl(220,20%,7%)]" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Grow
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => Grow.auth.logout("/")}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-4.5 h-4.5" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}