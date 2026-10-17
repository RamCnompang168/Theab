"use client";

import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, HeartHandshake, X, Loader2 } from "lucide-react";
import { DoubleHeartLogo } from "./DoubleHeartLogo";
import { api } from "@/app/api-client";

interface AuthModalProps {
  onSuccess: (user: { name: string; email: string; avatar: string; role?: string }) => void;
  onUseDemo?: () => void;
  onClose?: () => void;
}

export function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Couple / Organizer");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await api.auth.register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });

        if (res.success && res.data?.user) {
          onSuccess(res.data.user);
        } else {
          setErrorMessage(res.error || "Registration failed. Please check your details.");
        }
      } else {
        const res = await api.auth.login({
          email: email.trim(),
          password,
        });

        if (res.success && res.data?.user) {
          onSuccess(res.data.user);
        } else {
          setErrorMessage(res.error || "Invalid credentials. Please verify your email and password.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 sm:my-10 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white/98 backdrop-blur-md rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden relative">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header Banner with Royal Maroon & Gold */}
        <div className="bg-gradient-to-r from-[#580509] via-[#450205] to-[#2D0204] p-6 text-center border-b border-[#D4AF37]/30 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#350204] border border-[#D4AF37]/50 flex items-center justify-center shadow-lg mb-3">
            <DoubleHeartLogo className="w-8 h-8 text-[#F5C842]" size={32} />
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37]/20 text-[#F5C842] border border-[#D4AF37]/40 mb-1.5">
            Step 1 of 2: Account Access
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isSignUp ? "Create Your Somboth Account" : "Welcome Back to Somboth"}
          </h2>
          <p className="text-xs text-[#FAF0D7]/80 mt-1 max-w-xs mx-auto">
            {isSignUp
              ? "Start by creating an organizer account to launch your wedding project"
              : "Sign in to access and manage your celebration project"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 bg-white">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5">
                Full Name <span className="text-[#580509]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] placeholder:text-slate-400 focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5">
              Email Address <span className="text-[#580509]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] placeholder:text-slate-400 focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Role selection (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Organizer Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all bg-white"
              >
                <option value="Couple / Organizer">Couple (Groom / Bride)</option>
                <option value="Wedding Planner">Professional Wedding Planner</option>
                <option value="Family Coordinator">Family Coordinator (Parents & Family)</option>
              </select>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5">
              Password <span className="text-[#580509]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] placeholder:text-slate-400 focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#580509] via-[#6D090E] to-[#580509] hover:from-[#450205] hover:to-[#450205] disabled:opacity-60 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F5C842]" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Continue to Create Project" : "Sign In & Open Dashboard"}</span>
                  <ArrowRight className="w-4 h-4 text-[#F5C842]" />
                </>
              )}
            </button>
          </div>

          {/* Toggle between Sign Up and Sign In */}
          <div className="pt-2 text-center border-t border-[#E8DFD8] text-xs text-[#6E6262]">
            <span>{isSignUp ? "Already have an account?" : "Need a new account?"}</span>{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage("");
              }}
              className="font-bold text-[#580509] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
