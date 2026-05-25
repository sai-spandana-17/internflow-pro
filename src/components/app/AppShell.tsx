import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

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
  const { state, dispatch } = useStore();
  const [bootstrapping, setBootstrapping] = useState(true);

  // Accent CSS var
  useEffect(() => {
    const color = state.settings.accentColor;
    document.documentElement.style.setProperty("--brand", color);
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty("--brand-rgb", ACCENT_RGB[color] ?? "59, 130, 246");
  }, [state.settings.accentColor]);

  // Auth bootstrap + listener
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY") {
        dispatch({ type: "view", view: "resetpassword" });
        return;
      }
      if (event === "SIGNED_IN" && session?.user) {
        const u = session.user;
        const name = (u.user_metadata?.full_name as string | undefined)
          || u.email?.split("@")[0]?.replace(/\W/g, " ").replace(/\b\w/g, c => c.toUpperCase())
          || "Explorer";
        dispatch({ type: "auth", user: { name, email: u.email ?? "" } });
      }
      if (event === "SIGNED_OUT") {
        dispatch({ type: "signout" });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const s = data.session;
      if (s?.user) {
        const u = s.user;
        const name = (u.user_metadata?.full_name as string | undefined)
          || u.email?.split("@")[0]?.replace(/\W/g, " ").replace(/\b\w/g, c => c.toUpperCase())
          || "Explorer";
        dispatch({ type: "auth", user: { name, email: u.email ?? "" } });
      }
      setBootstrapping(false);
    }).catch(() => setBootstrapping(false));

    return () => { mounted = false; subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

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
            {state.view === "resetpassword" && <ResetPasswordPage />}
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
