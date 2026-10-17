"use client";

import React, { useState } from "react";
import {
  Gift,
  Plus,
  Search,
  DollarSign,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Coins,
  Send,
} from "lucide-react";

export interface GiftItem {
  id: string;
  guestName: string;
  group: string;
  currency: "USD" | "KHR";
  amount: number;
  amountUSD: number;
  note: string;
  thankYouSent: boolean;
  receivedAt: string;
}

interface WeddingGiftTabProps {
  gifts: GiftItem[];
  exchangeRateKHR: number;
  onAddGift: (gift: GiftItem) => void;
  onDeleteGift: (id: string) => void;
  onToggleThankYou: (id: string) => void;
}

export function WeddingGiftTab({
  gifts,
  exchangeRateKHR,
  onAddGift,
  onDeleteGift,
  onToggleThankYou,
}: WeddingGiftTabProps) {
  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form fields
  const [guestName, setGuestName] = useState("");
  const [group, setGroup] = useState("Family");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [amount, setAmount] = useState<number>(50);
  const [note, setNote] = useState("Wishing you both a lifetime of happiness, good health, and eternal love!");

  const filteredGifts = gifts.filter((g) => {
    const matchesSearch =
      g.guestName.toLowerCase().includes(search.toLowerCase()) ||
      g.note.toLowerCase().includes(search.toLowerCase());
    const matchesCur = selectedCurrency === "All" || g.currency === selectedCurrency;
    return matchesSearch && matchesCur;
  });

  const totalUSD = gifts.reduce((acc, curr) => acc + curr.amountUSD, 0);
  const totalKHR = totalUSD * exchangeRateKHR;
  const avgGift = gifts.length > 0 ? totalUSD / gifts.length : 0;
  const thankYouCount = gifts.filter((g) => g.thankYouSent).length;

  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const fmtKHR = (n: number) =>
    new Intl.NumberFormat("en-US").format(Math.round(n)) + " KHR";

  const handleExportCSV = () => {
    const headers = ["Guest Name,Group,Currency,Amount,USD Equivalent,Wish Note,Thank You Sent\n"];
    const rows = gifts.map(
      (g) =>
        `"${g.guestName}","${g.group}","${g.currency}",${g.amount},${g.amountUSD},"${g.note}","${
          g.thankYouSent ? "Yes" : "No"
        }"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "somboth-wedding-gifts-ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const numAmount = Number(amount) || 0;
    const computedUSD =
      currency === "USD" ? numAmount : numAmount / (exchangeRateKHR || 4000);

    onAddGift({
      id: "gift-" + Date.now(),
      guestName: guestName.trim(),
      group,
      currency,
      amount: numAmount,
      amountUSD: computedUSD,
      note: note.trim() || "Wishing the happy couple a blessed marriage!",
      thankYouSent: false,
      receivedAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    setGuestName("");
    setAmount(50);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F1A1A] tracking-tight">
              Wedding Gift &amp; Envelope Registry
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509]">
              {gifts.length} Envelopes
            </span>
          </div>
          <p className="text-xs text-[#6E6262] mt-0.5">
            Record cash envelopes, blessing wishes, and track automated thank-you messages.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8DFD8] hover:bg-[#FAF7F2] text-[#1F1A1A] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#580509]" />
            <span>Export Gift Ledger</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#D4AF37]/40"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Gift Envelope</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Total Gifts ($ USD)</span>
          <div className="text-xl font-black text-purple-700 mt-1">{fmtUSD(totalUSD)}</div>
          <span className="text-[10px] text-slate-400">Total received in US Dollars</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Total Gifts (KHR Riel)</span>
          <div className="text-xl font-black text-purple-900 mt-1">{fmtKHR(totalKHR)}</div>
          <span className="text-[10px] text-slate-400">@ 1 USD = {exchangeRateKHR} KHR</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Average Gift Amount</span>
          <div className="text-xl font-black text-[#580509] mt-1">{fmtUSD(avgGift)}</div>
          <span className="text-[10px] text-slate-400">Per contributing guest</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Thank-You Notes Sent</span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {thankYouCount} / {gifts.length}
          </div>
          <span className="text-[10px] text-slate-400">
            {gifts.length > 0 ? Math.round((thankYouCount / gifts.length) * 100) : 0}% dispatched
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name or blessing wish..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none focus:border-[#580509]"
          >
            <option value="All">All Currencies ($ USD & KHR)</option>
            <option value="USD">USD ($) Only</option>
            <option value="KHR">Cambodian Riel (KHR) Only</option>
          </select>
        </div>
      </div>

      {/* Gifts Ledger Table */}
      <div className="bg-white/98 rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#1F1A1A] font-bold">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Amount Entered</th>
                <th className="py-3 px-4">USD Equivalent</th>
                <th className="py-3 px-4">Blessing Wish Note</th>
                <th className="py-3 px-4">Thank You Card</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60">
              {filteredGifts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6E6262]">
                    <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No gifts recorded yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click "+ Record Gift Envelope" to register cash envelopes and blessings.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGifts.map((gift) => (
                  <tr key={gift.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1F1A1A]">
                      {gift.guestName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FBF6EC] border border-[#D4AF37]/35 text-[#580509]">
                        {gift.group}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1F1A1A]">
                      {gift.currency === "USD"
                        ? fmtUSD(gift.amount)
                        : fmtKHR(gift.amount)}
                    </td>

                    <td className="py-3 px-4 font-bold text-purple-700">
                      {fmtUSD(gift.amountUSD)}
                    </td>

                    <td className="py-3 px-4 text-[#6E6262] max-w-xs truncate">
                      <span className="italic text-[11px]">"{gift.note}"</span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onToggleThankYou(gift.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          gift.thankYouSent
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#FBF6EC] hover:text-[#580509]"
                        }`}
                      >
                        {gift.thankYouSent ? "✓ Sent" : "Send Note"}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteGift(gift.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete gift entry"
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

        <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#E8DFD8] flex items-center justify-between text-xs text-[#6E6262]">
          <span>
            Total Envelopes: <strong className="text-[#580509]">{filteredGifts.length}</strong>
          </span>
          <span className="font-bold text-purple-700">
            Total Net Gift Income: {fmtUSD(totalUSD)} ({fmtKHR(totalKHR)})
          </span>
        </div>
      </div>

      {/* Add New Gift Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#580509] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Record Gift Envelope</h3>
                <p className="text-xs text-[#FAF0D7]/80">Enter cash envelope amount and guest blessing</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                  Guest Name <span className="text-[#580509]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Vanna Chhun"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
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
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      const cur = e.target.value as "USD" | "KHR";
                      setCurrency(cur);
                      if (cur === "KHR" && amount < 1000) setAmount(200000);
                      if (cur === "USD" && amount >= 1000) setAmount(50);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KHR">Riel (KHR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step={currency === "USD" ? "5" : "10000"}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                  Wedding Wish / Blessing Note
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Wishing you both a lifetime of happiness, good health, and eternal love!"
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
                  Record Envelope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
