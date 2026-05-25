import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, LineChart, Radio, Briefcase, Trophy, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const headline = ["Track", "Your", "Internship", "Journey"];
const stats = [
  { v: "2,400+", l: "Applications Tracked", i: Briefcase },
  { v: "94%", l: "Success Rate", i: Trophy },
  { v: "150+", l: "Partner Companies", i: Building2 },
];
const features = [
  { i: LineChart, t: "Smart Tracking", d: "Every application, every stage — visualized as a living mission timeline." },
  { i: Sparkles, t: "Pipeline View", d: "See where every role sits across review, interview, and offer in a single scan." },
  { i: Radio, t: "Timely Alerts", d: "Status changes, deadlines and follow-ups surface the moment they need you." },
];

export function LandingHome() {
  const { dispatch } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div className="min-h-screen relative">
      <button onClick={() => dispatch({ type: "view", view: "signin" })}
        className="absolute top-6 right-6 md:top-8 md:right-12 z-10 text-xs text-muted-foreground hover:text-[#06B6D4] transition">
        Already have an account? <span className="text-[#06B6D4]">Sign in →</span>
      </button>
      <section className="relative px-6 md:px-12 pt-16 pb-24">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] max-w-full rounded-full bg-[var(--brand)]/20 blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-[#06B6D4] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-pulse" /> Mission Control · Spring 2026
          </motion.div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
            {headline.map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-4 ${i === 2 ? "text-gradient" : ""}`}>{w}</motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your internship. Your mission. Every submission, interview, and offer — coordinated in one luminous dashboard.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.6 }} className="mt-10 flex justify-center">
            <motion.div animate={{ boxShadow: ["0 0 24px rgba(59,130,246,0.4)", "0 0 48px rgba(59,130,246,0.75)", "0 0 24px rgba(59,130,246,0.4)"] }}
              transition={{ duration: 2.4, repeat: Infinity }} className="rounded-md">
              <Button variant="hero" size="lg" onClick={() => dispatch({ type: "view", view: "signin" })} className="h-12 px-7 text-base">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 1.2 } } }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
            {stats.map(s => (
              <motion.div key={s.l} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }} className="glass-card rounded-2xl p-6">
                <s.i className="h-5 w-5 text-[#06B6D4] mb-3" />
                <div className="font-display text-4xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mt-1">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-[#06B6D4] mb-3">// Capabilities</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Built for the long-haul search.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4 }} className="glass-card rounded-2xl p-7 group">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[#06B6D4]/10 border border-[var(--brand)]/30 flex items-center justify-center mb-5 group-hover:glow-soft transition">
                <f.i className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
