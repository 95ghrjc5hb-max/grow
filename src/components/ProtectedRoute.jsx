import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';

// ==========================================
// 1. FUTURISTIC CORE LOADER (UI)
// ==========================================
const FuturisticLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#090d16] z-50 overflow-hidden">
    {/* Background Grid Illusion */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
    
    <div className="relative flex items-center justify-center w-28 h-28 mb-6">
      {/* Outer Ring (Teal) */}
      <div className="absolute inset-0 border-t-2 border-b-2 border-teal-500/80 rounded-full animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(20,184,166,0.3)]" />
      {/* Inner Ring (Indigo - Reverse Spin) */}
      <div className="absolute inset-3 border-r-2 border-l-2 border-indigo-500/80 rounded-full animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
      {/* Core Center Pulse */}
      <div className="absolute w-10 h-10 bg-teal-500/10 backdrop-blur-md rounded-full animate-pulse border border-teal-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.4)]">
        <Loader2 className="w-5 h-5 animate-spin text-teal-300" />
      </div>
    </div>
    
    <div className="text-xs font-mono tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]">
      Authenticating Core Session...
    </div>
  </div>
);

// ==========================================
// 2. SECURITY PROTECTION LOGIC
// ==========================================
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth, authChecked, checkUserAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // যদি Auth স্টেট চেক করা না থাকে, তবে ব্যাকএন্ডের সাথে টোকেন ভেরিফাই করবে
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  // স্টেজ ১: 백এন্ডের রেসপন্সের জন্য অপেক্ষা করার সময় ফিউচারিস্টিক লোডার দেখাবে (No Black Screen!)
  if (isLoadingAuth || !authChecked) {
    return <FuturisticLoader />;
  }

  // স্টেজ ২: যদি ইউজারের টোকেন না থাকে বা ইনভ্যালিড হয়, তবে তাকে লগইন পেজে পাঠাবে
  if (!isAuthenticated) {
    // state={{ from: location }} রাখার কারণ হলো: ইউজার যে পেজে যেতে চাচ্ছিল, লগইন করার পর সরাসরি সেখানে পাঠাবে
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // স্টেজ ৩: ভেরিফিকেশন সাকসেসফুল হলে ড্যাশবোর্ড (Outlet বা children) রেন্ডার করবে
  return children ? children : <Outlet />;
}
