import React from "react";
import { ShieldCheck, Cpu } from "lucide-react";

export default function AuthLayout({ children, icon, title, subtitle, footer }) {
  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows / Futuristic Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            <Cpu className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-300 to-teal-400 uppercase">
            GROW Core
          </span>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group overflow-hidden">
          {/* Subtle Top Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

          {/* Header Section */}
          <div className="text-center mb-8">
            {icon && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 mb-4 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                {icon}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          <div>{children}</div>

          {/* Footer Section inside card */}
          {footer && (
            <div className="mt-6 pt-6 border-t border-slate-800/60 text-center text-sm text-slate-400">
              {footer}
            </div>
          )}
        </div>

        {/* Bottom Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-500/70" />
          <span>256-Bit Cryptographic End-to-End Encryption</span>
        </div>
      </div>
    </div>
  );
}
