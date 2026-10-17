"use client";

import React from "react";
import { DoubleHeartLogo } from "./DoubleHeartLogo";

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-[#EBE4E2] bg-white py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#EBE4E2]">
          {/* Brand & Mission */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <DoubleHeartLogo className="w-5.5 h-5.5 text-[#530303]" size={22} />
              <span className="text-[#530303] font-bold text-base sm:text-lg tracking-tight">
                Somboth
              </span>
            </div>
            <p className="text-xs text-[#6E6262] leading-relaxed">
              Modern event management platform designed to elevate private celebrations, weddings, and corporate gatherings.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs text-[#6E6262]">
            <div>
              <p className="font-bold text-[#1F1A1A] mb-2 uppercase text-[10px] tracking-wider">
                Product
              </p>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-[#530303] transition-colors">Event Dashboard</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">RSVP Tracker</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">Budget Manager</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#1F1A1A] mb-2 uppercase text-[10px] tracking-wider">
                Resources
              </p>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-[#530303] transition-colors">Event Templates</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">Planning Guides</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#1F1A1A] mb-2 uppercase text-[10px] tracking-wider">
                Legal
              </p>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-[#530303] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#530303] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright with static year */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6E6262]">
          <p>&copy; 2026 Somboth Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
