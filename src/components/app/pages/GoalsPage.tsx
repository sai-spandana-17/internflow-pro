import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";

function Ring({ value, size = 160 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGrad)" strokeWidth="8" fill="none" strokeLinecap="round"
        initial={{ strokeDasharray: c, strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * pct) / 100 }}
        transition={{ duration: 1, ease: "easeOut" }} />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoalsPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [draft, setDraft] = useState("");

  const goal = state.settings.weeklyGoal;
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = state.applications.filter(a => a.submittedAt >= weekAgo).length;
  const daysRemaining = 7 - new Date().getDay();
  const pct = Math.round((thisWeek / goal) * 100);
  const motivational = thisWeek >= goal ? "Weekly goal crushed 🎯" : thisWeek >= goal / 2 ? "Strong week, keep going." : "You've got time — add more today.";

  const sameDaySubmits = (() => {
    const m = new Map<string, number>();
    state.applications.forEach(a => {
      const k = new Date(a.submittedAt).toDateString();
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Math.max(0, ...m.values());
  })();

  const milestones = [
    { emoji: "🚀", label: "First Launch", unlocked: state.applications.length >= 1 },
    { emoji: "🔥", label: "On Fire", unlocked: state.streak >= 3 },
    { emoji: "💼", label: "Pipeline Builder", unlocked: state.applications.length >= 5 },
    { emoji: "🎯", label: "Sharp Shooter", unlocked: state.applications.some(a => a.status === "interview") },
    { emoji: "🏆", label: "Offer Secured", unlocked: state.applications.some(a => a.status === "offer") },
    { emoji: "⚡", label: "Speed Runner", unlocked: sameDaySubmits >= 3 },
    { emoji: "🌟", label: "Completionist", unlocked: state.applications.some(a => a.profileCompleteness === 100) },
    { emoji: "📅", label: "Consistent", unlocked: state.streak >= 7 },
  ];

  const addWish = () => {
    const v = draft.trim();
    if (!v) return;
    dispatch({ type: "addWishlist", company: v });
    setDraft("");
    toast("Added to dream companies");
  };

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <PageHeader title="Goals" subtitle="Hit your targets, build your streak." />

      <div className="mt-8 glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <Ring value={pct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-3xl font-bold">{thisWeek}<span className="text-base text-muted-foreground">/{goal}</span></div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">this week</div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="font-display text-2xl font-bold">{motivational}</div>
          <div className="text-sm text-muted-foreground mt-1">{daysRemaining} day{daysRemaining === 1 ? "" : "s"} remaining this week</div>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
            <Button variant="glass" onClick={() => dispatch({ type: "setWeeklyGoal", goal: goal - 1 })}><Minus className="h-4 w-4" /></Button>
            <span className="font-display text-lg font-semibold w-16 text-center">{goal}/wk</span>
            <Button variant="glass" onClick={() => dispatch({ type: "setWeeklyGoal", goal: goal + 1 })}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Milestones</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {milestones.map(m => (
          <div key={m.label} className={`glass-card rounded-2xl p-5 text-center transition ${m.unlocked ? "border-[var(--brand)] glow-soft" : "opacity-40 grayscale"}`}>
            <div className="text-4xl mb-2">{m.emoji}</div>
            <div className="font-display text-sm font-bold">{m.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Dream Companies</h2>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex gap-2 mb-4">
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addWish())}
            placeholder="Add a company and press Enter"
            className="flex-1 rounded-lg px-3 py-2 text-sm bg-white/[0.03] border border-white/10 outline-none focus:border-[var(--brand)]/60" />
          <Button variant="hero" onClick={addWish}><Plus className="h-4 w-4" />Add</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.settings.wishlist.map(w => {
            const applied = state.applications.some(a => a.company.toLowerCase() === w.toLowerCase());
            return (
              <div key={w} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--brand)]/30 to-[#06B6D4]/15 border border-white/10 flex items-center justify-center font-display font-bold">{w[0]?.toUpperCase() ?? <Building2 className="h-4 w-4" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{w}</div>
                  {applied && <span className="text-[10px] uppercase tracking-[0.2em] text-[#10B981]">Applied</span>}
                </div>
                <button onClick={() => dispatch({ type: "removeWishlist", company: w })} className="text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
              </div>
            );
          })}
          {state.settings.wishlist.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-6">No dream companies yet.</div>}
        </div>
      </div>
    </div>
  );
}
