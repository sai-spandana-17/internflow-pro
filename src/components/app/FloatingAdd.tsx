import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export function FloatingAdd() {
  const { state, dispatch } = useStore();
  if (!state.authed) return null;
  if (state.view === "newapp" || state.view === "signin") return null;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => dispatch({ type: "view", view: "newapp" })}
      aria-label="New application"
      className="md:hidden fixed bottom-20 right-5 z-40 h-[52px] w-[52px] rounded-full bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center text-white mb-[env(safe-area-inset-bottom)]"
      style={{ boxShadow: "0 0 24px rgba(59,130,246,0.7), 0 8px 24px rgba(0,0,0,0.4)" }}
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
