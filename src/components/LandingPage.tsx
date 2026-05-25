import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, LineChart, Radio, Briefcase, Trophy, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";

interface LandingPageProps {
  onStart: () => void;
}

const headline = ["Track", "Your", "Internship", "Journey"];

const features = [
  {
    icon: LineChart,
    title: "Smart Tracking",
    desc: "Every application, every stage. Visualized as a living mission timeline that never loses signal.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    desc: "Adaptive recommendations on which roles to chase next, modeled on patterns from 2,400+ candidates.",
  },
  {
    icon: Radio,
    title: "Real-time Updates",
    desc: "Status changes stream into your dashboard the moment they happen — no inbox archaeology required.",
  },
];

export function LandingPage({ onStart }: LandingPageProps) {
  const featuresRef = useRef<HTMLDivElement>(null);
  const inView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-app text-foreground">
      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] glow-soft flex items-center justify-center">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">InternFlow<span className="text-[#06B6D4]">.</span></span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button variant="hero" size="sm" onClick={onStart}>Apply Now</Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-12 md:pt-24 pb-20">
        <div className="absolute inset-0 dot-grid bg-grid-fade opacity-60 pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] max-w-full rounded-full bg-[var(--brand)]/20 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-[#06B6D4] mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
            Mission Control · Spring 2026
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-4 ${i === 2 ? "text-gradient" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            The application tracker that thinks like a launch director. Every submission, interview, and offer — coordinated in one luminous dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-10 flex justify-center"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 24px rgba(59,130,246,0.4)", "0 0 48px rgba(59,130,246,0.7)", "0 0 24px rgba(59,130,246,0.4)"] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="rounded-md"
            >
              <Button variant="hero" size="lg" onClick={onStart} className="h-12 px-7 text-base">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 1.2 } } }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left"
          >
            <StatCard value="2,400+" label="Applications" icon={Briefcase} delay={1.2} />
            <StatCard value="94%" label="Success Rate" icon={Trophy} delay={1.35} />
            <StatCard value="150+" label="Companies" icon={Building2} delay={1.5} />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-[#06B6D4] mb-3">// Capabilities</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Built for the long-haul search.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-7 group"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[#06B6D4]/10 border border-[var(--brand)]/30 flex items-center justify-center mb-5 group-hover:glow-soft transition">
                <f.icon className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-12 py-10 border-t border-white/5 text-xs text-muted-foreground flex justify-between">
        <span>© 2026 InternFlow Internships</span>
        <span className="tracking-[0.25em] uppercase">Status · All systems nominal</span>
      </footer>
    </div>
  );
}
