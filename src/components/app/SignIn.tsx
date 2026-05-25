import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Zap, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";

export function SignInPage() {
  const { dispatch } = useStore();
  const toast = useToast();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email required";
    if (pw.length < 6) e.pw = "6+ characters";
    if (mode === "up" && pw !== pw2) e.pw2 = "Passwords don't match";
    setErr(e);
    if (Object.keys(e).length) return;
    dispatch({ type: "auth", user: { name: email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Explorer", email } });
    toast(mode === "in" ? "Welcome back" : "Account created");
  };

  return (
    <div className="min-h-screen bg-app relative flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-grid bg-grid-fade opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--brand)]/15 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass-card rounded-2xl p-8 border border-white/10">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] glow-soft flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-1">{mode === "in" ? "Welcome back" : "Create account"}</h1>
        <p className="text-sm text-muted-foreground mb-6">{mode === "in" ? "Sign in to your mission control." : "Start tracking your internship journey."}</p>

        <div className="flex gap-1 p-1 rounded-lg bg-white/5 mb-6 text-sm">
          {(["in", "up"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`relative flex-1 py-2 rounded-md font-medium ${mode === m ? "text-foreground" : "text-muted-foreground"}`}>
              {mode === m && <motion.span layoutId="modepill" className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--brand)]/30 to-[#06B6D4]/20 border border-[var(--brand)]/30" />}
              <span className="relative">{m === "in" ? "Sign In" : "Create Account"}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <Field icon={Mail} placeholder="you@domain.com" value={email} onChange={setEmail} err={err.email} type="email" onEnter={submit} />
          <Field icon={Lock} placeholder="Password" value={pw} onChange={setPw} err={err.pw}
            type={show ? "text" : "password"} rightIcon={show ? EyeOff : Eye} onRight={() => setShow(s => !s)} onEnter={submit} />
          <AnimatePresence>
            {mode === "up" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Field icon={Lock} placeholder="Confirm password" value={pw2} onChange={setPw2} err={err.pw2} type={show ? "text" : "password"} onEnter={submit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {mode === "in" && <button className="text-xs text-[#06B6D4] mt-3 hover:underline" onClick={() => toast("Reset link sent (demo)", "info")}>Forgot password?</button>}

        <Button variant="hero" className="w-full h-11 mt-6" onClick={submit} onKeyDown={(e) => e.key === "Enter" && submit()}>
          {mode === "in" ? "Sign In →" : "Create Account →"}
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="flex-1 h-px bg-white/10" />OR<div className="flex-1 h-px bg-white/10" /></div>

        <button onClick={() => { dispatch({ type: "auth", user: { name: "Alex Rivera", email: "alex@gmail.com" } }); toast("Signed in with Google"); }}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-md border border-white/10 hover:bg-white/5 transition text-sm">
          <Chrome className="h-4 w-4" /> Continue with Google
        </button>
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, err, type, rightIcon: RI, onRight, onEnter }: {
  icon: typeof Mail; placeholder: string; value: string; onChange: (v: string) => void; err?: string; type: string;
  rightIcon?: typeof Eye; onRight?: () => void; onEnter?: () => void;
}) {
  return (
    <div>
      <div className={`relative flex items-center rounded-lg border bg-white/[0.02] transition ${err ? "border-red-500/60 glow-err" : "border-white/10 focus-within:border-[var(--brand)]/60 focus-within:glow-soft"}`}>
        <Icon className="h-4 w-4 text-muted-foreground ml-3" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
          onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground" />
        {RI && <button onClick={onRight} type="button" className="px-3 text-muted-foreground hover:text-foreground"><RI className="h-4 w-4" /></button>}
      </div>
      {err && <div className="text-[11px] text-red-400 mt-1 ml-1">{err}</div>}
    </div>
  );
}
