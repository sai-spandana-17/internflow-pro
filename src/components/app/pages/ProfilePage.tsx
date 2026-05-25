import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";

export function ProfilePage() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.user.name);

  const total = state.applications.length;
  const interviews = state.applications.filter(a => a.status === "interview").length;
  const offers = state.applications.filter(a => a.status === "offer").length;
  const avgCompleteness = total ? Math.round(state.applications.reduce((s, a) => s + a.profileCompleteness, 0) / total) : 0;

  const skillFreq = (() => {
    const m = new Map<string, number>();
    state.applications.forEach(a => a.skills.forEach(s => m.set(s, (m.get(s) ?? 0) + 1)));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  })();

  // 12-week heatmap
  const days: { date: string; count: number }[] = [];
  for (let i = 12 * 7 - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: state.applications.filter(a => new Date(a.submittedAt).toISOString().slice(0, 10) === key).length });
  }
  const max = Math.max(1, ...days.map(d => d.count));

  const save = () => {
    if (name.trim()) dispatch({ type: "setUserName", name: name.trim() });
    setEditing(false);
  };

  const initials = state.user.name.split(" ").map(p => p[0]).slice(0, 2).join("");

  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <PageHeader title="Profile" subtitle="Your mission record." />

      <div className="mt-8 glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center font-display text-2xl font-bold glow-soft">
          {initials}
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <input value={name} onChange={e => setName(e.target.value)} autoFocus
                  onKeyDown={e => e.key === "Enter" && save()}
                  className="font-display text-2xl font-bold bg-white/[0.03] rounded px-2 py-1 outline-none border border-white/10 focus:border-[var(--brand)]/60" />
                <button onClick={save} className="text-[#10B981]"><Check className="h-5 w-5" /></button>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold">{state.user.name}</h2>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{state.user.email}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Stat l="Total" v={total} />
            <Stat l="Interviews" v={interviews} />
            <Stat l="Offers" v={offers} />
            <Stat l="Avg Profile" v={`${avgCompleteness}%`} />
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Skills</h2>
      <div className="glass-card rounded-2xl p-6 flex flex-wrap gap-2">
        {skillFreq.length === 0 && <div className="text-sm text-muted-foreground">No skills yet.</div>}
        {skillFreq.map(([s, n]) => (
          <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/[0.04] border border-white/10">
            {s}<span className="text-[10px] text-[#06B6D4] font-bold">{n}</span>
          </span>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Activity — last 12 weeks</h2>
      <div className="glass-card rounded-2xl p-6 overflow-x-auto">
        <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>
          {days.map(d => {
            const alpha = d.count === 0 ? 0.05 : 0.2 + 0.6 * (d.count / max);
            return <div key={d.date} title={`${d.date} · ${d.count}`} className="h-3 w-3 rounded-sm" style={{ background: `rgba(var(--brand-rgb), ${alpha})` }} />;
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: number | string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{l}</div>
      <div className="font-display text-2xl font-bold text-gradient mt-1">{v}</div>
    </div>
  );
}
