import { motion } from "framer-motion";
import { useState } from "react";
import { LayoutDashboard, Files, BarChart3, Calendar as CalIcon, FolderOpen, BrainCircuit, Settings as SettingsIcon, Zap, Flame, LogOut, MoreHorizontal, Target } from "lucide-react";
import { useStore, type View } from "@/lib/store";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const items: { view: View; label: string; icon: typeof LayoutDashboard }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "apps", label: "Applications", icon: Files },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "goals", label: "Goals", icon: Target },
  { view: "calendar", label: "Calendar", icon: CalIcon },
  { view: "documents", label: "Documents", icon: FolderOpen },
  { view: "interview", label: "Interview Prep", icon: BrainCircuit },
  { view: "settings", label: "Settings", icon: SettingsIcon },
];


export function Sidebar() {
  const { state, dispatch } = useStore();
  const goal = state.settings.weeklyGoal;
  const goalHit = state.streak >= goal;
  const progress = goalHit ? 100 : Math.min(100, Math.round((state.streak / goal) * 100));
  const activeCount = state.applications.filter(a => a.status !== "rejected" && a.status !== "offer").length;
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 z-30 glass-card border-r border-white/10 flex-col p-5">
        <button onClick={() => dispatch({ type: "view", view: "landing" })} className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] glow-soft flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
        </button>

        <div className="glass-card rounded-xl p-3 mb-5 border border-white/5">
          <div className="flex items-center gap-2 text-sm">
            <Flame className={`h-4 w-4 ${goalHit ? "text-[#10B981]" : "text-[#F59E0B]"}`} />
            <span className="font-semibold">{state.streak} day streak</span>
            <span>🔥</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className={`h-full ${goalHit ? "bg-gradient-to-r from-[#10B981] to-[#06B6D4]" : "bg-gradient-to-r from-[var(--brand)] to-[#06B6D4]"}`}
            />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
            {goalHit ? "🎯 Goal hit!" : `${state.streak}/${goal} this week`}
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((it) => {
            const active = state.view === it.view || (it.view === "dashboard" && state.view === "appdetail");
            const showBadge = it.view === "apps" && activeCount > 0;
            return (
              <button key={it.view} onClick={() => dispatch({ type: "view", view: it.view })}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition group ${active ? "bg-white/5 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"}`}>
                {active && (
                  <motion.span layoutId="navactive" className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-gradient-to-b from-[var(--brand)] to-[#06B6D4]"
                    style={{ boxShadow: "0 0 12px rgba(59,130,246,0.7)" }} />
                )}
                <it.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{it.label}</span>
                {showBadge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30">
                    {activeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center text-sm font-bold">
              {state.user.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{state.user.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{state.user.email}</div>
            </div>
            <button onClick={() => dispatch({ type: "signout" })} className="p-1.5 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-card border-t border-white/10 flex justify-around py-2 px-2">
        {items.slice(0, 4).map((it) => {
          const active = state.view === it.view;
          return (
            <button key={it.view} onClick={() => dispatch({ type: "view", view: it.view })}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] ${active ? "text-[#06B6D4]" : "text-muted-foreground"}`}>
              <it.icon className="h-4 w-4" />
              <span>{it.label}</span>
            </button>
          );
        })}
        <Drawer open={moreOpen} onOpenChange={setMoreOpen}>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
              <span>More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>More</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 grid gap-1">
              {items.slice(4).map(it => (
                <button key={it.view} onClick={() => { dispatch({ type: "view", view: it.view }); setMoreOpen(false); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-sm">
                  <it.icon className="h-4 w-4 text-[#06B6D4]" />
                  <span>{it.label}</span>
                </button>
              ))}
              <button onClick={() => { dispatch({ type: "signout" }); setMoreOpen(false); }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-sm text-red-400">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </>
  );
}
