"use client";

import React, { useState, useRef, useEffect } from "react";
import { DoubleHeartLogo } from "./DoubleHeartLogo";
import {
  Globe,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  Sparkles,
  Crown,
  Check,
  Home,
  ArrowRight,
  Plus,
} from "lucide-react";
import { ProjectData } from "./CreateProjectModal";

interface NavbarProps {
  viewMode: "landing" | "dashboard";
  onSetViewMode: (mode: "landing" | "dashboard") => void;
  user: { name: string; email: string; avatar: string } | null;
  project: ProjectData | null;
  onOpenAuth: () => void;
  onOpenCreateProject: () => void;
  onLogout: () => void;
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
];

export function Navbar({
  viewMode,
  onSetViewMode,
  user,
  project,
  onOpenAuth,
  onOpenCreateProject,
  onLogout,
}: NavbarProps) {
  const [selectedLang, setSelectedLang] = useState("English");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#350204]/95 backdrop-blur-md border-b border-[#D4AF37]/35 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Left Side: Brand Logo + Somboth Text */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            onClick={() => onSetViewMode("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="transition-transform group-hover:scale-105 duration-200">
              <DoubleHeartLogo className="w-6 h-6 text-[#F5C842]" size={24} />
            </div>
            <span className="text-[#F5C842] font-black text-lg sm:text-xl tracking-tight select-none drop-shadow">
              Somboth
            </span>
          </div>

          {/* Project Title Badge when in Dashboard */}
          {viewMode === "dashboard" && project && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#D4AF37]/30">
              <span className="text-[11px] font-bold text-[#FAF0D7] bg-[#580509]/80 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 truncate max-w-[200px]">
                {project.title}
              </span>
            </div>
          )}

          {/* If in Dashboard: Return to Homepage button */}
          {viewMode === "dashboard" && (
            <button
              onClick={() => onSetViewMode("landing")}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#FAF0D7]/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>About Somboth</span>
            </button>
          )}
        </div>

        {/* Center: Navigation Anchors for Landing Page */}
        {viewMode === "landing" && (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#FAF0D7]/80">
            <a href="#about" className="hover:text-[#F5C842] transition-colors">
              What is Somboth
            </a>
            <a href="#capabilities" className="hover:text-[#F5C842] transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-[#F5C842] transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-[#F5C842] transition-colors">
              FAQ
            </a>
          </nav>
        )}

        {/* Right Side: Action Button + Language + User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Rate indicator (when in Dashboard or large screen) */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] font-semibold text-[#F5C842] bg-[#580509]/60 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
            <span>$1 = 4,000 KHR</span>
          </div>

          {/* Primary CTA button on Landing Page */}
          {viewMode === "landing" && (
            <button
              onClick={onOpenCreateProject}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] hover:from-[#E5B842] hover:to-[#E5B842] text-[#350204] font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer border border-white/40"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Create Project</span>
            </button>
          )}

          {/* If on Landing and has active Project: "My Dashboard" shortcut */}
          {viewMode === "landing" && project && (
            <button
              onClick={() => onSetViewMode("dashboard")}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#580509] hover:bg-[#430205] text-[#FAF0D7] text-xs font-semibold border border-[#D4AF37]/40 transition-colors"
            >
              <span>My Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5C842]" />
            </button>
          )}

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-[#FAF0D7] bg-black/25 hover:bg-black/40 border border-[#D4AF37]/30 transition-all outline-none"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-[#F5C842]" />
              <span className="hidden sm:inline">{selectedLang}</span>
              <span className="sm:hidden">{selectedLang.slice(0, 2).toUpperCase()}</span>
              {isLangOpen ? (
                <ChevronUp className="w-3 h-3 text-[#D4AF37]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
              )}
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#D4AF37]/40 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-semibold text-[#6E6262] uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.name);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#1F1A1A] hover:bg-[#FAF7F2] hover:text-[#580509] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {selectedLang === lang.name && (
                      <Check className="w-3.5 h-3.5 text-[#580509]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile or Sign In */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="inline-flex items-center gap-2 p-0.5 sm:pr-2.5 rounded-full hover:bg-white/10 transition-all outline-none border border-transparent hover:border-[#D4AF37]/30"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5C842] text-[#350204] flex items-center justify-center font-black text-xs shadow-md ring-1 ring-white">
                  {user.avatar || "K"}
                </div>

                <span className="hidden sm:inline text-xs font-bold text-[#FAF0D7]">
                  {user.name}
                </span>

                {isProfileOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D4AF37]/40 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-[#1F1A1A]">{user.name}</p>
                    <p className="text-[11px] text-[#6E6262] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold bg-[#FBF6EC] text-[#580509] px-2 py-0.5 rounded-full border border-[#D4AF37]/35">
                      Active Organizer
                    </span>
                  </div>

                  <div className="py-0.5">
                    {project && (
                      <button
                        onClick={() => {
                          onSetViewMode("dashboard");
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-[#1F1A1A] hover:bg-[#FAF7F2] hover:text-[#580509] flex items-center gap-2"
                      >
                        <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Wedding Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSetViewMode("landing");
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-[#1F1A1A] hover:bg-[#FAF7F2] hover:text-[#580509] flex items-center gap-2"
                    >
                      <Home className="w-3.5 h-3.5 text-[#580509]" />
                      <span>About Somboth (Homepage)</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCreateProject();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-[#1F1A1A] hover:bg-[#FAF7F2] hover:text-[#580509] flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#580509]" />
                      <span>Create New Project</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF0D7] text-xs font-semibold border border-[#D4AF37]/35 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
