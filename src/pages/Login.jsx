import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Smart Redirection: Return to previous intended page or default to "/"
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Input Sanitization & Pre-validation
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Please enter both email and passcode.");
      return;
    }

    setLoading(true);

    // Call Centralized Login Engine from AuthContext
    const result = await login(cleanEmail, password);

    if (result.success) {
      // Smooth SPA Navigation without hard browser reload
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Invalid credentials. Access denied.");
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    setError("Google Provider Authentication requires active OAuth Production Keys.");
  };

  return (
    <AuthLayout
      icon={<LogIn className="w-6 h-6 text-teal-400" />}
      title="Welcome Back"
      subtitle="Enter your security credentials to access your dashboard"
      footer={
        <div>
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 font-medium hover:underline">
            Create one
          </Link>
        </div>
      }
    >
      {/* OAuth Google Provider Button */}
      <Button
        variant="outline"
        type="button"
        className="w-full h-12 bg-slate-900/40 border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-medium mb-6 transition-all"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      {/* Cybernetic Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#111827] px-3 text-slate-500 font-mono tracking-wider">Or</span>
        </div>
      </div>

      {/* Security Alert / Error Notification Box */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Credentials Pipeline */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
              Passcode
            </Label>
            <Link to="/forgot-password" className="text-xs text-teal-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating Core...
            </>
          ) : (
            <>
              Access Terminal <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
