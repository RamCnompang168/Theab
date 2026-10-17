"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: EventItem) => void;
}

const CATEGORIES = [
  "Wedding",
  "Birthday Party",
  "Corporate Gala",
  "Conference",
  "Anniversary",
  "Social Gathering",
  "Fundraiser",
];

export function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onCreateEvent({
      id: "ev-" + Date.now(),
      title: title.trim(),
      category,
      date,
      time: time || "18:00",
      location: location.trim() || "Virtual / TBD",
      description: description.trim(),
    });

    // Reset form
    setTitle("");
    setCategory("Wedding");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-event-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#EBE4E2] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF7F5] border-b border-[#EBE4E2] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F3E6E6] border border-[#EBE4E2] flex items-center justify-center text-[#530303]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2
                id="create-event-title"
                className="text-sm sm:text-base font-bold text-[#530303] tracking-tight"
              >
                Create New Event
              </h2>
              <p className="text-[11px] text-[#6E6262]">
                Fill in the details for your Somboth event
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white text-[#6E6262] hover:text-[#1F1A1A] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 bg-white">
          {/* Event Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1">
              Event Title <span className="text-[#530303]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Gala Celebration"
              className="w-full px-3 py-2 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] placeholder:text-[#6E6262]/60 focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-[#530303]" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#530303]" />
                <span>Date</span> <span className="text-[#530303]">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#530303]" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#530303]" />
              <span>Location / Venue</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. The Grand Ballroom or Online Meeting"
              className="w-full px-3 py-2 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] placeholder:text-[#6E6262]/60 focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#1F1A1A] mb-1 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[#530303]" />
              <span>Description (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a quick summary or note for your guests..."
              className="w-full px-3 py-1.5 rounded-xl border border-[#EBE4E2] text-xs text-[#1F1A1A] placeholder:text-[#6E6262]/60 focus:border-[#530303] focus:ring-2 focus:ring-[#530303]/15 transition-all outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2.5 border-t border-[#EBE4E2] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#6E6262] hover:bg-[#FAF7F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#530303] hover:bg-[#3E0202] text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save & Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
