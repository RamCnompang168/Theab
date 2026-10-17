"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Users2,
  Wallet,
  Briefcase,
  LayoutGrid,
  BellRing,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const CAPABILITIES = [
  {
    id: "scheduling",
    icon: CalendarDays,
    title: "Smart Scheduling & Timelines",
    description:
      "Craft minute-by-minute itineraries for wedding weekends, corporate keynotes, or multi-day galas. Sync dates seamlessly with Google Calendar and Apple iCal.",
    badge: "Itinerary Builder",
  },
  {
    id: "rsvp",
    icon: Users2,
    title: "Instant RSVP & Guest Tracking",
    description:
      "Send bespoke digital invitations and monitor confirmations in real time. Automatically capture dietary needs, meal choices, and plus-one counts.",
    badge: "Guest Management",
  },
  {
    id: "budget",
    icon: Wallet,
    title: "Budget & Expense Control",
    description:
      "Avoid budget overruns with clear category breakdowns. Track down payments, remaining vendor balances, and estimated versus actual spending.",
    badge: "Financial Clarity",
  },
  {
    id: "vendors",
    icon: Briefcase,
    title: "Vendor Collaboration Hub",
    description:
      "Centralize contacts, contracts, and arrival windows for florists, caterers, musicians, and venue managers so your team never misses a detail.",
    badge: "Partner Coordination",
  },
  {
    id: "seating",
    icon: LayoutGrid,
    title: "Seating & Floor Layouts",
    description:
      "Visualize table arrangements, balance guest groups, and assign seats with intuitive layout helpers that keep family and VIPs positioned perfectly.",
    badge: "Floor Planning",
  },
  {
    id: "reminders",
    icon: BellRing,
    title: "Automated Reminders & Day-Of Alerts",
    description:
      "Keep everyone aligned. Dispatch scheduled email & SMS reminders with dress codes, parking instructions, and instant weather or schedule adjustments.",
    badge: "Communication",
  },
];

export function HowSombothHelps() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section id="capabilities" aria-labelledby="how-somboth-helps-title" className="my-8 sm:my-12 scroll-mt-20">
      {/* Section Header */}
      <ScrollReveal direction="up" duration={600}>
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509] text-[11px] font-bold tracking-wide uppercase mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Core Capabilities</span>
          </div>
          <h2
            id="how-somboth-helps-title"
            className="text-xl sm:text-3xl font-black text-[#580509] tracking-tight mb-2"
          >
            What Somboth Can Help You With
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6E6262] leading-relaxed">
            From first concept to the final farewell toast, Somboth provides every tool you need to run stress-free events.
          </p>
        </div>
      </ScrollReveal>

      {/* 6 Capabilities Cards Grid with Staggered Scroll Transitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CAPABILITIES.map((item, index) => {
          const Icon = item.icon;
          const isSelected = activeCard === item.id;
          return (
            <ScrollReveal
              key={item.id}
              delay={index * 90}
              direction="up"
              duration={650}
            >
              <div
                onClick={() => setActiveCard(isSelected ? null : item.id)}
                className={`h-full bg-white/98 rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#580509] shadow-[0_12px_28px_rgba(88,5,9,0.15)] ring-1 ring-[#580509]/20"
                    : "border-[#E8DFD8] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-[#D4AF37]/60 hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center text-[#580509]">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FBF6EC] text-[#580509] border border-[#D4AF37]/35">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1F1A1A] mb-1.5 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#6E6262] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DFD8] flex items-center justify-between text-[11px]">
                  <span className="text-[#C5A059] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready to use</span>
                  </span>
                  <span className="text-[#580509] font-semibold hover:underline">
                    Explore feature &rarr;
                  </span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
