import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, TrendingUp, Briefcase, Trophy, Clock, Zap, ArrowRight, Bell, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, STATUS_LABEL, STATUS_COLOR } from "@/lib/store";

const EVENT_COLORS = { deadline: "var(--brand)", interview: "#F59E0B", followup: "#10B981" } as const;


export function DashboardOverview() {
  const { state, dispatch } = useStore();
  const total = state.applications.length;
  const offers = state.applications.filter(a => a.status === "offer").length;
  const interviews = state.applications.filter(a => a.status === "interview").length;
  const rate = total ? Math.round(((interviews + offers) / total) * 100) : 0;

  const metrics = [
    { l: "Total Applications", v: total, i: Briefcase },
    { l: "Interviews", v: interviews, i: TrendingUp },
    { l: "Offers", v: offers, i: Trophy },
    { l: "Response Rate", v: rate + "%", i: Clock },
  ];

  const empty = state.applications.length === 0;

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${state.user.name.split(" ")[0]}. Your internship. Your mission.`}>
        <Button variant="hero" onClick={() => dispatch({ type: "view", view: "newapp" })}><Plus className="h-4 w-4" />New Application</Button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {metrics.map((m, i) => (
          <motion.div key={m.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{m.l}</span>
              <m.i className="h-4 w-4 text-[#06B6D4]" />
            </div>
            <div className="font-display text-3xl font-bold text-gradient">{m.v}</div>
          </motion.div>
        ))}
      </div>
      <WeeklySummary />
      <SmartReminders />


      {empty ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-card rounded-2xl p-12 text-center max-w-xl mx-auto">
          <div className="h-14 w-14 rounded-2xl mx-auto bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center glow-soft">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold mt-5">Ready for liftoff?</h3>
          <p className="text-sm text-muted-foreground mt-2">Add your first application to start tracking your journey.</p>
          <Button variant="hero" size="lg" className="mt-6" onClick={() => dispatch({ type: "view", view: "newapp" })}>
            Add Application <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Recent Applications</h3>
              <button onClick={() => dispatch({ type: "view", view: "apps" })} className="text-xs text-[#06B6D4] hover:underline">View all →</button>
            </div>
            <ul className="space-y-3">
              {state.applications.slice(0, 4).map(a => (
                <li key={a.id}>
                  <button onClick={() => { dispatch({ type: "select", id: a.id }); dispatch({ type: "view", view: "appdetail" }); }}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/[0.03] flex items-center justify-between border border-white/5">
                    <div>
                      <div className="font-semibold text-sm">{a.role}</div>
                      <div className="text-xs text-muted-foreground">{a.company}</div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full" style={{ background: STATUS_COLOR[a.status] + "22", color: STATUS_COLOR[a.status] }}>{STATUS_LABEL[a.status]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4">Upcoming</h3>
            <ul className="space-y-3">
              {state.events.slice(0, 4).map(e => (
                <li key={e.id} className="p-3 rounded-lg border border-white/5 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
                  <div className="flex-1">
                    <div className="text-sm">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.date}</div>
                  </div>
                </li>
              ))}
              {state.events.length === 0 && <div className="text-sm text-muted-foreground">No events scheduled.</div>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function WeeklySummary() {
  const { state, dispatch } = useStore();
  const weekAgo = Date.now() - 7 * 86400000;
  const inWeek = state.applications.filter(a => a.submittedAt >= weekAgo).length;
  const interviewsThisWeek = state.applications.filter(a => a.status === "interview" && a.submittedAt >= weekAgo).length;
  const inDays = (n: number) => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() + n);
    return state.events.filter(e => {
      const d = new Date(e.date);
      return d >= new Date() && d <= cutoff && e.type === "deadline";
    }).length;
  };
  const deadlines = inDays(7);
  const goal = state.settings.weeklyGoal;
  const msg = inWeek >= goal ? "Weekly goal crushed 🎯" : inWeek >= goal / 2 ? "Strong week, keep going." : "You've got time — add more today.";
  const r = 20, c = 2 * Math.PI * r;
  const streakPct = Math.min(100, (state.streak / 7) * 100);
  return (
    <div className="mt-8 glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-display text-xl font-bold">This Week</h3>
        <div className="text-sm text-muted-foreground">{msg}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <Mini l="Applications" v={inWeek} />
        <Mini l="Interviews" v={interviewsThisWeek} />
        <div className="glass-card rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Deadlines (7d)</div>
          <div className="font-display text-2xl font-bold text-gradient mt-1">{deadlines}</div>
          <button onClick={() => dispatch({ type: "view", view: "calendar" })} className="text-[10px] text-[#06B6D4] hover:underline">View Calendar →</button>
        </div>
        <div className="flex items-center gap-3">
          <svg width="48" height="48" className="-rotate-90">
            <circle cx="24" cy="24" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
            <circle cx="24" cy="24" r={r} stroke="url(#dgrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * streakPct) / 100} />
            <defs><linearGradient id="dgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--brand)" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient></defs>
          </svg>
          <div>
            <div className="font-display text-lg font-bold">{state.streak}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">day streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ l, v }: { l: string; v: number | string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{l}</div>
      <div className="font-display text-2xl font-bold text-gradient mt-1">{v}</div>
    </div>
  );
}

function SmartReminders() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(true);
  const now = Date.now();
  const nudges: { id: string; text: string; appId?: string }[] = [];
  state.applications.forEach(a => {
    const last = (a.statusHistory ?? []).slice(-1)[0]?.changedAt ?? a.submittedAt;
    if (now - last > 7 * 86400000 && a.status !== "offer" && a.status !== "rejected") {
      nudges.push({ id: `f-${a.id}`, text: `Follow up on ${a.company}`, appId: a.id });
    }
    if (a.profileCompleteness < 60) nudges.push({ id: `p-${a.id}`, text: `Complete your ${a.company} profile`, appId: a.id });
  });
  state.events.forEach(e => {
    const d = new Date(e.date).getTime();
    const days = Math.ceil((d - now) / 86400000);
    if (days >= 0 && days <= 3) nudges.push({ id: `e-${e.id}`, text: `Deadline for ${e.title} in ${days}d` });
  });
  const visible = nudges.filter(n => !state.dismissedReminders.includes(n.id)).slice(0, 5);

  return (
    <div className="mt-6 glass-card rounded-2xl p-6">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#06B6D4]" />
          <h3 className="font-display text-xl font-bold">Smart Reminders</h3>
          {visible.length > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30">{visible.length}</span>}
        </div>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <ul className="mt-4 space-y-2">
          {visible.length === 0 && <li className="text-sm text-muted-foreground">All clear. Nothing to nudge.</li>}
          {visible.map(n => (
            <li key={n.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
              <span className="flex-1 text-sm">{n.text}</span>
              {n.appId && <button onClick={() => { dispatch({ type: "select", id: n.appId! }); dispatch({ type: "view", view: "appdetail" }); }} className="text-xs text-[#06B6D4] hover:underline">View →</button>}
              <button onClick={() => dispatch({ type: "dismissReminder", id: n.id })} className="text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
