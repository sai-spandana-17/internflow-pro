import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ value, label, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[var(--brand)]/10 blur-2xl group-hover:bg-[var(--brand)]/20 transition" />
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--brand)]/30 to-[#06B6D4]/20 flex items-center justify-center border border-[var(--brand)]/30">
          <Icon className="h-5 w-5 text-[#06B6D4]" />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      </div>
      <div className="font-display text-4xl md:text-5xl font-bold text-gradient">{value}</div>
    </motion.div>
  );
}
