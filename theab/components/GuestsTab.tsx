"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";

export interface GuestItem {
  id: string;
  name: string;
  nickname: string;
  group: "Family" | "Groom's Side" | "Bride's Side" | "Colleagues" | "VIPs";
  tags: string[];
  status: "Confirmed" | "Pending" | "Declined";
  wish: string;
  note: string;
  tableNo?: string;
}

interface GuestsTabProps {
  guests: GuestItem[];
  onAddGuest: (guest: GuestItem) => void;
  onDeleteGuest: (id: string) => void;
  onUpdateGuestStatus: (id: string, status: "Confirmed" | "Pending" | "Declined") => void;
}

export function GuestsTab({
  guests,
  onAddGuest,
  onDeleteGuest,
  onUpdateGuestStatus,
}: GuestsTabProps) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New guest form fields
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [group, setGroup] = useState<GuestItem["group"]>("Family");
  const [status, setStatus] = useState<GuestItem["status"]>("Confirmed");
  const [note, setNote] = useState("");
  const [wish, setWish] = useState("");
  const [tableNo, setTableNo] = useState("Table 01");

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.nickname.toLowerCase().includes(search.toLowerCase()) ||
      g.note.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === "All" || g.group === selectedGroup;
    const matchesStatus = selectedStatus === "All" || g.status === selectedStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://somboth.com";
    navigator.clipboard.writeText(`${origin}/?rsvp=invite`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGuest({
      id: "gst-" + Date.now(),
      name: name.trim(),
      nickname: nickname.trim() || "-",
      group,
      tags: [group, tableNo],
      status,
      wish: wish.trim() || "Wishing the couple immense joy, happiness, and eternal love!",
      note: note.trim() || `Assigned to ${tableNo}`,
      tableNo,
    });

    // Reset
    setName("");
    setNickname("");
    setWish("");
    setNote("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header & Title bar matching Image 3 */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F1A1A] tracking-tight">
              Guest Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509]">
              {guests.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#6E6262] mt-0.5">
            Organize guest invites, table assignments, and track digital RSVPs in real time.
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D4AF37]/40 hover:bg-[#FAF7F2] text-[#580509] text-xs font-semibold transition-colors cursor-pointer"
            title="Copy guest RSVP invitation link"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedLink ? "Link Copied!" : "Copy RSVP Link"}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#D4AF37]/40"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Guest</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, nickname, or table..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] placeholder:text-slate-400 focus:border-[#580509] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
          />
        </div>

        {/* Filter selects */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs text-[#6E6262]">
            <Filter className="w-3.5 h-3.5 text-[#580509]" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none focus:border-[#580509]"
            >
              <option value="All">All Groups</option>
              <option value="Family">Family</option>
              <option value="Groom's Side">Groom's Side</option>
              <option value="Bride's Side">Bride's Side</option>
              <option value="Colleagues">Colleagues</option>
              <option value="VIPs">VIPs</option>
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none focus:border-[#580509]"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white/98 rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#1F1A1A] font-bold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Nickname / Latin</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Table / Note</th>
                <th className="py-3 px-4">Wedding Blessing / Wish</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6E6262]">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No guests found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try adjusting your filters or click "+ Add New Guest" above.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-[#FAF7F2]/60 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-[#1F1A1A]">
                      {guest.name}
                    </td>

                    {/* Nickname */}
                    <td className="py-3 px-4 text-[#6E6262]">
                      {guest.nickname}
                    </td>

                    {/* Group */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FBF6EC] border border-[#D4AF37]/35 text-[#580509]">
                        {guest.group}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <select
                        value={guest.status}
                        onChange={(e) =>
                          onUpdateGuestStatus(
                            guest.id,
                            e.target.value as GuestItem["status"]
                          )
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${
                          guest.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : guest.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <option value="Confirmed">✓ Confirmed</option>
                        <option value="Pending">⏱ Pending</option>
                        <option value="Declined">✕ Declined</option>
                      </select>
                    </td>

                    {/* Table / Note */}
                    <td className="py-3 px-4 text-[#6E6262]">
                      <span className="font-medium text-[#1F1A1A]">
                        {guest.tableNo || "Table 01"}
                      </span>
                      {guest.note && (
                        <span className="block text-[10px] text-slate-400 truncate max-w-[150px]">
                          {guest.note}
                        </span>
                      )}
                    </td>

                    {/* Wish */}
                    <td className="py-3 px-4 text-[#6E6262] max-w-xs truncate">
                      <span className="italic text-[11px]">"{guest.wish}"</span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteGuest(guest.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#E8DFD8] flex items-center justify-between text-xs text-[#6E6262]">
          <span>
            Total: <strong className="text-[#580509]">{filteredGuests.length}</strong> records
          </span>
          <span className="text-[11px]">Showing up to 25 guests per page</span>
        </div>
      </div>

      {/* Add New Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#580509] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Add New Guest</h3>
                <p className="text-xs text-[#FAF0D7]/80">Register an invited guest to your celebration</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                    Guest Full Name <span className="text-[#580509]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dara Heng"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                    Nickname / Title
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. Dara / Brother"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as GuestItem["group"])}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none"
                  >
                    <option value="Family">Family</option>
                    <option value="Groom's Side">Groom's Side</option>
                    <option value="Bride's Side">Bride's Side</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="VIPs">VIPs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GuestItem["status"])}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Table Number</label>
                  <input
                    type="text"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    placeholder="e.g. Table 05"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                  Wedding Wish / Blessing Note
                </label>
                <input
                  type="text"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="e.g. Wishing you both a lifetime of happiness and prosperity!"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                  Special Notes (Dietary / Plus-One)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Vegetarian diet / Attending with spouse"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
