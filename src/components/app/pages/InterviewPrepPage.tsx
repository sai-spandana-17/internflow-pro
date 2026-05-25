import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, ChevronDown, CheckCircle2, Brain, Code2, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast, type InterviewRound } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";

const TYPES = ["HR", "Technical", "System Design", "Culture Fit"] as const;

const TIPS: Record<typeof TYPES[number], { icon: typeof Brain; tip: string }> = {
  "HR": { icon: Users, tip: "Lead with motivation. Tie your story to the role." },
  "Technical": { icon: Code2, tip: "Talk through tradeoffs. State assumptions out loud." },
  "System Design": { icon: Brain, tip: "Start with constraints, scale, and bottlenecks." },
  "Culture Fit": { icon: MessageSquare, tip: "Be specific about how you work with others." },
};

export function InterviewPrepPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [appId, setAppId] = useState(state.applications[0]?.id ?? "");
  const app = state.applications.find(a => a.id === appId);

  const completed = app?.rounds.filter(r => r.status === "Completed").length ?? 0;
  const pct = app && app.rounds.length ? Math.round((completed / app.rounds.length) * 100) : 0;

  const addRound = () => {
    if (!app) return;
    dispatch({
      type: "addRound", appId: app.id,
      round: { id: crypto.randomUUID(), type: "HR", date: new Date().toISOString().slice(0, 10), status: "Scheduled", notes: "", interviewer: "", outcome: "" },
    });
    toast("Interview round added");
  };

  if (state.applications.length === 0) {
    return (
      <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <PageHeader title="Interview Prep" subtitle="Track every round, sharpen every answer." />
        <div className="mt-10 glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="font-display text-xl font-bold mb-1">No applications yet</div>
          <p className="text-sm text-muted-foreground mb-5">Add your first application to start tracking interview rounds.</p>
          <Button variant="hero" onClick={() => dispatch({ type: "view", view: "newapp" })}><Plus className="h-4 w-4" />Add Application →</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <PageHeader title="Interview Prep" subtitle="Track every round, sharpen every answer.">
        <select value={appId} onChange={e => setAppId(e.target.value)} className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10 [color-scheme:dark]">
          {state.applications.map(a => <option key={a.id} value={a.id} className="bg-[#111827]">{a.company} — {a.role}</option>)}
        </select>
      </PageHeader>

      {app && (
        <>
          <div className="mt-6 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Progress: {completed}/{app.rounds.length || 0} rounds completed</div>
              <Button variant="hero" onClick={addRound}><Plus className="h-4 w-4" />Add Round</Button>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div animate={{ width: pct + "%" }} className="h-full bg-gradient-to-r from-[var(--brand)] to-[#10B981]" style={{ boxShadow: "0 0 12px rgba(16,185,129,0.5)" }} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <AnimatePresence>
              {app.rounds.map(r => <RoundCard key={r.id} round={r} appId={app.id} />)}
            </AnimatePresence>
            {app.rounds.length === 0 && <div className="text-center text-muted-foreground py-8">No rounds yet. Add your first interview.</div>}
          </div>

          <div className="mt-10">
            <h3 className="font-display text-xl font-bold mb-4">Tips by round type</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TYPES.map(t => {
                const T = TIPS[t];
                return (
                  <div key={t} className="glass-card rounded-2xl p-5">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--brand)]/20 to-[#06B6D4]/10 border border-[var(--brand)]/30 flex items-center justify-center mb-3">
                      <T.icon className="h-4 w-4 text-[#06B6D4]" />
                    </div>
                    <div className="font-semibold text-sm mb-1">{t}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{T.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RoundCard({ round, appId }: { round: InterviewRound; appId: string }) {
  const { dispatch } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const update = (patch: Partial<InterviewRound>) => dispatch({ type: "updateRound", appId, roundId: round.id, patch });

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <select value={round.type} onClick={e => e.stopPropagation()} onChange={e => update({ type: e.target.value as InterviewRound["type"] })}
            className="glass-card rounded-md px-2 py-1 text-xs bg-transparent border border-white/10">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="date" value={round.date} onClick={e => e.stopPropagation()} onChange={e => update({ date: e.target.value })}
            className="glass-card rounded-md px-2 py-1 text-xs bg-transparent border border-white/10 [color-scheme:dark]" />
          <span className={`text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${round.status === "Completed" ? "bg-[#10B981]/15 text-[#10B981]" : round.status === "Cancelled" ? "bg-red-500/15 text-red-400" : "bg-[#F59E0B]/15 text-[#F59E0B]"}`}>{round.status}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-5 space-y-3">
          <input value={round.interviewer} onChange={e => update({ interviewer: e.target.value })} placeholder="Interviewer name"
            className="w-full glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10" />
          <textarea value={round.notes} onChange={e => update({ notes: e.target.value })} placeholder="Prep notes, questions, observations…" rows={4}
            className="w-full glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10 resize-none" />
          <input value={round.outcome} onChange={e => update({ outcome: e.target.value })} placeholder="Outcome / next steps"
            className="w-full glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10" />
          <div className="flex justify-between">
            <select value={round.status} onChange={e => update({ status: e.target.value as InterviewRound["status"] })} className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10">
              <option>Scheduled</option><option>Completed</option><option>Cancelled</option>
            </select>
            {round.status !== "Completed" && (
              <Button variant="hero" onClick={() => { update({ status: "Completed" }); toast("Round complete"); }} className="bg-gradient-to-r from-[#10B981] to-[#06B6D4]"><CheckCircle2 className="h-4 w-4" />Mark Complete</Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
