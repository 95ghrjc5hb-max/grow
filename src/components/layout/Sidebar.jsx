import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Bot,
  Package,
  Zap,
  Settings,
  LogOut
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Unified Inbox", path: "/inbox", icon: Inbox },
  { label: "Bot Training & Inventory", path: "/training", icon: Bot },
  { label: "Order Management", path: "/orders", icon: Package },
  { label: "Integrations", path: "/integrations", icon: Zap },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ onCloseMobile }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full p-4 justify-between select-none">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 p-[1px] shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-teal-400 fill-teal-400/20 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
              GROW
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-teal-400/70 -mt-1 uppercase">
              Next-Gen SaaS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`relative group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-teal-300 bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-transparent border border-teal-500/30 shadow-lg shadow-teal-500/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Active Indicator Accent Bar */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-r-full shadow-sm shadow-teal-400" />
                )}
                
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sign Out Action */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => {
            /* Insert your authentication logout handler here */
          }}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300 group"
        >
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
