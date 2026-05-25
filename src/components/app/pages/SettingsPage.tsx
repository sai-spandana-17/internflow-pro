import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";
import { useDocTitle, APP_VERSION } from "@/hooks/use-doc-title";
import { supabase } from "@/integrations/supabase/client";

const ACCENTS: { color: string; label: string }[] = [
  { color: "#3B82F6", label: "Blue" },
  { color: "#06B6D4", label: "Cyan" },
  { color: "#8B5CF6", label: "Purple" },
  { color: "#10B981", label: "Green" },
];


export function SettingsPage() {
  useDocTitle("Settings — InternFlow");
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [delOpen, setDelOpen] = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [wish, setWish] = useState("");

  const goalPct = Math.min(100, Math.round((state.streak / state.settings.weeklyGoal) * 100));

  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto space-y-8">
      <PageHeader title="Settings" subtitle="Tune your mission parameters." />

      <Section title="Profile">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center font-display text-2xl font-bold glow-soft">
            {name.split(" ").map(p => p[0]).slice(0, 2).join("")}
          </div>
          <button onClick={() => toast("Avatar upload (demo)", "info")} className="text-xs text-[#06B6D4] hover:underline">Change avatar</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <Field label="Name"><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent px-3 py-2 text-sm outline-none" /></Field>
          <Field label="Email"><input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-2 text-sm outline-none" /></Field>
        </div>
        <Button variant="hero" className="mt-3" onClick={() => { toast("Profile saved"); }}>Save profile</Button>
      </Section>

      <Section title="Notifications">
        {[
          { k: "notifEmail" as const, l: "Email reminders" },
          { k: "notifStatus" as const, l: "Status updates" },
          { k: "notifDigest" as const, l: "Weekly digest" },
        ].map(t => (
          <Toggle key={t.k} label={t.l} on={state.settings[t.k]} onChange={(v) => dispatch({ type: "settings", patch: { [t.k]: v } as Partial<typeof state.settings> })} />
        ))}
      </Section>

      <Section title="Goals">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <motion.circle cx="18" cy="18" r="15" fill="none" stroke="url(#gg)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${goalPct * 0.94} 100`} initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${goalPct * 0.94} 100` }} transition={{ duration: 1 }} />
              <defs><linearGradient id="gg"><stop stopColor="var(--brand)" /><stop offset="1" stopColor="#06B6D4" /></linearGradient></defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold">{goalPct}%</span>
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weekly application target</label>
            <input type="number" min={1} value={state.settings.weeklyGoal} onChange={e => dispatch({ type: "setWeeklyGoal", goal: Number(e.target.value) || 1 })}
              className="block mt-1 glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10 w-24" />
          </div>
        </div>
        <div className="mt-5">
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dream companies wishlist</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.settings.wishlist.map(c => (
              <span key={c} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[#06B6D4]">
                {c}<button onClick={() => dispatch({ type: "removeWishlist", company: c })} className="hover:text-red-400"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={wish} onChange={e => setWish(e.target.value)} placeholder="Add a company…" className="flex-1 glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10" />
            <Button variant="glass" onClick={() => { if (wish.trim()) { dispatch({ type: "addWishlist", company: wish.trim() }); setWish(""); } }}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </Section>

      <Section title="Appearance">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Accent color</div>
        <div className="flex gap-5">
          {ACCENTS.map(a => {
            const selected = state.settings.accentColor.toLowerCase() === a.color.toLowerCase();
            return (
              <button key={a.color} onClick={() => { dispatch({ type: "setAccentColor", color: a.color }); toast(`Accent: ${a.label}`); }}
                className="group flex flex-col items-center gap-2" title={a.label}>
                <span className={`relative h-12 w-12 rounded-xl border-2 transition flex items-center justify-center ${selected ? "border-white/80" : "border-white/10 hover:border-white/30"}`}
                  style={{ background: a.color, boxShadow: selected ? `0 0 0 3px ${a.color}33, 0 0 24px ${a.color}80` : undefined }}>
                  {selected && <Check className="h-5 w-5 text-white drop-shadow" strokeWidth={3} />}
                </span>
                <span className={`text-xs ${selected ? "text-foreground" : "text-muted-foreground"}`}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </Section>


      <Section title="Account">
        <Button variant="glass" onClick={() => toast("Password reset email sent", "info")}>Change password</Button>
        <div className="mt-6 glass-card rounded-2xl p-5 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm">Danger zone</div>
              <p className="text-xs text-muted-foreground mt-1">Permanently delete your account and all application history.</p>
            </div>
            <Button variant="glass" className="border-red-500/40 hover:bg-red-500/10 text-red-300" onClick={() => setDelOpen(true)}>Delete account</Button>
          </div>
        </div>
      </Section>

      {delOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDelOpen(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} className="glass-card rounded-2xl border border-red-500/40 p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-bold mb-2">Delete account?</h3>
            <p className="text-sm text-muted-foreground mb-4">This action can't be undone. Type <span className="text-red-300 font-mono">DELETE</span> to confirm.</p>
            <input value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="DELETE"
              className="w-full mb-4 rounded-lg px-3 py-2 text-sm bg-white/[0.03] border border-white/10 outline-none focus:border-red-500/60" />
            <div className="flex gap-2 justify-end">
              <Button variant="glass" onClick={() => { setDelOpen(false); setDelConfirm(""); }}>Cancel</Button>
              <Button variant="glass" disabled={delConfirm !== "DELETE"}
                className="border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-40"
                onClick={async () => { try { await supabase.auth.signOut(); } catch { /* ignore */ } dispatch({ type: "signout" }); }}>Delete</Button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="text-center text-[10px] text-muted-foreground pt-4">InternFlow v{APP_VERSION}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">{label}</label>
      <div className="glass-card rounded-lg border border-white/10 focus-within:border-[var(--brand)]/60 transition">{children}</div>
    </div>
  );
}
function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm">{label}</span>
      <button onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-[var(--brand)] to-[#06B6D4]" : "bg-white/10"}`}>
        <motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
      </button>
    </div>
  );
}
