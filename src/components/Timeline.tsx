import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface TimelineStep {
  label: string;
  description?: string;
  status: "complete" | "active" | "pending";
}

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  return (
    <ol className="relative space-y-6">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="relative pl-12">
            {!last && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%+0.5rem)] w-px ${
                  step.status === "complete" ? "bg-[var(--brand)]/60" : "bg-white/10"
                }`}
              />
            )}
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0A0F1C]">
              {step.status === "complete" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] shadow-[0_0_12px_rgba(59,130,246,0.8)]">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              {step.status === "active" && (
                <span className="relative flex h-3 w-3">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-[#06B6D4]"
                    animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
                </span>
              )}
              {step.status === "pending" && (
                <span className="h-3 w-3 rounded-full border border-white/25" />
              )}
            </div>
            <div className="pt-0.5">
              <div
                className={`font-display text-base ${
                  step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-sm text-muted-foreground mt-0.5">{step.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
