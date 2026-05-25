import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ProgressBarProps {
  value: number; // 0..100
  steps: string[];
  currentStep: number;
}

export function ProgressBar({ value, steps, currentStep }: ProgressBarProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const width = useTransform(spring, (v) => `${v}%`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {steps.map((s, i) => (
          <span key={s} className={i <= currentStep ? "text-[#06B6D4]" : ""}>
            {String(i + 1).padStart(2, "0")} · {s}
          </span>
        ))}
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          style={{ width }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--brand)] to-[#06B6D4] shadow-[0_0_18px_rgba(59,130,246,0.7)]"
        />
      </div>
    </div>
  );
}
