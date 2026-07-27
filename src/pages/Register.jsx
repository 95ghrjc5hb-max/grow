import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, CheckCircle2, Shield } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  // OTP States
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Minimal password strength calculator
  useEffect(() => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(Math.min(score, 4));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Verification Sent",
          description: `Please check your inbox at ${email}.`,
        });
        setShowOtp(true);
      } else {
        throw new Error(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    if (!otpCode || otpCode.length < 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("grow_secure_token", data.token);
        
        toast({
          title: "Account Verified",
          description: "Welcome to GROW! Your account is ready.",
        });
        navigate("/dashboard");
      } else {
        throw new Error(data.error || "Invalid verification code.");
      }
    } catch (err) {
      setError(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    toast({
      title: "Notice",
      description: "Google Sign-In will be available soon.",
    });
  };

 // Advanced & Futuristic Password Strength Color Logic
const getStrengthColor = () => {
  if (strength === 1) return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] border-rose-400/50";
  if (strength === 2) return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] border-amber-300/50";
  if (strength === 3) return "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] border-cyan-300/50";
  if (strength >= 4) return "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] border-emerald-300/50";
  return "bg-slate-800/80 border-slate-700/50";
};


  // OTP Verification View (Clean & Premium)
  if (showOtp) {
    return (
      <AuthLayout
        icon={<Shield className="w-6 h-6 text-emerald-400" />}
        title="Check your email"
        subtitle={`We've sent a 6-digit verification code to ${email}`}
      >
        {error && (
          <div className="mb-6 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center">
            <span className="block">{error}</span>
          </div>
        )}

        <div className="flex justify-center mb-8 mt-2">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={(val) => setOtpCode(val)}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index} 
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all rounded-md h-14 w-12" 
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          className="w-full h-11 bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all disabled:opacity-50"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify & Continue
            </>
          )}
        </Button>
      </AuthLayout>
    );
  }

  // Regular Registration View (Premium & Clean)
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GROW to manage your business effectively"
      footer={
        <p className="text-sm text-slate-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-200 hover:text-white transition-colors font-medium">
            Log in
          </Link>
        </p>
      }
    >
      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium mb-6 bg-slate-900/40 border-slate-700 hover:bg-slate-800 text-slate-200 transition-all"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-medium">
          <span className="bg-[#0d111a] px-3 text-slate-500">Or continue with email</span>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium">Work Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-11 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 transition-all placeholder:text-slate-600 rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-11 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 transition-all placeholder:text-slate-600 rounded-md"
              required
            />
          </div>
          
          {/* Subtle & Elegant Password Strength Meter */}
          {password.length > 0 && (
            <div className="flex gap-1 mt-2.5 h-1">
              <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? getStrengthColor() : 'bg-slate-800'}`} />
              <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? getStrengthColor() : 'bg-slate-800'}`} />
              <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? getStrengthColor() : 'bg-slate-800'}`} />
              <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 4 ? getStrengthColor() : 'bg-slate-800'}`} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-slate-300 font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-9 h-11 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 transition-all placeholder:text-slate-600 rounded-md"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all mt-6 rounded-md"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
