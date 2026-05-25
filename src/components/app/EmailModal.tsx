import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function EmailModal() {
  const { state, dispatch } = useStore();
  const app = state.applications.find(a => a.id === state.emailModalAppId);
  return (
    <AnimatePresence>
      {app && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="glass-card rounded-2xl max-w-lg w-full border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-4 w-4" /> Inbox preview</div>
              <button onClick={() => dispatch({ type: "openEmailModal", appId: null })} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6">
              <div className="text-xs text-muted-foreground">From <span className="text-foreground">careers@{app.company.toLowerCase().replace(/[^a-z]/g, "")}.com</span></div>
              <div className="text-xs text-muted-foreground mt-0.5">To <span className="text-foreground">{app.email}</span></div>
              <h3 className="font-display text-xl font-bold mt-4">We received your application ✓</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Hi {app.fullName.split(" ")[0]}, thanks for applying to the <span className="text-foreground">{app.role}</span> intern role at {app.company}. Our team is reviewing your materials and we'll keep you posted here and inside InternFlow.
              </p>
              <div className="mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs">
                <div className="text-muted-foreground">Application ID</div>
                <div className="font-mono">{app.id}-{Date.now().toString(36).slice(-6)}</div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="hero" onClick={() => dispatch({ type: "openEmailModal", appId: null })}>Got it</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
