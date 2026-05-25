import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowDown, Sparkles, LineChart, Calendar, Target, BrainCircuit,
  Briefcase, Trophy, Building2, Users, Zap, Star, Menu, X, Heart, PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useDocTitle } from "@/hooks/use-doc-title";

const headlineWords = ["Land", "Your", "Dream", "Internship", "Faster."];

const stats = [
  { v: 2400, suffix: "+", l: "Students", i: Users },
  { v: 15000, suffix: "+", l: "Applications Tracked", i: Briefcase },
  { v: 94, suffix: "%", l: "Interview Rate", i: Trophy },
  { v: 150, suffix: "+", l: "Partner Companies", i: Building2 },
];

const features = [
  { i: LineChart, t: "Smart Tracking", d: "Every application, every stage — visualised as a living pipeline." },
  { i: PenLine, t: "AI Writing", d: "Generate tailored cover letters and 'Why this company?' essays in seconds." },
  { i: Sparkles, t: "Deep Analytics", d: "Spot patterns in your funnel — what works, what stalls, where to push." },
  { i: Calendar, t: "Deadline Calendar", d: "Never miss a submission, interview, or follow-up window again." },
  { i: Target, t: "Goals & Milestones", d: "Weekly targets, streaks, and unlockable milestones to stay consistent." },
  { i: BrainCircuit, t: "Interview Prep", d: "Round-by-round notes, common questions, and outcome tracking." },
];

const steps = [
  { n: "01", t: "Create account", d: "Sign up in 30 seconds with email or Google." },
  { n: "02", t: "Add applications", d: "Log every role you apply to with one fast form." },
  { n: "03", t: "Track progress", d: "Watch your pipeline move through every stage." },
  { n: "04", t: "Land the offer", d: "Stay organised, stay sharp — and close the deal." },
];

