"use client";

import React, { useState, useEffect } from "react";
import { ProjectData } from "./CreateProjectModal";
import { Calendar, Clock, MapPin, Save, Loader2, X } from "lucide-react";
import { api } from "@/app/api-client";

interface UpdateProjectModalProps {
  isOpen: boolean;
  project: ProjectData;
  onClose: () => void;
  onSave: (updated: ProjectData) => void;
}

export function UpdateProjectModal({
  isOpen,
  project,
  onClose,
  onSave,
}: UpdateProjectModalProps) {
  const [title, setTitle] = useState(project.title);
  const [groomName, setGroomName] = useState(project.groomName);
  const [brideName, setBrideName] = useState(project.brideName);
  const [date, setDate] = useState(project.date);
  const [time, setTime] = useState(project.time);
  const [venue, setVenue] = useState(project.venue);
  const [city, setCity] = useState(project.city);
  const [totalGuestsGoal, setTotalGuestsGoal] = useState(project.totalGuestsGoal);
  const [totalBudgetUSD, setTotalBudgetUSD] = useState(project.totalBudgetUSD);
  const [exchangeRateKHR, setExchangeRateKHR] = useState(project.exchangeRateKHR);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(project.title);
    setGroomName(project.groomName);
    setBrideName(project.brideName);
    setDate(project.date);
    setTime(project.time);
    setVenue(project.venue);
    setCity(project.city);
    setTotalGuestsGoal(project.totalGuestsGoal);
    setTotalBudgetUSD(project.totalBudgetUSD);
    setExchangeRateKHR(project.exchangeRateKHR);
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData: ProjectData = {
      ...project,
      title: title.trim(),
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      date,
      time,
      venue: venue.trim(),
      city: city.trim(),
      totalGuestsGoal: Number(totalGuestsGoal) || 200,
      totalBudgetUSD: Number(totalBudgetUSD) || 10000,
      exchangeRateKHR: Number(exchangeRateKHR) || 4000,
    };

    try {
      if (project.id) {
        await api.projects.update(project.id, updatedData);
      }
      onSave(updatedData);
    } catch {
      onSave(updatedData);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#580509] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
          <div>
            <h3 className="font-bold text-base text-white">Update Event Info</h3>
            <p className="text-xs text-[#FAF0D7]/80">Adjust event date, venue, guest target, and budget</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 bg-white">
          <div>
            <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
              Event Display Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                Groom's Name
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                Bride's Name
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#580509]" />
                <span>Wedding Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#580509]" />
                <span>Reception Time</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1A1A] mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#580509]" />
              <span>Venue / Reception Hall</span>
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                Target Guests
              </label>
              <input
                type="number"
                value={totalGuestsGoal}
                onChange={(e) => setTotalGuestsGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                Budget ($ USD)
              </label>
              <input
                type="number"
                value={totalBudgetUSD}
                onChange={(e) => setTotalBudgetUSD(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                Rate (KHR)
              </label>
              <input
                type="number"
                value={exchangeRateKHR}
                onChange={(e) => setExchangeRateKHR(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Update Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
