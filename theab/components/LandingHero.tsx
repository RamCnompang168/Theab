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
  language: "en" | "km";
}

export function LandingHero({
  onCreateProjectClick,
  onExploreClick,
  user,
  hasProject,
  onOpenDashboard,
  language,
}: LandingHeroProps) {
  const text = language === "km" ? {
    badge: "ប្រព័ន្ធគ្រប់គ្រងពិធីមង្គលការ និងកម្មវិធីទំនើប",
    titleOne: "រៀបចំពិធីដោយគ្មានក្តីបារម្ភ។",
    titleTwo: "រៀបចំជាមួយ Somboth។",
    description: "ប្រព័ន្ធគ្រប់គ្រងដ៏ស្រស់ស្អាតសម្រាប់ពិធីនៅកម្ពុជា និងអន្តរជាតិ។ រៀបចំភ្ញៀវ តាមដានស្រោមសំបុត្រជា USD និងរៀល គ្រប់គ្រងថវិកា និងបង្កើតលិខិតអញ្ជើញឌីជីថល។",
    open: "បើកផ្ទាំងគ្រប់គ្រងពិធីមង្គលការ",
    create: "+ បង្កើតគម្រោងពិធីមង្គលការ",
    learn: "ស្វែងយល់ពី Somboth",
    rsvp: "បញ្ជាក់ការចូលរួមឆ្លាតវៃ", live: "បញ្ជាក់ភ្លាមៗ", gifts: "ចំណងដៃ USD និង KHR", ledger: "បញ្ជីស្រោមសំបុត្រ", budget: "គ្រប់គ្រងថវិកា", surprises: "គ្មានការភ្ញាក់ផ្អើល", invite: "លិខិតអញ្ជើញឌីជីថល", music: "ជាមួយតន្ត្រីខ្មែរ",
  } : {
    badge: "All-In-One Modern Wedding & Event Platform", titleOne: "Celebrate Without Stress.", titleTwo: "Plan with Somboth.", description: "The elegant management platform for Cambodian and international celebrations. Seamlessly organize guests, track cash envelopes in USD & Khmer Riel, control vendor budgets, and design interactive digital invitations.", open: "Open Your Wedding Dashboard", create: "+ Create Your Wedding Project", learn: "Learn What Somboth Can Do", rsvp: "Smart RSVPs", live: "Live confirmation", gifts: "USD & KHR Gifts", ledger: "Envelope ledger", budget: "Budget Control", surprises: "Zero surprises", invite: "E-Invitation", music: "With Khmer music",
  };
  return (
    <section className="pt-6 sm:pt-10 pb-8 sm:pb-12 text-center relative">
      <ScrollReveal direction="down" duration={650}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Top royal badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#580509]/80 border border-[#D4AF37]/50 text-[#F5C842] text-xs font-bold shadow-lg mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C842] animate-pulse" />
            <span>{text.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
            {text.titleOne} <br className="hidden sm:inline" />
            <span className="gold-gradient-text">{text.titleTwo}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xs sm:text-base text-[#FAF0D7]/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {text.description}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {hasProject ? (
              <button
                onClick={onOpenDashboard}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] hover:from-[#E5B842] hover:to-[#E5B842] text-[#350204] font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/40"
              >
                <span>{text.open}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onCreateProjectClick}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] hover:from-[#E5B842] hover:to-[#E5B842] text-[#350204] font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/40"
              >
                <Sparkles className="w-4 h-4 text-[#350204]" />
                <span>{text.create}</span>
              </button>
            )}

            <button
              onClick={onExploreClick}
              className="px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 text-[#FAF0D7] font-semibold text-xs sm:text-sm border border-[#D4AF37]/40 backdrop-blur-md transition-all cursor-pointer"
            >
              {text.learn} &darr;
            </button>
          </div>

          {/* Quick Pillars Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">{text.rsvp}</p>
                <p className="text-[9px] text-[#6E6262]">{text.live}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">{text.gifts}</p>
                <p className="text-[9px] text-[#6E6262]">{text.ledger}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">{text.budget}</p>
                <p className="text-[9px] text-[#6E6262]">{text.surprises}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-left flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1F1A1A]">{text.invite}</p>
                <p className="text-[9px] text-[#6E6262]">{text.music}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
