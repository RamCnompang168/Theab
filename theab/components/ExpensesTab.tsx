"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  Receipt,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export interface ExpenseItem {
  id: string;
  name: string;
  category: "Venue & Food" | "Attire & Beauty" | "Photo & Video" | "Decor & Flowers" | "Music & Entertainment" | "Other";
  budgetAmount: number;
  actualAmount: number;
  status: "Paid" | "Deposit" | "Pending";
  description: string;
  vendorPhone?: string;
}

interface ExpensesTabProps {
  expenses: ExpenseItem[];
  totalBudgetGoal: number;
  onAddExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpensesTab({
  expenses,
  totalBudgetGoal,
  onAddExpense,
  onDeleteExpense,
}: ExpensesTabProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExpenseItem["category"]>("Venue & Food");
  const [budgetAmount, setBudgetAmount] = useState<number>(500);
  const [actualAmount, setActualAmount] = useState<number>(500);
  const [status, setStatus] = useState<ExpenseItem["status"]>("Paid");
  const [description, setDescription] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalBudget = expenses.reduce((acc, curr) => acc + curr.budgetAmount, 0);
  const totalActual = expenses.reduce((acc, curr) => acc + curr.actualAmount, 0);
  const remainingBudget = totalBudgetGoal - totalActual;

  const fmtUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const handleExportCSV = () => {
    const headers = ["Name,Category,Budget Amount,Actual Amount,Status,Description\n"];
    const rows = expenses.map(
      (e) => `"${e.name}","${e.category}",${e.budgetAmount},${e.actualAmount},"${e.status}","${e.description}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "somboth-wedding-expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddExpense({
      id: "exp-" + Date.now(),
      name: name.trim(),
      category,
      budgetAmount: Number(budgetAmount) || 0,
      actualAmount: Number(actualAmount) || 0,
      status,
      description: description.trim() || `${category} allocation`,
      vendorPhone: vendorPhone.trim(),
    });

    setName("");
    setDescription("");
    setVendorPhone("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Header matching Image 4 */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F1A1A] tracking-tight">
              Expense Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509]">
              {expenses.length} Expense Items
            </span>
          </div>
          <p className="text-xs text-[#6E6262] mt-0.5">
            Monitor budget variances, vendor payments, and day-of wedding supplier costs.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8DFD8] hover:bg-[#FAF7F2] text-[#1F1A1A] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#580509]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => alert("Excel import sample: Click '+ Add New' to record expenses instantly.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8DFD8] hover:bg-[#FAF7F2] text-[#1F1A1A] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Import Excel</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#D4AF37]/40"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Expense</span>
          </button>
        </div>
      </div>

      {/* Budget Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Total Planned Budget</span>
          <div className="text-xl font-black text-[#1F1A1A] mt-1">{fmtUSD(totalBudgetGoal)}</div>
          <span className="text-[10px] text-slate-400">Target celebration cap</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Total Spent (Actual)</span>
          <div className="text-xl font-black text-[#580509] mt-1">{fmtUSD(totalActual)}</div>
          <span className="text-[10px] text-slate-400">
            {Math.round((totalActual / (totalBudgetGoal || 1)) * 100)}% of target budget
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 border border-[#E8DFD8] shadow-xs">
          <span className="text-[11px] font-bold text-[#6E6262]">Remaining Funds</span>
          <div
            className={`text-xl font-black mt-1 ${
              remainingBudget >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {fmtUSD(remainingBudget)}
          </div>
          <span className="text-[10px] text-slate-400">
            {remainingBudget >= 0 ? "Under budget reserve" : "Budget exceeded"}
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
            placeholder="Search expense name or description..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none focus:border-[#580509]"
          >
            <option value="All">All Categories</option>
            <option value="Venue & Food">Venue & Food</option>
            <option value="Attire & Beauty">Attire & Beauty</option>
            <option value="Photo & Video">Photo & Video</option>
            <option value="Decor & Flowers">Decor & Flowers</option>
            <option value="Music & Entertainment">Music & Band</option>
            <option value="Other">Other Miscellaneous</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white/98 rounded-2xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DFD8] text-[#1F1A1A] font-bold">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Budget Amount</th>
                <th className="py-3 px-4">Actual Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Description / Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6E6262]">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No expenses recorded yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click "+ Add New Expense" to start keeping track of wedding costs.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const variance = expense.actualAmount - expense.budgetAmount;
                  return (
                    <tr key={expense.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1F1A1A]">
                        {expense.name}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] border border-[#E8DFD8] text-[#580509]">
                          {expense.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#6E6262] font-semibold">
                        {fmtUSD(expense.budgetAmount)}
                      </td>

                      <td className="py-3 px-4 font-bold text-[#580509]">
                        {fmtUSD(expense.actualAmount)}
                        {variance > 0 && (
                          <span className="block text-[9px] text-rose-600 font-normal">
                            +{fmtUSD(variance)} over
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            expense.status === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : expense.status === "Deposit"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#6E6262] max-w-xs truncate">
                        {expense.description}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#E8DFD8] flex items-center justify-between text-xs text-[#6E6262]">
          <span>
            Total: <strong className="text-[#580509]">{filteredExpenses.length}</strong> items recorded
          </span>
          <span className="font-bold text-[#580509]">Total Actual: {fmtUSD(totalActual)}</span>
        </div>
      </div>

      {/* Add New Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#580509] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Record Wedding Expense</h3>
                <p className="text-xs text-[#FAF0D7]/80">Enter vendor budget and actual settlement amounts</p>
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
                  Expense / Vendor Name <span className="text-[#580509]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding Banquet (25 Tables) or Photography"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseItem["category"])}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none"
                  >
                    <option value="Venue & Food">Venue & Food</option>
                    <option value="Attire & Beauty">Attire & Beauty</option>
                    <option value="Photo & Video">Photo & Video</option>
                    <option value="Decor & Flowers">Decor & Flowers</option>
                    <option value="Music & Entertainment">Music & Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">Payment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ExpenseItem["status"])}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white outline-none"
                  >
                    <option value="Paid">Fully Paid</option>
                    <option value="Deposit">Deposit Paid</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                    Budget Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                    Actual Settled Amount ($ USD) <span className="text-[#580509]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1A1A] mb-1">
                  Description / Contract Terms
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Includes stage lighting, sound system, and sound technician."
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
