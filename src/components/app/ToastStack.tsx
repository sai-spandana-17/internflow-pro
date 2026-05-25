import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function ToastStack() {
  const { state, dispatch } = useStore();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {state.toasts.map(t => {
          const Icon = t.kind === "success" ? CheckCircle2 : t.kind === "error" ? AlertCircle : Info;
          const color = t.kind === "success" ? "#10B981" : t.kind === "error" ? "#EF4444" : "#06B6D4";
          return (
            <motion.div key={t.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              className="pointer-events-auto glass-card rounded-lg px-4 py-3 flex items-center gap-3 min-w-[260px] border" style={{ borderColor: color + "55" }}>
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-sm flex-1">{t.message}</span>
              <button onClick={() => dispatch({ type: "dismissToast", id: t.id })} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
