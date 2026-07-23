import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X, Zap } from "lucide-react";

export default function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* 1. Mobile App Top-bar (Visible only on mobile screens) */}
      <header className="flex md:hidden items-center justify-between p-4 bg-[hsl(220,10%,8%)] border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[hsl(220,20%,7%)]" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Grow
          </span>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* 2. Mobile App Slide-Drawer (Appears when menu button is clicked) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-64 h-full bg-[hsl(220,10%,8%)] relative">
            {/* Close Drawer Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white z-50"
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
          {/* Overlay to close menu when clicked outside the drawer */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. PC / Desktop Sidebar (Always visible and fixed on larger screens) */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* 4. Main App Content Area */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
