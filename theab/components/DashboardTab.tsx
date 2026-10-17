"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Gift,
  Receipt,
  TrendingUp,
  TrendingDown,
  Edit,
  Sparkles,
  ArrowUpRight,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { ProjectData } from "./CreateProjectModal";
import { ExpenseItem } from "./ExpensesTab";

interface DashboardTabProps {
  project: ProjectData;
  expenses: ExpenseItem[];
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
  declinedGuests: number;
  giftIncomeUSD: number;
  giftIncomeKHR: number;
  totalExpensesUSD: number;
  onUpdateEventInfo: () => void;
  onSwitchTab: (tab: "guests" | "expenses" | "gifts" | "template") => void;
}

export function DashboardTab({
  project,
  expenses,
  totalGuests,
  confirmedGuests,
  pendingGuests,
  declinedGuests,
  giftIncomeUSD,
  giftIncomeKHR,
  totalExpensesUSD,
  onUpdateEventInfo,
  onSwitchTab,
}: DashboardTabProps) {
  const budget = project.totalBudgetUSD || 0;
  const expensePercentage = budget > 0 ? Math.min(Math.round((totalExpensesUSD / budget) * 100), 100) : (totalExpensesUSD > 0 ? 100 : 0);
  const netBalanceUSD = giftIncomeUSD - totalExpensesUSD;
  const netBalanceKHR = netBalanceUSD * project.exchangeRateKHR;
  const confirmationRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0;

  // Format currency helpers
  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const fmtKHR = (n: number) =>
    new Intl.NumberFormat("en-US").format(Math.round(n)) + " KHR";

  // Dynamic Category Breakdown computed from real expenses
  const categoryColorMap: Record<string, string> = {
    "Venue & Food": "bg-[#580509]",
    "Attire & Beauty": "bg-[#D4AF37]",
    "Photo & Video": "bg-purple-600",
    "Decor & Flowers": "bg-emerald-600",
    "Music & Entertainment": "bg-blue-600",
    "Other": "bg-slate-500",
  };

  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    const cat = exp.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.actualAmount;
  }

  const categoryList = Object.entries(categoryTotals)
    .map(([name, cost]) => ({
      name,
      cost,
      pct: totalExpensesUSD > 0 ? Math.round((cost / totalExpensesUSD) * 100) : 0,
      color: categoryColorMap[name] || "bg-[#580509]",
    }))
    .sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-6">
      {/* Top Banner / Event Title & Quick Action */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509]">
              Live Celebration
            </span>
            <span className="text-xs text-[#6E6262]">
              Exchange Rate: 1 USD = {project.exchangeRateKHR.toLocaleString()} KHR
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1A1A] tracking-tight">
            {project.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#6E6262] mt-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#580509]" />
              <span>{project.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#580509]" />
              <span>{project.time}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#580509]" />
              <span className="truncate max-w-xs">{project.venue}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onUpdateEventInfo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap border border-[#D4AF37]/30"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Update Event Info</span>
        </button>
      </div>

      {/* 5 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Guests */}
        <div
          onClick={() => onSwitchTab("guests")}
          className="bg-white/95 rounded-2xl border border-[#E8DFD8] hover:border-[#D4AF37]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E6262]">Total Guests</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-sky-800 tracking-tight">
              {totalGuests}
            </div>
            <p className="text-[11px] text-[#6E6262] mt-0.5">
              Goal: {project.totalGuestsGoal} guests
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-sky-700 font-medium">
            <span>Manage guests</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* 2. Confirmed Attending */}
        <div
          onClick={() => onSwitchTab("guests")}
          className="bg-white/95 rounded-2xl border border-[#E8DFD8] hover:border-[#D4AF37]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E6262]">Confirmed Attend</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 tracking-tight">
              {confirmedGuests}
            </div>
            <p className="text-[11px] text-[#6E6262] mt-0.5">
              {confirmationRate}% attendance rate
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
            <span>{pendingGuests} pending responses</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* 3. Gift Income ($ & KHR) */}
        <div
          onClick={() => onSwitchTab("gifts")}
          className="bg-white/95 rounded-2xl border border-[#E8DFD8] hover:border-[#D4AF37]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E6262]">Gift Income</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-700 tracking-tight">
              {fmtUSD(giftIncomeUSD)}
            </div>
            <p className="text-[11px] text-purple-900 font-medium mt-0.5">
              {fmtKHR(giftIncomeKHR)}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-medium">
            <span>Envelopes registry</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* 4. Total Expense */}
        <div
          onClick={() => onSwitchTab("expenses")}
          className="bg-white/95 rounded-2xl border border-[#E8DFD8] hover:border-[#D4AF37]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E6262]">Expense</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#580509] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#580509] tracking-tight">
              {fmtUSD(totalExpensesUSD)}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#580509] h-full rounded-full transition-all duration-500"
                style={{ width: `${expensePercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[#6E6262] mt-1 flex items-center justify-between">
              <span>Budget: {fmtUSD(budget)}</span>
              <span className="font-bold text-[#580509]">{expensePercentage}%</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#580509] font-medium">
            <span>Track expenses</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* 5. Profit & Loss (Net) */}
        <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E6262]">Profit & Loss</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                netBalanceUSD >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {netBalanceUSD >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black tracking-tight ${
                netBalanceUSD >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {netBalanceUSD >= 0 ? "+" : ""}
              {fmtUSD(netBalanceUSD)}
            </div>
            <p className="text-[11px] text-[#6E6262] mt-0.5">
              {fmtKHR(netBalanceKHR)}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#6E6262]">
            <span>Income minus expenses</span>
            <span
              className={`font-bold ${
                netBalanceUSD >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {netBalanceUSD >= 0 ? "Surplus" : "Deficit"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Cards (Matching Image 2 flow with elevated luxury styling) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Guest Status Distribution */}
        <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1F1A1A]">Guest Status Distribution</h3>
              <span className="text-[11px] font-semibold text-[#8C7A70]">{totalGuests} Total</span>
            </div>

            {/* Visual Ring / Progress Breakdown */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-black text-[#580509]">{confirmedGuests}</span>
                  <span className="block text-[10px] text-[#6E6262]">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Legend with Khmer and English labels */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-[#1F1A1A]">Confirmed</span>
                </span>
                <span className="font-bold text-emerald-700">{confirmedGuests}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-[#1F1A1A]">Pending</span>
                </span>
                <span className="font-bold text-amber-700">{pendingGuests}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-[#1F1A1A]">Declined</span>
                </span>
                <span className="font-bold text-rose-700">{declinedGuests}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSwitchTab("guests")}
            className="w-full mt-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3E6E6] text-[#580509] text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-[#E8DFD8]"
          >
            <span>Open Guest Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Financial Overview */}
        <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1F1A1A]">Financial Overview</h3>
              <span className="text-[11px] font-semibold text-[#8C7A70]">USD ($)</span>
            </div>

            {/* Simple Bar Chart Visualization */}
            <div className="space-y-4 py-2">
              {/* Gift Income */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#1F1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Gift Income</span>
                  </span>
                  <span className="font-bold text-purple-700">{fmtUSD(giftIncomeUSD)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((giftIncomeUSD / (budget || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Estimated Budget */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#1F1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Budget Target</span>
                  </span>
                  <span className="font-bold text-amber-700">{fmtUSD(budget)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              {/* Actual Expense */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#1F1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#580509]"></span>
                    <span>Actual Spent</span>
                  </span>
                  <span className="font-bold text-[#580509]">{fmtUSD(totalExpensesUSD)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#580509] h-full rounded-full transition-all duration-500"
                    style={{ width: `${expensePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Net Balance */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#1F1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span>Net Balance</span>
                  </span>
                  <span
                    className={`font-bold ${netBalanceUSD >= 0 ? "text-teal-700" : "text-rose-700"}`}
                  >
                    {fmtUSD(netBalanceUSD)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.abs(netBalanceUSD) / 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSwitchTab("expenses")}
            className="w-full mt-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3E6E6] text-[#580509] text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-[#E8DFD8]"
          >
            <span>View Budget Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Expense Categories */}
        <div className="bg-white/95 rounded-2xl border border-[#E8DFD8] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1F1A1A]">Expense Categories</h3>
              <span className="text-[11px] font-semibold text-[#8C7A70]">Allocations</span>
            </div>

            {categoryList.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6E6262]">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No expenses recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Categories will appear here once you record wedding expenses.
                </p>
              </div>
            ) : (
              <div className="space-y-3 py-1">
                {categoryList.map((cat) => (
                  <div key={cat.name} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#1F1A1A] font-medium truncate max-w-[200px]">
                        {cat.name}
                      </span>
                      <span className="font-bold text-[#580509]">{fmtUSD(cat.cost)} ({cat.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${cat.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${cat.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onSwitchTab("template")}
            className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-[#580509] to-[#730D13] hover:from-[#430205] hover:to-[#430205] text-[#F5C842] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#D4AF37]/40 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Digital Invitation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
