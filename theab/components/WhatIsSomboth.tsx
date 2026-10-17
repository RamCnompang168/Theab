"use client";

import React from "react";
import { Sparkles, CalendarHeart, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface WhatIsSombothProps {
  onOpenCreate: () => void;
}

export function WhatIsSomboth({ onOpenCreate }: WhatIsSombothProps) {
  return (
    <section id="about" aria-labelledby="what-is-somboth-title" className="my-8 sm:my-12 scroll-mt-20">
      <ScrollReveal direction="up" duration={700}>
        <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-[0_12px_36px_rgba(0,0,0,0.1)] p-6 sm:p-10 lg:p-12 transition-shadow hover:shadow-[0_16px_45px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Text Block */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509] text-[11px] font-bold tracking-wide uppercase mb-3.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>About Somboth</span>
              </div>

              <h2
                id="what-is-somboth-title"
                className="text-xl sm:text-3xl font-black text-[#580509] tracking-tight mb-3"
              >
                What is Somboth?
              </h2>

              <p className="text-xs sm:text-[14px] text-[#1F1A1A] leading-relaxed mb-3">
                <strong className="font-bold text-[#580509]">Somboth</strong> is an all-in-one, modern event planning and coordination platform crafted to turn complex celebration ideas into seamless, memorable experiences.
              </p>

              <p className="text-xs sm:text-[13px] text-[#6E6262] leading-relaxed mb-6">
                Whether you are organizing an intimate wedding, a milestone birthday gala, a corporate conference, or a community celebration, Somboth replaces messy spreadsheets and fragmented group chats with a single, calm, and elegant dashboard.
              </p>

              {/* Quick action button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenCreate}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#580509] to-[#750D13] hover:from-[#430205] hover:to-[#430205] text-[#F5C842] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-[#D4AF37]/40"
                >
                  <span>Start Planning with Somboth</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5C842]" />
                </button>
                <span className="text-[11px] text-[#6E6262]">
                  No credit card required &bull; Free instant setup
                </span>
              </div>
            </div>

            {/* Right Highlights Cards with Staggered Scroll Animation */}
            <div className="w-full lg:w-80 grid grid-cols-1 gap-3">
              <ScrollReveal delay={100} direction="left">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3 transition-all hover:border-[#D4AF37]/60 hover:-translate-y-0.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#580509]">
                    <CalendarHeart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1A1A]">Unified Timeline</h3>
                    <p className="text-[11px] text-[#6E6262] mt-0.5 leading-normal">
                      Coordinate venues, itineraries, and vendors in one synchronised schedule.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="left">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3 transition-all hover:border-[#D4AF37]/60 hover:-translate-y-0.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#580509]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1A1A]">Smart Guest Hospitality</h3>
                    <p className="text-[11px] text-[#6E6262] mt-0.5 leading-normal">
                      Live RSVP tracking, dietary preferences, and automatic reminder dispatches.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="left">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-3 transition-all hover:border-[#D4AF37]/60 hover:-translate-y-0.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1A1A]">Zero Surprises</h3>
                    <p className="text-[11px] text-[#6E6262] mt-0.5 leading-normal">
                      Real-time budget status and checklist validations before day-of execution.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
