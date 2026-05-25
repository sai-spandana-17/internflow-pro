import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock, FileText, Mail, Rocket, Sparkles, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline, type TimelineStep } from "./Timeline";
import type { FormData } from "./ApplicationForm";

interface Props {
  data: FormData;
  onBack: () => void;
}

function Particles() {
  const parts = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      id: i,
      angle: (i / 28) * Math.PI * 2,
      dist: 80 + Math.random() * 140,
      delay: Math.random() * 0.2,
      hue: Math.random() > 0.5 ? "var(--brand)" : "#06B6D4",
    })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {parts.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, opacity: 0, scale: 0.3 }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          style={{ background: p.hue, boxShadow: `0 0 12px ${p.hue}` }}
          className="absolute h-1.5 w-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: typeof Calendar; label: string; value: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-[#06B6D4]" />
      </div>
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

export function Dashboard({ data, onBack }: Props) {
  const [view, setView] = useState<"detail" | "list">("detail");

  const company = "Helios Robotics";
  const role = data.role || "Software Engineering";

  const timeline: TimelineStep[] = [
    { label: "Application Submitted", description: "Received and indexed in our system.", status: "complete" },
    { label: "Under Review", description: "A recruiter is evaluating your portfolio.", status: "active" },
    { label: "Interview Scheduled", description: "Awaiting calendar invite.", status: "pending" },
    { label: "Final Decision", description: "Offer or detailed feedback to follow.", status: "pending" },
  ];

  const activity = [
    { icon: CheckCircle2, text: "Application submitted successfully", time: "Just now" },
    { icon: Mail, text: "Confirmation email sent to your inbox", time: "1 min ago" },
    { icon: FileText, text: "Resume parsed — 14 keywords matched", time: "2 min ago" },
  ];

  if (view === "list") return <ApplicationList company={company} role={role} onOpen={() => setView("detail")} onBack={onBack} />;

  return (
    <div className="min-h-screen bg-app text-foreground">
      {/* Celebration header */}
      <section className="relative px-6 md:px-12 pt-12 pb-10 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 bg-grid-fade" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
              <ArrowLeft className="h-4 w-4" /> Back to Applications
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center">
                <Rocket className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-sm font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
            </div>
          </div>

          <div className="relative text-center pb-2">
            <div className="relative inline-block">
              <Particles />
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center glow-blue"
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-display text-4xl md:text-5xl font-bold mt-6"
            >
              Application Submitted <span className="text-gradient">✓</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-3"
            >
              {data.fullName ? `Nice work, ${data.fullName.split(" ")[0]}. ` : ""}Your file is on the launchpad.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 md:px-12 pb-20 space-y-8">
        {/* Central status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#06B6D4] mb-2">Active Application</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">{role}</h2>
              <p className="text-muted-foreground mt-1">{company} · Remote / SF</p>
            </div>
            <Badge className="self-start md:self-auto bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.2em] gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              Under Review
            </Badge>
          </Card>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={Calendar} label="Days Applied" value="0" sub="Submitted today" />
          <MetricCard icon={TrendingUp} label="Profile" value="92%" sub="Add 2 projects" />
          <MetricCard icon={Sparkles} label="Response Rate" value="68%" sub="Above average" />
          <MetricCard icon={Clock} label="Next Update" value="2d" sub="Est. recruiter ping" />
        </div>

        {/* Timeline + Activity */}
        <div className="grid md:grid-cols-5 gap-6">
          <Card className="md:col-span-3 glass-card border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Mission Progress</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live</span>
            </div>
            <Timeline steps={timeline} />
          </Card>

          <Card className="md:col-span-2 glass-card border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Activity Log</h3>
              <Activity className="h-4 w-4 text-[#06B6D4]" />
            </div>
            <ul className="space-y-4">
              {activity.map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <a.icon className="h-4 w-4 text-[#06B6D4]" />
                  </span>
                  <div className="text-sm">
                    <div>{a.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="glass" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Submit another application
          </Button>
        </div>
      </section>
    </div>
  );
}

function ApplicationList({ company, role, onOpen, onBack }: { company: string; role: string; onOpen: () => void; onBack: () => void }) {
  const apps = [
    { company, role, status: "Under Review", color: "amber" },
    { company: "Northwind Labs", role: "Frontend Intern", status: "Interview", color: "cyan" },
    { company: "Lumen AI", role: "ML Research Intern", status: "Decision", color: "emerald" },
  ];
  return (
    <div className="min-h-screen bg-app text-foreground px-6 md:px-12 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Home
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold mb-2">Your Applications</h1>
        <p className="text-muted-foreground mb-8">Every mission in flight, one signal feed.</p>

        <AnimatePresence>
          <ul className="space-y-3">
            {apps.map((a, i) => (
              <motion.li
                key={a.company}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                layout
              >
                <button
                  onClick={onOpen}
                  className="w-full text-left glass-card rounded-2xl p-5 flex items-center justify-between hover:border-[var(--brand)]/40 hover:glow-soft transition"
                >
                  <div>
                    <div className="font-display text-lg font-semibold">{a.role}</div>
                    <div className="text-sm text-muted-foreground">{a.company}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#06B6D4]">{a.status}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
