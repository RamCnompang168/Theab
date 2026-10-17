"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Heart,
  ArrowRight,
  ArrowLeft,
  Crown,
  X,
  Loader2,
} from "lucide-react";
import { api } from "@/app/api-client";

export interface ProjectData {
  id: string;
  userId?: string;
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  totalGuestsGoal: number;
  totalBudgetUSD: number;
  exchangeRateKHR: number;
  notes?: string;
}

interface CreateProjectModalProps {
  userName: string;
  onSuccess: (project: ProjectData) => void;
  onBackToAuth: () => void;
  onClose?: () => void;
}

export function CreateProjectModal({
  userName,
  onSuccess,
  onBackToAuth,
  onClose,
}: CreateProjectModalProps) {
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Phnom Penh");
  const [guestsGoal, setGuestsGoal] = useState<string>("");
  const [budgetUSD, setBudgetUSD] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(4000);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!groomName.trim() || !brideName.trim() || !venue.trim() || !date) {
      setErrorMessage("Please fill in Groom's Name, Bride's Name, Venue, and Wedding Date.");
      return;
    }

    setIsLoading(true);

    const projectPayload = {
      title: title.trim() || `${groomName.trim()} & ${brideName.trim()} Wedding Celebration`,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      date,
      time,
      venue: venue.trim(),
      city: city.trim() || "Phnom Penh",
      totalGuestsGoal: Number(guestsGoal) || 0,
      totalBudgetUSD: Number(budgetUSD) || 0,
      exchangeRateKHR: Number(exchangeRate) || 4000,
    };

    try {
      const res = await api.projects.create(projectPayload);
      if (res.success && res.data?.project) {
        onSuccess(res.data.project);
      } else {
        onSuccess({
          id: "proj-" + Date.now(),
          ...projectPayload,
        });
      }
    } catch {
      onSuccess({
        id: "proj-" + Date.now(),
        ...projectPayload,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-10 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white/98 backdrop-blur-md rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#580509] via-[#450205] to-[#2D0204] p-6 text-center border-b border-[#D4AF37]/30 relative">
          <button
            type="button"
            onClick={onBackToAuth}
            className="absolute left-5 top-5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF0D7] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch Account</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF0D7] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#350204] border border-[#D4AF37]/50 flex items-center justify-center shadow-lg mb-2.5">
            <Crown className="w-6 h-6 text-[#F5C842]" />
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37]/20 text-[#F5C842] border border-[#D4AF37]/40 mb-1.5">
            Step 2 of 2: Create Wedding Project
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Your Wedding Project
          </h2>
          <p className="text-xs text-[#FAF0D7]/80 mt-1 max-w-md mx-auto">
            Welcome, <span className="font-semibold text-[#F5C842]">{userName}</span>! Enter your wedding celebration parameters to activate your management dashboard.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 bg-white">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Couple Names (Groom & Bride) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#580509]" />
                <span>Groom's Name</span> <span className="text-[#580509]">*</span>
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Enter groom's full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#580509]" />
                <span>Bride's Name</span> <span className="text-[#580509]">*</span>
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Enter bride's full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5">
              Event Display Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank for automatic Couple's Wedding Celebration"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#580509]" />
                <span>Wedding Date</span> <span className="text-[#580509]">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#580509]" />
                <span>Reception Time</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Venue & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#580509]" />
                <span>Reception Hall / Venue</span> <span className="text-[#580509]">*</span>
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Grand Ballroom or Hotel Hall"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8C7A70]" />
                <span>City / Province</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Phnom Penh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Targets: Guests & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#580509]" />
                <span>Target Guests</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 200"
                value={guestsGoal}
                onChange={(e) => setGuestsGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#580509]" />
                <span>Budget ($ USD)</span>
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 5000"
                value={budgetUSD}
                onChange={(e) => setBudgetUSD(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1.5">
                Exchange Rate (KHR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-[#E8DFD8] text-xs sm:text-sm text-[#1F1A1A] focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C7A70]">
                  KHR/USD
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#580509] via-[#6D090E] to-[#580509] hover:from-[#450205] hover:to-[#450205] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/40 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F5C842]" />
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <span>Launch Wedding Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#F5C842]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
