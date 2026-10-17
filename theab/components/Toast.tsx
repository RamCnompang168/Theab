"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "info";
}

export function Toast({ message, isOpen, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl shadow-xl border border-[#EBE4E2] text-xs font-medium text-[#1F1A1A]">
        {type === "success" ? (
          <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-[#530303] shrink-0" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-[#6E6262] hover:text-[#1F1A1A] transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
