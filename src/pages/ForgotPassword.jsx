import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, Lock, Loader2, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/AuthContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  // State Management: Step 1 = Request OTP, Step 2 = Enter OTP & Set New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 Handler: Request OTP via Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccessMsg(`Security passcode dispatched to ${email}`);
      setStep(2);
    } else {
      setError(result.message || "Failed to dispatch recovery code. Please verify email.");
    }
    setLoading(false);
  };

  // Step 2 Handler: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setError("Passcode must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passcodes do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    const result = await resetPassword(email, otp, newPassword);

    if (result.success) {
      setSuccessMsg("Security credentials updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message || "Invalid or expired passcode verification.");
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      icon={<KeyRound className="w-6 h-6 text-teal-400" />}
      title={step === 1 ? "Reset Passcode" : "Set New Passcode"}
      subtitle={
        step === 1
          ? "Enter your registered email to receive a security passcode"
          : "Enter the 6-digit passcode sent to your inbox and enter a new password"
      }
      footer={
        <div>
          Remembered your passcode?{" "}
          <Link to="/login" className="text-teal-400 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      }
    >
      {/* Alert Notification Banners */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {step === 1 ? (
        /* STEP 1: Enter Email */
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
              Account Identity (Email)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Dispatching Code...
              </>
            ) : (
              <>
                Send Reset Passcode <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        /* STEP 2: Enter OTP & New Password */
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* OTP Code Input */}
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
              6-Digit Security Code
            </Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 text-center text-xl font-mono tracking-[0.4em] bg-slate-900/60 border-teal-500/40 text-teal-300 focus:border-teal-400"
              required
            />
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
              New Passcode
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 h-12 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-medium uppercase tracking-wider">
              Confirm New Passcode
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Credentials...
              </>
            ) : (
              "Update Passcode & Login"
            )}
          </Button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-xs text-center text-slate-500 hover:text-teal-400 transition-colors pt-1"
          >
            ← Resend passcode or change email
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