const testimonials = [
  { name: "Aryan S.", school: "IIT Bombay", q: "I went from 40 scattered applications in a spreadsheet to a real pipeline. Landed offers from two YC startups." },
  { name: "Priya M.", school: "BITS Pilani", q: "The AI essay tool alone saved me 20+ hours. Three interviews in the first two weeks of using it." },
  { name: "Rahul K.", school: "NIT Trichy", q: "Streaks and weekly goals kept me consistent. Got my dream ML internship at a Series B startup." },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

export function LandingHome() {
  useDocTitle("InternFlow — Your internship. Your mission.");
  const { dispatch } = useStore();
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (v: "signin" | "privacy" | "terms") => { setMenuOpen(false); dispatch({ type: "view", view: v }); };
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Nav */}
      <motion.header
        animate={{ y: navHidden ? -80 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-app/70 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center glow-soft">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-base font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => scrollTo("features")} className="hover:text-foreground">Features</button>
            <button onClick={() => scrollTo("how")} className="hover:text-foreground">How it works</button>
            <button onClick={() => go("signin")} className="hover:text-foreground">Sign In</button>
            <Button variant="hero" size="sm" onClick={() => go("signin")}>Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
          </nav>
          <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-foreground"><Menu className="h-5 w-5" /></button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-app/95 backdrop-blur-md md:hidden">
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/5">
              <span className="font-display font-bold">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-lg">
              <button onClick={() => scrollTo("features")} className="text-left py-2">Features</button>
              <button onClick={() => scrollTo("how")} className="text-left py-2">How it works</button>
              <button onClick={() => go("signin")} className="text-left py-2">Sign In</button>
              <Button variant="hero" size="lg" onClick={() => go("signin")}>Get Started <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="top" className="relative px-5 md:px-10 pt-32 pb-24">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] max-w-full rounded-full bg-[var(--brand)]/20 blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-[#06B6D4] mb-8">
            ✦ Built for ambitious students
          </motion.div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
            {headlineWords.map((w, i) => (
              <motion.span key={w + i} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-3 ${w === "Dream" ? "text-gradient" : ""}`}>{w}</motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            One luminous dashboard for every application, interview, and offer. Track smarter, write faster, land sooner.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" onClick={() => go("signin")} className="h-12 px-7 text-base">
              Start Free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="lg" onClick={() => scrollTo("how")} className="h-12 px-6 text-base">
              See how it works <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="mt-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Joined by 2,400+ students from IIT, NIT, BITS and top universities
          </motion.p>

          {/* Floating mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 max-w-2xl mx-auto">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card rounded-2xl p-5 border border-white/10 text-left space-y-2.5">
              {[
                { c: "Google", r: "SWE Intern", s: "Under Review", color: "#F59E0B" },
                { c: "Stripe", r: "Product", s: "Interview", color: "#06B6D4" },
                { c: "Anthropic", r: "ML Research", s: "Offer", color: "#10B981" },
              ].map(row => (
                <div key={row.c} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--brand)]/30 to-[#06B6D4]/15 border border-white/10 flex items-center justify-center font-display font-bold text-sm">{row.c[0]}</div>
                    <div>
                      <div className="text-sm font-semibold">{row.r}</div>
                      <div className="text-xs text-muted-foreground">{row.c}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full" style={{ background: row.color + "22", color: row.color }}>{row.s}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative px-5 md:px-10 py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.l} className="text-center">
              <s.i className="h-5 w-5 text-[#06B6D4] mx-auto mb-2" />
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient"><CountUp to={s.v} suffix={s.suffix} /></div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <Section id="features" eyebrow="// Capabilities" title="Built for the long-haul search.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={f.t} idx={i} {...f} />)}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" eyebrow="// Process" title="From zero to offer.">
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px border-t border-dashed border-white/15" />
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }} className="relative text-center">
              <div className="relative z-10 mx-auto h-16 w-16 rounded-2xl glass-card border border-[var(--brand)]/30 flex items-center justify-center font-display text-xl font-bold text-[#06B6D4] glow-soft">{s.n}</div>
              <h3 className="font-display text-lg font-semibold mt-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow="// Loved by students" title="Real students. Real offers.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }} className="glass-card rounded-2xl p-6">
              <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />)}</div>
              <p className="text-sm leading-relaxed text-foreground/90">"{t.q}"</p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.school}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative px-5 md:px-10 py-24">
        <div className="relative max-w-3xl mx-auto text-center glass-card rounded-3xl p-10 md:p-14 overflow-hidden border border-[var(--brand)]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/20 via-transparent to-[#06B6D4]/15 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Ready to launch your career?</h2>
            <motion.div animate={{ boxShadow: ["0 0 24px rgba(59,130,246,0.4)", "0 0 48px rgba(59,130,246,0.75)", "0 0 24px rgba(59,130,246,0.4)"] }}
              transition={{ duration: 2.4, repeat: Infinity }} className="inline-block rounded-md mt-8">
              <Button variant="hero" size="lg" onClick={() => go("signin")} className="h-12 px-7 text-base">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <p className="mt-5 text-xs text-muted-foreground">No credit card required · Free forever · Takes 30 seconds</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center"><Zap className="h-3 w-3 text-white" /></div>
            <span className="font-display font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
            <span className="text-muted-foreground text-xs ml-2">Your internship. Your mission.</span>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs text-muted-foreground">
            <button onClick={() => scrollTo("features")} className="hover:text-foreground">Features</button>
            <button onClick={() => scrollTo("how")} className="hover:text-foreground">How it works</button>
            <button onClick={() => go("signin")} className="hover:text-foreground">Sign In</button>
            <button onClick={() => go("privacy")} className="hover:text-foreground">Privacy Policy</button>
            <button onClick={() => go("terms")} className="hover:text-foreground">Terms of Service</button>
          </nav>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-red-400 text-red-400" /> for students
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-5 md:px-10 py-20 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-[#06B6D4] mb-3">{eyebrow}</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function FeatureCard({ i: Icon, t, d, idx }: { i: typeof Sparkles; t: string; d: string; idx: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: idx * 0.08, duration: 0.5 }} whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 group">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[#06B6D4]/10 border border-[var(--brand)]/30 flex items-center justify-center mb-4 group-hover:glow-soft transition">
        <Icon className="h-5 w-5 text-[#06B6D4]" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-1.5">{t}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
    </motion.div>
  );
}
