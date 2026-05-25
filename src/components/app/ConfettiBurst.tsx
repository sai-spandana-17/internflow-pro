import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";

export function ConfettiBurst() {
  const { state, dispatch } = useStore();
  const parts = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 600,
    rot: Math.random() * 720,
    size: 4 + Math.random() * 8,
    color: ["var(--brand)", "#06B6D4", "#10B981", "#F59E0B"][i % 4],
    delay: Math.random() * 0.15,
  })), [state.showConfetti]);

  useEffect(() => {
    if (state.showConfetti) {
      const t = setTimeout(() => dispatch({ type: "confetti", on: false }), 1800);
      return () => clearTimeout(t);
    }
  }, [state.showConfetti, dispatch]);

  return (
    <AnimatePresence>
      {state.showConfetti && (
        <div className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center">
          {parts.map(p => (
            <motion.span key={p.id} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
              transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
              style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 12px ${p.color}` }}
              className="absolute rounded-sm" />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
