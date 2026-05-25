import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

import { Sidebar } from "./Sidebar";
import { SignInPage } from "./SignIn";
import { LandingHome } from "./pages/LandingHome";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { InterviewPrepPage } from "./pages/InterviewPrepPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NewApplicationPage } from "./pages/NewApplicationPage";
import { DashboardOverview } from "./pages/DashboardOverview";
import { AppDetailPage } from "./pages/AppDetailPage";
import { GoalsPage } from "./pages/GoalsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { CheckEmailPage } from "./pages/CheckEmailPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ToastStack } from "./ToastStack";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { EmailModal } from "./EmailModal";
import { ConfettiBurst } from "./ConfettiBurst";
import { FloatingAdd } from "./FloatingAdd";
import { CommandPalette } from "./CommandPalette";

const ACCENT_RGB: Record<string, string> = {
  "#3B82F6": "59, 130, 246",
  "#06B6D4": "6, 182, 212",
  "#8B5CF6": "139, 92, 246",
  "#10B981": "16, 185, 129",
};

export function AppShell() {
  const { state } = useStore();

  useEffect(() => {
    const color = state.settings.accentColor;
    document.documentElement.style.setProperty("--brand", color);
    document.documentElement.style.setProperty("--accent", color);
    const rgb = ACCENT_RGB[color] ?? "59, 130, 246";
    document.documentElement.style.setProperty("--brand-rgb", rgb);
  }, [state.settings.accentColor]);

  if (!state.authed) {
    return (
      <div className="min-h-screen bg-app text-foreground relative overflow-x-hidden">
        <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div key={state.view}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}>
            {state.view === "signin" && <SignInPage />}
            {state.view === "privacy" && <PrivacyPage />}
            {state.view === "terms" && <TermsPage />}
            {state.view === "checkemail" && <CheckEmailPage />}
            {state.view === "resetpassword" && <ResetPasswordPage />}
            {!["signin", "privacy", "terms", "checkemail", "resetpassword"].includes(state.view) && <LandingHome />}
          </motion.div>
        </AnimatePresence>
        <ToastStack />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-foreground relative overflow-x-hidden">
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
      <Sidebar />
      <main className="md:pl-60 pb-20 md:pb-0 relative">
        <AnimatePresence mode="wait">
          <motion.div key={state.view + (state.selectedAppId ?? "")}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}>
            {state.view === "landing" && <LandingHome />}
            {state.view === "dashboard" && <DashboardOverview />}
            {state.view === "apps" && <ApplicationsPage />}
            {state.view === "newapp" && <NewApplicationPage />}
            {state.view === "appdetail" && <AppDetailPage />}
            {state.view === "analytics" && <AnalyticsPage />}
            {state.view === "calendar" && <CalendarPage />}
            {state.view === "documents" && <DocumentsPage />}
            {state.view === "interview" && <InterviewPrepPage />}
            {state.view === "settings" && <SettingsPage />}
            {state.view === "goals" && <GoalsPage />}
            {state.view === "profile" && <ProfilePage />}
            {state.view === "privacy" && <PrivacyPage />}
            {state.view === "terms" && <TermsPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <OnboardingChecklist />
      <EmailModal />
      <ConfettiBurst />
      <FloatingAdd />
      <CommandPalette />
      <ToastStack />
    </div>
  );
}

