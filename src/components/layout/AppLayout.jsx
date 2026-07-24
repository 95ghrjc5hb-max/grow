import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-teal-500 selection:text-black">
      
      {/* 📱 1. Futuristic Mobile Top Navigation Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 bg-[#0d111a]/80 backdrop-blur-xl border-b border-white/10 md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 p-[1px] shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-teal-400 fill-teal-400/20 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
              GROW
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-teal-400/70 -mt-1 uppercase">
              Enterprise
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 📱 2. Mobile Native Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar Container */}
          <div className="relative w-72 h-full bg-[#0d111a] border-r border-white/10 shadow-2xl shadow-teal-500/10 z-10 flex flex-col">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="h-full overflow-y-auto">
              <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 💻 3. Desktop Fixed Futuristic Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 min-h-screen border-r border-white/10 bg-[#0d111a] flex-col sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </aside>

      {/* 🖥️ 4. Dynamic Main Viewport (Renders React Router Outlet or Children) */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gradient-to-br from-[#0a0d14] via-[#0d111a] to-[#0a0d14]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </div>
      </main>

    </div>
  );
}
