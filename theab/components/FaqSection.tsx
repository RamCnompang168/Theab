"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const FAQS = [
  {
    q: "What types of events can I manage with Somboth?",
    a: "Somboth accommodates events of every scale: weddings, engagement dinners, milestone birthdays, corporate summits, charity galas, family reunions, and workshops.",
  },
  {
    q: "Can I collaborate with co-planners, coordinators, or vendors?",
    a: "Yes! You can invite co-hosts with customized permission levels (view-only or full editor) so your wedding planner, caterer, and family members stay completely in sync.",
  },
  {
    q: "How do guests receive their invites and submit RSVPs?",
    a: "You can share a personalized web link, send branded emails, or export printable QR invitation cards. Guests can confirm attendance, plus-ones, and dietary restrictions with a single tap.",
  },
  {
    q: "Can I track cash envelopes in both USD and Khmer Riel?",
    a: "Yes! Somboth has a dedicated Wedding Gift Registry specifically tailored for weddings where cash gifts and envelopes can be entered in USD ($) or Cambodian Riel (KHR) with automatic live exchange rate conversions.",
  },
  {
    q: "Can I export my event data, guest lists, and budgets?",
    a: "Absolutely. With one click you can export clean spreadsheets (CSV/Excel) or formatted PDFs for caterers, venue managers, and seating charts.",
  },
  {
    q: "Is Somboth free to start?",
    a: "Yes, you can create and manage events immediately for free. Premium organizer options with custom branding and unlimited SMS alerts are also available.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="my-8 sm:my-12 scroll-mt-20">
      <ScrollReveal direction="up" duration={700}>
        <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-[0_12px_36px_rgba(0,0,0,0.1)] p-6 sm:p-10 lg:p-12 transition-shadow hover:shadow-[0_16px_45px_rgba(0,0,0,0.15)]">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509] text-[11px] font-bold tracking-wide uppercase mb-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Got Questions?</span>
            </div>
            <h2
              id="faq-title"
              className="text-xl sm:text-3xl font-black text-[#580509] tracking-tight mb-2"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6E6262]">
              Everything you need to know about planning your wedding with Somboth.
            </p>
          </div>

          {/* Accordion */}
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <ScrollReveal
                  key={faq.q}
                  delay={index * 60}
                  direction="up"
                  duration={500}
                >
                  <div className="rounded-2xl border border-[#E8DFD8] bg-[#FAF7F2] overflow-hidden transition-all hover:border-[#D4AF37]/50">
                    <button
                      onClick={() => toggle(index)}
                      className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-[13px] font-bold text-[#1F1A1A] hover:text-[#580509] transition-colors focus:outline-none cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#580509] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6E6262] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-3.5 pt-1 text-xs text-[#6E6262] leading-relaxed border-t border-[#E8DFD8]/70 bg-white animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
