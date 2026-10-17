"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setMessage("");
      setIsSent(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Support Button in Warm Champagne Gold (#C5A059) */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#B38E46] active:scale-95 text-white font-medium text-xs sm:text-[13px] px-4 py-2.5 rounded-full shadow-[0_6px_20px_rgba(197,160,89,0.38)] hover:shadow-[0_8px_24px_rgba(197,160,89,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-3 focus:ring-[#C5A059]/40"
          aria-expanded={isOpen}
          aria-label="Open customer support widget"
        >
          <MessageSquare className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
          <span className="font-semibold tracking-normal">Support</span>
          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>

        {/* Support Chat / Help Card Popup */}
        {isOpen && (
          <div className="absolute bottom-14 right-0 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white rounded-2xl shadow-[0_16px_40px_rgba(31,26,26,0.12)] border border-[#EBE4E2] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 z-50">
            {/* Header in Deep Burgundy #530303 */}
            <div className="bg-[#530303] px-4 py-3.5 text-white flex items-center justify-between border-b border-[#3E0202]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-[#C5A059]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm leading-tight text-white">
                    Somboth Support
                  </h3>
                  <p className="text-[11px] text-rose-200/80">We typically reply in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                aria-label="Close support dialog"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto bg-white">
              {/* Quick links & FAQ items */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-[#6E6262] uppercase tracking-wider">
                  Quick Assistance
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#faq-events"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Opening Somboth Event Creation Guide...");
                    }}
                    className="p-2 rounded-xl bg-[#FAF7F5] hover:bg-[#F3E6E6] border border-[#EBE4E2] text-[11px] font-medium text-[#1F1A1A] flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3 h-3 text-[#530303]" />
                    <span>How to add event</span>
                  </a>
                  <a
                    href="#support-email"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "mailto:support@somboth.com";
                    }}
                    className="p-2 rounded-xl bg-[#FAF7F5] hover:bg-[#F3E6E6] border border-[#EBE4E2] text-[11px] font-medium text-[#1F1A1A] flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-[#C5A059]" />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>

              {/* Message form */}
              <div className="border-t border-[#EBE4E2] pt-2.5">
                <p className="text-[11px] font-semibold text-[#6E6262] mb-1.5">
                  Send us a direct message
                </p>

                {isSent ? (
                  <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#C5A059]/40 text-center">
                    <CheckCircle2 className="w-5 h-5 text-[#530303] mx-auto mb-1 animate-bounce" />
                    <p className="text-xs font-semibold text-[#1F1A1A]">
                      Message sent successfully!
                    </p>
                    <p className="text-[11px] text-[#6E6262] mt-0.5">
                      Our support team will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi! How can we assist you with Somboth today?"
                      rows={3}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#FAF7F5] border border-[#EBE4E2] text-[#1F1A1A] placeholder:text-[#6E6262]/60 focus:bg-white focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#6E6262]">
                        Live chat 24/7 available
                      </span>
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#530303] hover:bg-[#3E0202] disabled:opacity-40 disabled:hover:bg-[#530303] text-white text-[11px] font-semibold shadow-2xs transition-all cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#FAF7F5] px-4 py-2 border-t border-[#EBE4E2] flex items-center justify-between text-[10px] text-[#6E6262]">
              <span>Somboth Help Desk</span>
              <span className="flex items-center gap-1 text-[#C5A059] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                Online
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
