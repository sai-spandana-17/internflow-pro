import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, FileText, Calendar, Sparkles, TrendingUp, Clock, Activity, Loader2, Printer, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast, STATUS_LABEL, STATUS_COLOR, NEXT_STATUS, type Referral } from "@/lib/store";
import { useServerFn } from "@tanstack/react-start";
import { generateEssay } from "@/lib/ai.functions";

export function AppDetailPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const app = state.applications.find(a => a.id === state.selectedAppId);
  const [coverLoading, setCoverLoading] = useState(false);
  const [cover, setCover] = useState(app?.coverLetter ?? "");
  const [savedFlash, setSavedFlash] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [ref, setRef] = useState<Referral>(app?.referral ?? { name: "", email: "", relationship: "", followUp: "", status: "none" });
  const aiFn = useServerFn(generateEssay);
  const appId = app?.id;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [appId]);

  useEffect(() => {
    if (!appId) return;
    if (cover === (app?.coverLetter ?? "")) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      dispatch({ type: "setCoverLetter", id: appId, coverLetter: cover });
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1500);
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cover, appId]);

  if (!app) return <div className="p-12 text-center text-muted-foreground">No application selected. <button className="text-[#06B6D4] underline" onClick={() => dispatch({ type: "view", view: "apps" })}>Go to applications</button></div>;

  const days = Math.floor((Date.now() - app.submittedAt) / (1000 * 60 * 60 * 24));
  const timeline = [
    { l: "Submitted", k: "complete" as const },
    { l: "Under Review", k: app.status === "review" ? "active" as const : "complete" as const },
    { l: "Interview Scheduled", k: app.status === "interview" ? "active" as const : (["decision", "offer", "rejected"].includes(app.status) ? "complete" as const : "pending" as const) },
    { l: "Final Decision", k: app.status === "decision" ? "active" as const : (["offer", "rejected"].includes(app.status) ? "complete" as const : "pending" as const) },
  ];

  const genCover = async () => {
    setCoverLoading(true);
    try { const { text } = await aiFn({ data: { role: app.role, company: app.company, skills: app.skills, kind: "cover" } }); setCover(text); toast("Cover letter ready"); }
    catch { toast("AI request failed", "error"); }
    setCoverLoading(false);
  };

  const exportPdf = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>${app.company} - ${app.role}</title><style>body{font-family:system-ui;padding:40px;max-width:720px;margin:auto;color:#111;}h1{margin:0 0 4px;}h2{margin:24px 0 6px;border-bottom:1px solid #ddd;padding-bottom:4px;}p{line-height:1.5;}</style></head><body>
      <h1>${app.role} — ${app.company}</h1>
      <p><strong>Status:</strong> ${STATUS_LABEL[app.status]} · <strong>Submitted:</strong> ${new Date(app.submittedAt).toLocaleDateString()}</p>
      <h2>Applicant</h2><p>${app.fullName} · ${app.email} · ${app.phone}</p>
      <h2>Skills</h2><p>${app.skills.join(", ")}</p>
      <h2>Why Join</h2><p>${app.whyJoin}</p>
      ${app.notes ? `<h2>Notes</h2><p>${app.notes}</p>` : ""}
      <h2>Timeline</h2><ul>${timeline.map(t => `<li>${t.l} (${t.k})</li>`).join("")}</ul>
      </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto space-y-8">
      <button onClick={() => dispatch({ type: "view", view: "apps" })} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to applications</button>

      <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--brand)]/30 to-[#06B6D4]/15 border border-white/10 flex items-center justify-center font-display text-2xl font-bold">{app.company[0]}</div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#06B6D4]">Active Application</div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{app.role}</h1>
            <p className="text-muted-foreground">{app.company} · {app.companyLocation}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-3 py-1.5 rounded-full" style={{ background: STATUS_COLOR[app.status] + "22", color: STATUS_COLOR[app.status], border: `1px solid ${STATUS_COLOR[app.status]}44` }}>
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ background: STATUS_COLOR[app.status] }} /><span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[app.status] }} /></span>
            {STATUS_LABEL[app.status]}
          </span>
          {app.status !== "offer" && app.status !== "rejected" && (
            <Button variant="glass" onClick={() => { dispatch({ type: "advanceStatus", id: app.id }); toast(`Advanced → ${STATUS_LABEL[NEXT_STATUS[app.status]]}`); }}>
              Advance Status<ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button variant="glass" onClick={exportPdf}><Printer className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric icon={Calendar} l="Days Applied" v={String(days)} sub={days === 0 ? "Today" : `since ${new Date(app.submittedAt).toLocaleDateString()}`} />
        <Metric icon={TrendingUp} l="Profile" v={app.profileCompleteness + "%"} sub="Completeness" />
        <Metric icon={Sparkles} l="Response Rate" v="68%" sub="Above average" />
        <Metric icon={Clock} l="Next Update" v="2d" sub="Est. recruiter ping" />
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 glass-card rounded-2xl p-6 md:p-8">
          <h3 className="font-display text-xl font-bold mb-6">Mission Progress</h3>
          <ol className="relative space-y-6 pl-6">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
            {timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[18px] top-1 h-3 w-3 rounded-full ${t.k === "complete" ? "bg-[#10B981]" : t.k === "active" ? "bg-[#F59E0B]" : "bg-white/15"}`}
                  style={t.k === "active" ? { boxShadow: "0 0 12px #F59E0B" } : {}} />
                <div className="text-sm font-semibold">{t.l}</div>
                <div className="text-xs text-muted-foreground capitalize">{t.k === "complete" ? "Completed" : t.k === "active" ? "In progress" : "Pending"}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-2 glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl font-bold">Activity</h3><Activity className="h-4 w-4 text-[#06B6D4]" /></div>
          <ul className="space-y-4">
            {[
              { i: CheckCircle2, t: "Application submitted", time: `${days}d ago` },
              { i: Mail, t: "Confirmation email sent", time: `${days}d ago` },
              { i: FileText, t: "Resume parsed", time: `${days}d ago` },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"><a.i className="h-4 w-4 text-[#06B6D4]" /></span>
                <div className="text-sm"><div>{a.t}</div><div className="text-xs text-muted-foreground">{a.time}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display text-xl font-bold">Cover Letter</h3>
          <div className="flex items-center gap-2">
            {savedTick && <span className="text-xs text-[#10B981] flex items-center gap-1"><Check className="h-3 w-3" />Saved</span>}
            <Button variant="glass" onClick={() => {
              dispatch({ type: "setCoverLetter", id: app.id, coverLetter: cover });
              setSavedFlash(true);
              setTimeout(() => setSavedFlash(false), 800);
              toast("Saved to application");
            }}>Save to Application</Button>
            <Button variant="hero" onClick={genCover} disabled={coverLoading}>{coverLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Generate</Button>
          </div>
        </div>
        <textarea value={cover} onChange={e => setCover(e.target.value)} rows={8} placeholder="AI-generated cover letter will appear here…"
          className={`w-full glass-card rounded-lg border p-3 text-sm bg-transparent outline-none transition-all duration-300 ${savedFlash ? "border-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.5)]" : "border-white/10 focus:border-[var(--brand)]/60"}`} />
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <button onClick={() => setShowRef(s => !s)} className="w-full flex items-center justify-between">
          <h3 className="font-display text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-[#06B6D4]" />Referral Contact</h3>
          <ArrowRight className={`h-4 w-4 transition ${showRef ? "rotate-90" : ""}`} />
        </button>
        {showRef && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 grid md:grid-cols-2 gap-3">
            {(["name", "email", "relationship", "followUp"] as const).map(k => (
              <input key={k} value={ref[k]} onChange={e => setRef({ ...ref, [k]: e.target.value })} placeholder={k}
                type={k === "followUp" ? "date" : "text"}
                className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent outline-none border border-white/10 [color-scheme:dark]" />
            ))}
            <select value={ref.status} onChange={e => setRef({ ...ref, status: e.target.value as Referral["status"] })} className="glass-card rounded-lg px-3 py-2.5 text-sm bg-transparent outline-none border border-white/10">
              <option value="none">Not Contacted</option><option value="reached">Reached Out</option><option value="replied">Replied</option>
            </select>
            <Button variant="hero" onClick={() => { dispatch({ type: "setReferral", appId: app.id, referral: ref }); toast("Referral saved"); }}>Save</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, l, v, sub }: { icon: typeof Calendar; l: string; v: string; sub: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3"><span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{l}</span><Icon className="h-4 w-4 text-[#06B6D4]" /></div>
      <div className="font-display text-3xl font-bold text-gradient">{v}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </motion.div>
  );
}
