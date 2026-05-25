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
import { ToastStack } from "./ToastStack";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { EmailModal } from "./EmailModal";
import { ConfettiBurst } from "./ConfettiBurst";
import { FloatingAdd } from "./FloatingAdd";
import { CommandPalette } from "./CommandPalette";

export function AppShell() {
  const { state } = useStore();

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", state.settings.accentColor);
    document.documentElement.style.setProperty("--accent", state.settings.accentColor);
  }, [state.settings.accentColor]);


  if (!state.authed) {
    return (
      <div className="min-h-screen bg-app text-foreground relative">
        <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div key={state.view}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}>
            {state.view === "signin" ? <SignInPage /> : <LandingHome />}
          </motion.div>
        </AnimatePresence>
        <ToastStack />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-foreground relative">
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
