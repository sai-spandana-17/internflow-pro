import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, Upload, X, Sparkles, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast, type Application, type Status } from "@/lib/store";
import { COMPANIES, ROLES, type Company } from "@/lib/companies";
import { useServerFn } from "@tanstack/react-start";
import { generateEssay } from "@/lib/ai.functions";

const STEPS = ["Personal", "Projects & Skills", "Final"];

export function NewApplicationPage() {
  const { dispatch } = useStore();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [companyQ, setCompanyQ] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [project, setProject] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("");
  const [deadline, setDeadline] = useState(new Date().toISOString().slice(0, 10));
  const [why, setWhy] = useState("");
  const [notes, setNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const aiFn = useServerFn(generateEssay);

  const progress = [0, 30, 60, 100][step + 1] ?? 100;

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!fullName.trim()) e.fullName = "Required";
      if (!phone.trim()) e.phone = "Required";
      if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email required";
      if (!resume) e.resume = "Resume required";
    }
    if (s === 1) {
      if (!company) e.company = "Pick a company";
      if (skills.length === 0) e.skills = "At least 1 skill";
    }
    if (s === 2) {
      if (!role) e.role = "Pick a role";
      if (!availability) e.availability = "Choose availability";
      if (why.trim().length < 100) e.why = `${100 - why.trim().length} more characters`;
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) { setDir(1); setStep(step + 1); }
    else submit();
  };
  const back = useCallback(() => {
    if (step === 0) { dispatch({ type: "view", view: "apps" }); return; }
    setDir(-1); setStep(step - 1);
  }, [step, dispatch]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [back]);

  const submit = () => {
    const app: Application = {
      id: crypto.randomUUID(), role, company: company!.name, companyIndustry: company!.industry, companyLocation: company!.location,
      status: "review" as Status, submittedAt: Date.now(), deadline, availability, whyJoin: why, notes,
      skills, github, portfolio, linkedin, fullName, email, phone,
      resumeName: resume?.name, projectName: project?.name,
      profileCompleteness: Math.min(100, 60 + skills.length * 5),
      rounds: [],
    };
    dispatch({ type: "addApp", app });
    if (resume) dispatch({ type: "addDoc", doc: { id: crypto.randomUUID(), name: resume.name, type: "Resume", size: resume.size, uploadedAt: Date.now(), appId: app.id, version: "v1", ext: resume.name.split(".").pop() || "pdf" } });
    if (project) dispatch({ type: "addDoc", doc: { id: crypto.randomUUID(), name: project.name, type: "Project", size: project.size, uploadedAt: Date.now(), appId: app.id, version: "v1", ext: project.name.split(".").pop() || "zip" } });
    dispatch({ type: "addEvent", event: { id: crypto.randomUUID(), date: deadline, type: "deadline", title: `${company!.name} deadline`, appId: app.id } });
    toast("Application submitted ✓");
    dispatch({ type: "select", id: app.id });
    dispatch({ type: "view", view: "appdetail" });
  };

  const askAi = async () => {
    if (!role || !company) { toast("Pick role and company first", "error"); return; }
    setAiLoading(true);
    try {
      const { text } = await aiFn({ data: { role, company: company.name, skills, kind: "essay" } });
      setWhy(text);
      toast("AI draft ready");
    } catch (e) { toast("AI request failed", "error"); console.error(e); }
    setAiLoading(false);
  };

  return (
    <div className="px-4 md:px-12 py-10 max-w-3xl mx-auto">
      {/* Sticky progress */}
      <div className="sticky top-0 z-20 -mx-4 md:-mx-12 px-4 md:px-12 py-4 bg-app/90 backdrop-blur border-b border-white/5">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="uppercase tracking-[0.25em] text-[#06B6D4]">Step {step + 1} of 3</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
          <motion.div initial={false} animate={{ width: progress + "%" }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="h-full bg-gradient-to-r from-[var(--brand)] to-[#06B6D4]" style={{ boxShadow: "0 0 12px rgba(59,130,246,0.6)" }} />
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em]">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${i <= step ? "bg-[#06B6D4]" : "bg-white/15"}`} style={i === step ? { boxShadow: "0 0 10px #06B6D4" } : {}} />
              <span className={i === step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir}
          initial={{ opacity: 0, x: dir * 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 30 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold mb-4">Tell us who you are.</h2>
              <Grid2>
                <Input label="Full Name" v={fullName} on={setFullName} err={errors.fullName} />
                <Input label="Phone" v={phone} on={setPhone} err={errors.phone} />
                <Input label="Email" v={email} on={setEmail} err={errors.email} type="email" />
                <Input label="LinkedIn URL" v={linkedin} on={setLinkedin} placeholder="linkedin.com/in/…" />
              </Grid2>
              <FileDrop label="Resume" file={resume} setFile={setResume} err={errors.resume} accept=".pdf,.doc,.docx" />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold mb-4">Show us what you build.</h2>
              <CompanyPicker q={companyQ} setQ={setCompanyQ} picked={company} pick={setCompany} err={errors.company} />
              <Grid2>
                <Input label="GitHub URL" v={github} on={setGithub} placeholder="github.com/you" />
                <Input label="Portfolio URL" v={portfolio} on={setPortfolio} placeholder="you.dev" />
              </Grid2>
              <FileDrop label="Project File (optional)" file={project} setFile={setProject} accept=".zip,.pdf,.png,.jpg" />
              <SkillsInput skills={skills} setSkills={setSkills} input={skillInput} setInput={setSkillInput} err={errors.skills} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold mb-4">Why this mission?</h2>
              <Grid2>
                <Field label="Role" err={errors.role}>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none">
                    <option value="">Select a role…</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Application Deadline">
                  <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none [color-scheme:dark]" />
                </Field>
              </Grid2>
              <Field label="Availability" err={errors.availability}>
                <div className="flex gap-2 px-1 py-1">
                  {["Immediate", "1 Month", "3 Months"].map(a => (
                    <button key={a} type="button" onClick={() => setAvailability(a)}
                      className={`flex-1 py-2 rounded-md text-xs font-medium border transition ${availability === a ? "border-[var(--brand)] bg-[var(--brand)]/15 text-foreground glow-soft" : "border-white/10 text-muted-foreground hover:text-foreground"}`}>{a}</button>
                  ))}
                </div>
              </Field>
              <Field label={`Why Join Us? (${why.trim().length}/100+)`} err={errors.why}>
                <div className="relative">
                  <textarea value={why} onChange={e => setWhy(e.target.value)} rows={5} placeholder="What draws you to this company and role?"
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none resize-none" />
                  <button type="button" onClick={askAi} disabled={aiLoading}
                    className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-gradient-to-r from-[var(--brand)] to-[#06B6D4] text-white font-semibold disabled:opacity-50 glow-soft">
                    {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI Assist
                  </button>
                </div>
              </Field>
              <Field label="Optional Notes">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any extra context…"
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none resize-none" />
              </Field>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="glass" onClick={back}><ArrowLeft className="h-4 w-4" />Back</Button>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button variant="hero" onClick={next} className="h-11 px-6">
            {step < 2 ? <>Continue<ArrowRight className="h-4 w-4" /></> : <>Submit<Check className="h-4 w-4" /></>}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) { return <div className="grid md:grid-cols-2 gap-3">{children}</div>; }

function Field({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">{label}</label>
      <div className={`glass-card rounded-lg border ${err ? "border-red-500/60 glow-err" : "border-white/10 focus-within:border-[var(--brand)]/60"} transition`}>
        {children}
      </div>
      {err && <div className="text-[11px] text-red-400 mt-1">{err}</div>}
    </div>
  );
}
function Input({ label, v, on, err, type = "text", placeholder }: { label: string; v: string; on: (s: string) => void; err?: string; type?: string; placeholder?: string }) {
  return <Field label={label} err={err}><input value={v} onChange={e => on(e.target.value)} type={type} placeholder={placeholder} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" /></Field>;
}

function FileDrop({ label, file, setFile, err, accept }: { label: string; file: File | null; setFile: (f: File | null) => void; err?: string; accept?: string }) {
  const inp = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">{label}</label>
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
        className={`glass-card rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${drag ? "border-[#06B6D4] glow-soft" : err ? "border-red-500/60 glow-err" : "border-white/10 hover:border-[var(--brand)]/40"}`}
        onClick={() => inp.current?.click()}>
        {file ? (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#06B6D4]" />{file.name}<span className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</span></div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground"><Upload className="h-5 w-5" /><span className="text-sm">Drop file or click to upload</span></div>
        )}
        <input ref={inp} type="file" accept={accept} hidden onChange={e => e.target.files && setFile(e.target.files[0])} />
      </div>
      {err && <div className="text-[11px] text-red-400 mt-1">{err}</div>}
    </div>
  );
}

function CompanyPicker({ q, setQ, picked, pick, err }: { q: string; setQ: (s: string) => void; picked: Company | null; pick: (c: Company) => void; err?: string }) {
  const matches = q ? COMPANIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [rect, setRect] = useState<{ left: number; top: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!matches.length || picked || !inputRef.current) { setRect(null); return; }
    const update = () => {
      const r = inputRef.current!.getBoundingClientRect();
      setRect({ left: r.left, top: r.bottom + 6, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [matches.length, picked, q]);

  return (
    <Field label="Company" err={err}>
      <div className="px-3 py-2.5">
        {picked ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">{picked.name}</div>
              <div className="text-xs text-muted-foreground">{picked.industry} · {picked.location}</div>
            </div>
            <button onClick={() => { setQ(""); pick(null as never); }} className="text-muted-foreground hover:text-red-400"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <div className="relative">
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search 20 tech companies…" className="w-full bg-transparent text-sm outline-none" />
            {rect && matches.length > 0 && typeof document !== "undefined" && createPortal(
              <div
                className="fixed z-[200] glass-card rounded-lg border border-white/10 max-h-60 overflow-auto bg-[#111827]"
                style={{ left: rect.left, top: rect.top, width: rect.width }}
              >
                {matches.map(c => (
                  <button key={c.name} onClick={() => { pick(c); setQ(""); }} className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">{c.location}</div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4]">{c.industry}</span>
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>
        )}
      </div>
    </Field>
  );
}

function SkillsInput({ skills, setSkills, input, setInput, err }: { skills: string[]; setSkills: (s: string[]) => void; input: string; setInput: (s: string) => void; err?: string }) {
  return (
    <Field label="Skills" err={err}>
      <div className="px-3 py-2 flex flex-wrap gap-1.5 items-center">
        {skills.map(s => (
          <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[#06B6D4]">
            {s}<button onClick={() => setSkills(skills.filter(x => x !== s))} className="hover:text-red-400"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && input.trim()) { e.preventDefault(); if (!skills.includes(input.trim())) setSkills([...skills, input.trim()]); setInput(""); }
            else if (e.key === "Backspace" && !input && skills.length) setSkills(skills.slice(0, -1));
          }}
          placeholder={skills.length ? "" : "Type and press Enter"} className="flex-1 min-w-[120px] bg-transparent text-sm outline-none py-1" />
      </div>
    </Field>
  );
}
