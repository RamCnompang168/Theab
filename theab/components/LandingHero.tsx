"use client";

import React from "react";
import { Sparkles, ArrowRight, Heart, Calendar, Users, Gift, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { DoubleHeartLogo } from "./DoubleHeartLogo";

interface LandingHeroProps {
  onCreateProjectClick: () => void;
  onExploreClick: () => void;
  user: { name: string; email: string; avatar: string } | null;
  hasProject: boolean;
  onOpenDashboard: () => void;
}

export function LandingHero({
  onCreateProjectClick,
  onExploreClick,
  user,
  hasProject,
  onOpenDashboard,
}: LandingHeroProps) {
  return (
    <section className="pt-6 sm:pt-10 pb-8 sm:pb-12 text-center relative">
      <ScrollReveal direction="down" duration={650}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Top royal badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#580509]/80 border border-[#D4AF37]/50 text-[#F5C842] text-xs font-bold shadow-lg mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C842] animate-pulse" />
            <span>All-In-One Modern Wedding &amp; Event Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
            Celebrate Without Stress. <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Plan with Somboth.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xs sm:text-base text-[#FAF0D7]/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            The elegant management platform for Cambodian and international celebrations. Seamlessly organize guests, track cash envelopes in <strong className="text-[#F5C842]">USD &amp; Khmer Riel</strong>, control vendor budgets, and design interactive digital invitations.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {hasProject ? (
              <button
                onClick={onOpenDashboard}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] hover:from-[#E5B842] hover:to-[#E5B842] text-[#350204] font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/40"
              >
                <span>Open Your Wedding Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onCreateProjectClick}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] hover:from-[#E5B842] hover:to-[#E5B842] text-[#350204] font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/40"
              >
                <Sparkles className="w-4 h-4 text-[#350204]" />
                <span>+ Create Your Wedding Project</span>
              </button>
            )}

            <button
              onClick={onExploreClick}
              className="px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 text-[#FAF0D7] font-semibold text-xs sm:text-sm border border-[#D4AF37]/40 backdrop-blur-md transition-all cursor-pointer"
            >
              Learn What Somboth Can Do &darr;
            </button>
          </div>

          {/* Quick Pillars Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">Smart RSVPs</p>
                <p className="text-[9px] text-[#6E6262]">Live confirmation</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">USD &amp; KHR Gifts</p>
                <p className="text-[9px] text-[#6E6262]">Envelope ledger</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">Budget Control</p>
                <p className="text-[9px] text-[#6E6262]">Zero surprises</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">E-Invitation</p>
                <p className="text-[9px] text-[#6E6262]">With Khmer music</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
