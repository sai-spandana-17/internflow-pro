import { motion } from "framer-motion";
import { Plus, TrendingUp, Briefcase, Trophy, Clock, Zap, ArrowRight } from "lucide-react";
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
