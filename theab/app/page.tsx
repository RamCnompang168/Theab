"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { api, getStoredToken } from "./api-client";
import { LandingHero } from "@/components/LandingHero";
import { WhatIsSomboth } from "@/components/WhatIsSomboth";
import { HowSombothHelps } from "@/components/HowSombothHelps";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { Toast } from "@/components/Toast";
import { AuthModal } from "@/components/AuthModal";
import { CreateProjectModal, ProjectData } from "@/components/CreateProjectModal";
import { UpdateProjectModal } from "@/components/UpdateProjectModal";
import { DashboardTab } from "@/components/DashboardTab";
import { GuestsTab, GuestItem } from "@/components/GuestsTab";
import { ExpensesTab, ExpenseItem } from "@/components/ExpensesTab";
import { WeddingGiftTab, GiftItem } from "@/components/WeddingGiftTab";
import { TemplateTab } from "@/components/TemplateTab";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Gift,
  Palette,
  Plus,
} from "lucide-react";

export default function App() {
  // Page View Mode: "landing" (default public homepage) vs "dashboard" (management suite)
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("landing");
  const [language, setLanguage] = useState<"en" | "km">(() => {
    if (typeof window === "undefined") return "en";
    const savedLanguage = localStorage.getItem("somboth_language");
    return savedLanguage === "km" ? "km" : "en";
  });

  // User Authentication State (initially null for visitors)
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // Active Project Data
  const [project, setProject] = useState<ProjectData | null>(null);

  // Active Tab inside Dashboard: "dashboard" | "guests" | "expenses" | "gifts" | "template"
  const [activeTab, setActiveTab] = useState<"dashboard" | "guests" | "expenses" | "gifts" | "template">("dashboard");

  // Data Collections (Clean - no static mock data)
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isUpdateProjectOpen, setIsUpdateProjectOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastOpen(true);
  };

  // Load guests, expenses, and gifts for a project from the API
  const loadProjectData = async (projectId: string) => {
    try {
      const [gRes, eRes, gftRes] = await Promise.all([
        api.guests.list(projectId),
        api.expenses.list(projectId),
        api.gifts.list(projectId),
      ]);

      if (gRes.success && gRes.data?.guests) {
        setGuests(gRes.data.guests);
      }
      if (eRes.success && eRes.data?.expenses) {
        setExpenses(eRes.data.expenses);
      }
      if (gftRes.success && gftRes.data?.gifts) {
        setGifts(gftRes.data.gifts);
      }
    } catch (err) {
      console.warn("Could not load project collections from backend, using current state:", err);
    }
  };

  // On initial mount: restore user session if token exists
  useEffect(() => {
    localStorage.setItem("somboth_language", language);
    document.documentElement.lang = language === "km" ? "km" : "en";
  }, [language]);

  const dashboardLabels = language === "km"
    ? { dashboard: "ផ្ទាំងគ្រប់គ្រង", guests: "ភ្ញៀវ", expenses: "ចំណាយ", gifts: "ចំណងដៃ", template: "គំរូ", addTemplate: "+ បន្ថែមគំរូ" }
    : { dashboard: "Dashboard", guests: "Guests", expenses: "Expenses", gifts: "Wedding Gift", template: "Template", addTemplate: "+ Add Template" };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    api.auth.me().then(async (res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        const projRes = await api.projects.list();
        if (projRes.success && projRes.data?.projects?.length) {
          const userProject = projRes.data.projects[0];
          setProject(userProject);
          await loadProjectData(userProject.id);
        }
      }
    });
  }, []);

  // Flow Controller: Handle "+ Create Project" button clicks from Landing page or Navbar
  const handleInitiateCreateProject = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else if (!project) {
      setIsCreateProjectModalOpen(true);
    } else {
      setViewMode("dashboard");
      showToast("Opened your active wedding celebration dashboard.");
    }
  };

  // Auth Success: Account created or signed in -> Check projects or Open Create Project
  const handleAuthSuccess = async (authenticatedUser: { name: string; email: string; avatar: string }) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);

    try {
      const projRes = await api.projects.list();
      if (projRes.success && projRes.data?.projects?.length) {
        const userProject = projRes.data.projects[0];
        setProject(userProject);
        await loadProjectData(userProject.id);
        setViewMode("dashboard");
        showToast(`Welcome back, ${authenticatedUser.name}! Loaded your wedding dashboard.`);
      } else {
        setIsCreateProjectModalOpen(true);
        showToast(`Welcome, ${authenticatedUser.name}! Now let's set up your wedding project.`);
      }
    } catch {
      setIsCreateProjectModalOpen(true);
    }
  };



  // Project Creation Success: Transition directly to Dashboard!
  const handleProjectSuccess = async (newProject: ProjectData) => {
    setProject(newProject);
    setIsCreateProjectModalOpen(false);
    await loadProjectData(newProject.id);
    setViewMode("dashboard");
    setActiveTab("dashboard");
    showToast(`Wedding Project "${newProject.title}" created successfully! Welcome to your Dashboard.`);
  };

  // Logout handler
  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setProject(null);
    setViewMode("landing");
    showToast("You have been signed out.");
  };

  // Guest actions
  const handleAddGuest = async (newGuest: GuestItem) => {
    const projId = project?.id || "proj-1";
    try {
      const res = await api.guests.add({
        projectId: projId,
        ...newGuest,
      });
      if (res.success && res.data?.guest) {
        const serverGuest = res.data.guest;
        setGuests((prev) => [serverGuest, ...prev.filter((g) => g.id !== serverGuest.id)]);
      } else {
        setGuests((prev) => [newGuest, ...prev]);
      }
    } catch {
      setGuests((prev) => [newGuest, ...prev]);
    }
    showToast(`Guest "${newGuest.name}" added to guest directory.`);
  };

  const handleDeleteGuest = async (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    try {
      await api.guests.delete(id);
    } catch (e) {
      console.warn("API delete guest error:", e);
    }
    showToast("Guest removed from directory.");
  };

  const handleUpdateGuestStatus = async (id: string, status: GuestItem["status"]) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
    try {
      await api.guests.patchStatus(id, status);
    } catch (e) {
      console.warn("API patch status error:", e);
    }
    showToast(`Updated guest status to ${status}.`);
  };

  // Expense actions
  const handleAddExpense = async (newExpense: ExpenseItem) => {
    const projId = project?.id || "proj-1";
    try {
      const res = await api.expenses.add({
        projectId: projId,
        ...newExpense,
      });
      if (res.success && res.data?.expense) {
        const serverExpense = res.data.expense;
        setExpenses((prev) => [serverExpense, ...prev.filter((e) => e.id !== serverExpense.id)]);
      } else {
        setExpenses((prev) => [newExpense, ...prev]);
      }
    } catch {
      setExpenses((prev) => [newExpense, ...prev]);
    }
    showToast(`Expense "${newExpense.name}" recorded.`);
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await api.expenses.delete(id);
    } catch (e) {
      console.warn("API delete expense error:", e);
    }
    showToast("Expense item deleted.");
  };

  // Gift actions
  const handleAddGift = async (newGift: GiftItem) => {
    const projId = project?.id || "proj-1";
    try {
      const res = await api.gifts.add({
        projectId: projId,
        ...newGift,
      });
      if (res.success && res.data?.gift) {
        const serverGift = res.data.gift;
        setGifts((prev) => [serverGift, ...prev.filter((g) => g.id !== serverGift.id)]);
      } else {
        setGifts((prev) => [newGift, ...prev]);
      }
    } catch {
      setGifts((prev) => [newGift, ...prev]);
    }
    showToast(`Gift envelope from "${newGift.guestName}" recorded.`);
  };

  const handleDeleteGift = async (id: string) => {
    setGifts((prev) => prev.filter((g) => g.id !== id));
    try {
      await api.gifts.delete(id);
    } catch (e) {
      console.warn("API delete gift error:", e);
    }
    showToast("Gift envelope record deleted.");
  };

  const handleToggleThankYou = async (id: string) => {
    const current = gifts.find((g) => g.id === id);
    const nextStatus = current ? !current.thankYouSent : true;

    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, thankYouSent: nextStatus } : g))
    );

    try {
      await api.gifts.toggleThankYou(id, nextStatus);
    } catch (e) {
      console.warn("API toggle thank you error:", e);
    }
    showToast("Thank-you note status updated.");
  };

  // Compute metrics for Dashboard
  const currentProject: ProjectData = project || {
    id: "",
    title: "My Wedding Celebration",
    groomName: "",
    brideName: "",
    date: "",
    time: "",
    venue: "",
    city: "",
    totalGuestsGoal: 0,
    totalBudgetUSD: 0,
    exchangeRateKHR: 4000,
  };
  const totalGuestsCount = guests.length;
  const confirmedGuestsCount = guests.filter((g) => g.status === "Confirmed").length;
  const pendingGuestsCount = guests.filter((g) => g.status === "Pending").length;
  const declinedGuestsCount = guests.filter((g) => g.status === "Declined").length;
  const giftIncomeUSD = gifts.reduce((acc, curr) => acc + curr.amountUSD, 0);
  const giftIncomeKHR = giftIncomeUSD * currentProject.exchangeRateKHR;
  const totalExpensesUSD = expenses.reduce((acc, curr) => acc + curr.actualAmount, 0);

  return (
    <div className="min-h-screen flex flex-col relative khmer-pattern-bg">
      {/* Top Navigation Bar */}
      <Navbar
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        user={user}
        project={project}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCreateProject={handleInitiateCreateProject}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main View Switcher: Landing Page vs Management Dashboard */}
      {viewMode === "landing" ? (
        /* ======================== 1. PUBLIC LANDING PAGE ======================== */
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Landing Hero Section */}
          <LandingHero
            onCreateProjectClick={handleInitiateCreateProject}
            onExploreClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            user={user}
            hasProject={!!project}
            onOpenDashboard={() => setViewMode("dashboard")}
            language={language}
          />

          {/* What is Somboth Section */}
          <WhatIsSomboth onOpenCreate={handleInitiateCreateProject} />

          {/* How Somboth Helps (6 Capabilities Cards) */}
          <HowSombothHelps />

          {/* How It Works (3-Step Process + Platform Metrics) */}
          <HowItWorks />

          {/* FAQ Section */}
          <FaqSection />

          {/* Footer */}
          <Footer />
        </main>
      ) : (
        /* ==================== 2. WEDDING MANAGEMENT DASHBOARD ==================== */
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          {!project ? (
            <div className="bg-white/98 backdrop-blur-md rounded-3xl border border-[#D4AF37]/40 shadow-sm p-8 sm:p-14 text-center max-w-xl mx-auto my-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#580509]">
                <Palette className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F1A1A]">No Active Wedding Project Yet</h3>
              <p className="text-xs sm:text-sm text-[#6E6262] max-w-sm mx-auto leading-relaxed">
                You haven't set up a wedding project yet. Create your celebration project to start managing guests, tracking expenses, envelopes, and customizing your digital invitation.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-[#580509] to-[#750D13] hover:from-[#430205] hover:to-[#430205] text-[#F5C842] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#D4AF37]/40 active:scale-95"
                >
                  + Create Your Wedding Project
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* The 5 Core Tabs Navigation Bar */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-1.5 flex items-center justify-between overflow-x-auto">
                <nav aria-label="Dashboard Tabs" className="flex items-center gap-1 sm:gap-2">
                  {/* 1. Dashboard Tab */}
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "dashboard"
                        ? "bg-gradient-to-r from-[#580509] to-[#750D13] text-[#F5C842] shadow-sm border border-[#D4AF37]/40"
                        : "text-[#6E6262] hover:bg-[#FAF7F2] hover:text-[#580509]"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{dashboardLabels.dashboard}</span>
                  </button>

                  {/* 2. Guests Tab */}
                  <button
                    onClick={() => setActiveTab("guests")}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "guests"
                        ? "bg-gradient-to-r from-[#580509] to-[#750D13] text-[#F5C842] shadow-sm border border-[#D4AF37]/40"
                        : "text-[#6E6262] hover:bg-[#FAF7F2] hover:text-[#580509]"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{dashboardLabels.guests}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-black/20 text-[#FAF0D7]">
                      {totalGuestsCount}
                    </span>
                  </button>

                  {/* 3. Expenses Tab */}
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "expenses"
                        ? "bg-gradient-to-r from-[#580509] to-[#750D13] text-[#F5C842] shadow-sm border border-[#D4AF37]/40"
                        : "text-[#6E6262] hover:bg-[#FAF7F2] hover:text-[#580509]"
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{dashboardLabels.expenses}</span>
                  </button>

                  {/* 4. Wedding Gift Tab */}
                  <button
                    onClick={() => setActiveTab("gifts")}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "gifts"
                        ? "bg-gradient-to-r from-[#580509] to-[#750D13] text-[#F5C842] shadow-sm border border-[#D4AF37]/40"
                        : "text-[#6E6262] hover:bg-[#FAF7F2] hover:text-[#580509]"
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>{dashboardLabels.gifts}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-900/40 text-[#FAF0D7]">
                      {gifts.length}
                    </span>
                  </button>

                  {/* 5. Template Tab */}
                  <button
                    onClick={() => setActiveTab("template")}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === "template"
                        ? "bg-gradient-to-r from-[#580509] to-[#750D13] text-[#F5C842] shadow-sm border border-[#D4AF37]/40"
                        : "text-[#6E6262] hover:bg-[#FAF7F2] hover:text-[#580509]"
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>{dashboardLabels.template}</span>
                  </button>
                </nav>

                {/* + Add Template shortcut button */}
                <button
                  onClick={() => {
                    setActiveTab("template");
                    showToast("Opened Wedding Invitation Template Editor.");
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#D4AF37]/60 text-xs font-semibold text-[#580509] hover:bg-[#FAF7F2] transition-colors cursor-pointer ml-2 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{dashboardLabels.addTemplate}</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === "dashboard" && (
                <DashboardTab
                  project={currentProject}
                  expenses={expenses}
                  totalGuests={totalGuestsCount}
                  confirmedGuests={confirmedGuestsCount}
                  pendingGuests={pendingGuestsCount}
                  declinedGuests={declinedGuestsCount}
                  giftIncomeUSD={giftIncomeUSD}
                  giftIncomeKHR={giftIncomeKHR}
                  totalExpensesUSD={totalExpensesUSD}
                  onUpdateEventInfo={() => setIsUpdateProjectOpen(true)}
                  onSwitchTab={setActiveTab}
                />
              )}

              {/* TAB 2: GUESTS MANAGEMENT */}
              {activeTab === "guests" && (
                <GuestsTab
                  guests={guests}
                  onAddGuest={handleAddGuest}
                  onDeleteGuest={handleDeleteGuest}
                  onUpdateGuestStatus={handleUpdateGuestStatus}
                />
              )}

              {/* TAB 3: EXPENSES TRACKING */}
              {activeTab === "expenses" && (
                <ExpensesTab
                  expenses={expenses}
                  totalBudgetGoal={currentProject.totalBudgetUSD}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              )}

              {/* TAB 4: WEDDING GIFT ENVELOPES (USD & KHR) */}
              {activeTab === "gifts" && (
                <WeddingGiftTab
                  gifts={gifts}
                  exchangeRateKHR={currentProject.exchangeRateKHR}
                  onAddGift={handleAddGift}
                  onDeleteGift={handleDeleteGift}
                  onToggleThankYou={handleToggleThankYou}
                />
              )}

              {/* TAB 5: DIGITAL INVITATION TEMPLATE */}
              {activeTab === "template" && (
                <TemplateTab
                  project={currentProject}
                  onSaveTemplateNotification={showToast}
                />
              )}
            </div>
          )}

          {/* Footer in Dashboard */}
          <Footer />
        </main>
      )}

      {/* ===================== STEP 1: AUTH MODAL OVERLAY ===================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md my-auto">
            <AuthModal
              onSuccess={handleAuthSuccess}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ================= STEP 2: CREATE PROJECT MODAL OVERLAY ================= */}
      {isCreateProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl my-auto">
            <CreateProjectModal
              userName={user?.name || "Organizer"}
              onSuccess={handleProjectSuccess}
              onBackToAuth={() => {
                setIsCreateProjectModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              onClose={() => setIsCreateProjectModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ================== UPDATE ACTIVE PROJECT MODAL ================== */}
      <UpdateProjectModal
        isOpen={isUpdateProjectOpen}
        project={currentProject}
        onClose={() => setIsUpdateProjectOpen(false)}
        onSave={(updated) => {
          setProject(updated);
          showToast("Wedding celebration parameters updated successfully!");
        }}
      />

      {/* Floating Support Widget */}
      <SupportWidget />

      {/* Toast Notifications */}
      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
