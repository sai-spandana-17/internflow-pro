import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { Info } from "lucide-react";
import { useStore, STATUS_LABEL, STATUS_COLOR, type Application, type Status } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";

function useCount(target: number, run: boolean, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf: number; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return v;
}

const DAY = 1000 * 60 * 60 * 24;

function weekKey(ts: number) {
  // Monday-anchored ISO week start
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7; // 0=Mon
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

const SAMPLE_STATUSES: Status[] = ["review", "interview", "review", "offer", "review", "rejected", "interview"];

function makeSamples(count: number): Application[] {
  const now = Date.now();
  const companies = ["Stripe", "OpenAI", "Figma", "Notion", "Datadog", "Airbnb", "Vercel"];
  return Array.from({ length: count }, (_, i) => ({
    id: `sample-${i}`,
    role: "Sample Role",
    company: companies[i % companies.length],
    companyIndustry: "Tech",
    companyLocation: "Remote",
    status: SAMPLE_STATUSES[i % SAMPLE_STATUSES.length],
    submittedAt: now - Math.floor(Math.random() * 56) * DAY,
    deadline: "",
    availability: "",
    whyJoin: "",
    notes: "",
    skills: [],
    github: "",
    portfolio: "",
    linkedin: "",
    fullName: "",
    email: "",
    phone: "",
    profileCompleteness: 70,
    rounds: [],
  }));
}

export function AnalyticsPage() {
  const { state } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sparse = state.applications.length < 3;
  const apps: Application[] = useMemo(() => {
    if (!sparse) return state.applications;
    return [...state.applications, ...makeSamples(8 - state.applications.length)];
  }, [state.applications, sparse]);

  const total = apps.length;
  const interviews = apps.filter(a => a.status === "interview" || a.status === "offer").length;
  const offers = apps.filter(a => a.status === "offer").length;
  const responseRate = total ? Math.round((interviews / total) * 100) : 0;

  const tCount = useCount(total, true);
  const iCount = useCount(interviews, true);
  const oCount = useCount(offers, true);
  const rCount = useCount(responseRate, true);

  const byStatus = (["review", "interview", "offer", "rejected"] as const).map(s => ({
    name: STATUS_LABEL[s], value: apps.filter(a => a.status === s).length, color: STATUS_COLOR[s],
  })).filter(s => s.value > 0);

  // Build last 8 ISO weeks (Monday-anchored)
  const todayWeek = weekKey(Date.now());
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const wk = todayWeek - (7 - i) * 7 * DAY;
    const label = new Date(wk).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const inWeek = apps.filter(a => weekKey(a.submittedAt) === wk);
    const interviewed = inWeek.filter(a => a.status === "interview" || a.status === "offer").length;
    return {
      name: label,
      value: inWeek.length,
      rate: inWeek.length ? Math.round((interviewed / inWeek.length) * 100) : 0,
    };
  });
  const trend = weeks.map(w => ({ name: w.name, rate: w.rate }));

  const companies = Array.from(new Set(apps.map(a => a.company)))
    .map(c => ({ name: c, count: apps.filter(a => a.company === c).length }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  // Heatmap: 4 weeks × 7 days, count of apps per day
  const heat = Array.from({ length: 4 }, (_, w) => {
    const weekStart = todayWeek - (3 - w) * 7 * DAY;
    return Array.from({ length: 7 }, (_, d) => {
      const dayStart = weekStart + d * DAY;
      return apps.filter(a => a.submittedAt >= dayStart && a.submittedAt < dayStart + DAY).length;
    });
  });
  const maxHeat = Math.max(1, ...heat.flat());

  return (
    <div ref={ref} className="px-6 md:px-12 py-10 max-w-6xl mx-auto space-y-8">
      <PageHeader title="Analytics" subtitle="Patterns across your search." />

      {sparse && (
        <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border border-[#06B6D4]/30">
          <Info className="h-4 w-4 text-[#06B6D4] shrink-0" />
          <span className="text-sm">Showing sample data — add more applications to unlock real insights.</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ l: "Total Applications", v: tCount }, { l: "Response Rate", v: rCount + "%" }, { l: "Interviews", v: iCount }, { l: "Offers", v: oCount }].map((m, i) => (
          <motion.div key={m.l} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.06 }} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{m.l}</div>
            <div className="font-display text-4xl font-bold text-gradient mt-2">{m.v}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Applications by Status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {byStatus.map((s, i) => <Cell key={i} fill={s.color} stroke="#0A0F1C" strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={tooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {byStatus.map(s => <div key={s.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}: {s.value}</div>)}
          </div>
        </ChartCard>

        <ChartCard title="Applications per Week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
              <Bar dataKey="value" fill="var(--brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Response Rate Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltip} />
              <Line type="monotone" dataKey="rate" stroke="#06B6D4" strokeWidth={2.5} dot={{ fill: "#06B6D4", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Companies Applied">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={companies} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={80} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: "rgba(6,182,212,0.06)" }} />
              <Bar dataKey="count" fill="#06B6D4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Best Day to Apply">
        <div className="space-y-2">
          <div className="grid grid-cols-8 gap-1 text-[10px] text-muted-foreground">
            <div></div>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="text-center">{d}</div>)}
          </div>
          {heat.map((row, w) => (
            <div key={w} className="grid grid-cols-8 gap-1">
              <div className="text-[10px] text-muted-foreground self-center">W{w + 1}</div>
              {row.map((v, d) => (
                <motion.div key={d} initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: (w * 7 + d) * 0.015 }}
                  className="h-10 rounded-md border border-white/5" style={{ background: `rgba(59,130,246,${0.08 + (v / maxHeat) * 0.6})` }} title={`${v} applications`} />
              ))}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

const tooltip = { background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}
