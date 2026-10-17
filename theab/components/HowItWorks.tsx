"use client";

import React from "react";
import { PlusCircle, UserCheck, PartyPopper, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const STEPS = [
  {
    step: "01",
    icon: PlusCircle,
    title: "Create Your Event Space",
    description:
      "Enter your occasion details, set dates, specify venues or online links, and customize the experience to match your celebration theme.",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Invite Guests & Align Vendors",
    description:
      "Share branded digital invitations, collect RSVPs, track dietary requirements, and sync key arrival times directly with your vendor team.",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Execute Flawlessly & Enjoy",
    description:
      "Run smooth day-of check-ins, send live schedule updates to guests, and host an unforgettable event without logistical anxiety.",
  },
];

const METRICS = [
  { label: "Events Planned", value: "12,500+" },
  { label: "Guest RSVPs Tracked", value: "480,000+" },
  { label: "Organizer Satisfaction", value: "4.9 / 5" },
  { label: "Average Time Saved", value: "18 hrs/event" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="my-8 sm:my-12 scroll-mt-20">
      {/* Container */}
      <ScrollReveal direction="up" duration={700}>
        <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-[0_12px_36px_rgba(0,0,0,0.1)] p-6 sm:p-10 lg:p-12 transition-shadow hover:shadow-[0_16px_45px_rgba(0,0,0,0.15)]">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509] text-[11px] font-bold tracking-wide uppercase mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Simple 3-Step Process</span>
            </div>
            <h2
              id="how-it-works-title"
              className="text-xl sm:text-3xl font-black text-[#580509] tracking-tight mb-2"
            >
              How Somboth Works
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6E6262] leading-relaxed">
              Planning memorable gatherings shouldn't feel overwhelming. Here is how Somboth guides you from inspiration to toast.
            </p>
          </div>

          {/* 3 Step Cards with Staggered Scroll Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              return (
                <ScrollReveal
                  key={s.step}
                  delay={index * 130}
                  direction="up"
                  duration={650}
                >
                  <div className="h-full relative p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex flex-col justify-between transition-all duration-300 hover:border-[#D4AF37]/60 hover:-translate-y-1 shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#580509]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-[#D4AF37] tracking-wider">
                          STEP {s.step}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1F1A1A] mb-1.5 tracking-tight">
                        {s.title}
                      </h3>

                      <p className="text-xs text-[#6E6262] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Key Metrics / Impact Bar */}
          <ScrollReveal delay={200} direction="fade">
            <div className="pt-8 border-t border-[#E8DFD8]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {METRICS.map((m) => (
                  <div key={m.label} className="p-3">
                    <div className="text-lg sm:text-2xl font-black text-[#580509] tracking-tight">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-[#6E6262] mt-0.5 font-bold">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
}
