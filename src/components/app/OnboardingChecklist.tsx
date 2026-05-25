import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";

export function OnboardingChecklist() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(true);

  const items = [
    { label: "Complete profile", done: state.user.name.length > 0 },
    { label: "Add first application", done: state.applications.length > 0 },
    { label: "Upload resume", done: state.documents.some(d => d.type === "Resume") },
    { label: "Set weekly goal", done: state.settings.weeklyGoal > 0 },
  ];
  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const allDone = done === items.length;

  useEffect(() => {
    if (state.onboardingDismissed || !allDone) return;
    dispatch({ type: "confetti", on: true });
    const t = setTimeout(() => dispatch({ type: "dismissOnboarding" }), 3000);
    return () => clearTimeout(t);
  }, [allDone, state.onboardingDismissed, dispatch]);

  if (state.onboardingDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs hidden md:block">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-card rounded-2xl p-5 border border-white/10 w-72">
            {allDone ? (
              <div className="text-center py-4">
                <div className="font-display text-xl font-bold mb-1">You're all set 🚀</div>
                <div className="text-xs text-muted-foreground">Mission control online.</div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#06B6D4]" />
                    <span className="font-display font-bold text-sm">Get started</span>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-12 w-12">
                    <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <motion.circle cx="18" cy="18" r="15" fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${pct * 0.94} 100`} initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${pct * 0.94} 100` }} />
                      <defs><linearGradient id="g1"><stop stopColor="var(--brand)" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{pct}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Set up your mission control in under 2 minutes.</div>
                </div>
                <ul className="space-y-2">
                  {items.map(i => (
                    <li key={i.label} className="flex items-center gap-2 text-xs">
                      <div className={`h-4 w-4 rounded border flex items-center justify-center ${i.done ? "bg-[#10B981]/20 border-[#10B981]" : "border-white/15"}`}>
                        {i.done && <Check className="h-3 w-3 text-[#10B981]" />}
                      </div>
                      <span className={i.done ? "line-through text-muted-foreground" : ""}>{i.label}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => dispatch({ type: "dismissOnboarding" })} className="mt-4 text-[11px] text-muted-foreground hover:text-foreground">Dismiss</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
