import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Zap, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";
import { useDocTitle } from "@/hooks/use-doc-title";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

function mapAuthError(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Incorrect email or password";
  if (m.includes("already registered") || m.includes("user already")) return "An account with this email already exists";
  if (m.includes("network") || m.includes("fetch")) return "Connection failed — check your internet";
  if (m.includes("email not confirmed")) return "email_not_confirmed";
  return msg || "Something went wrong";
}

export function SignInPage() {
  useDocTitle("Sign In — InternFlow");
  const { dispatch } = useStore();
  const toast = useToast();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setUnconfirmed(false);
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email required";
    if (pw.length < 6) e.pw = "6+ characters";
    if (mode === "up" && pw !== pw2) e.pw2 = "Passwords don't match";
    setErr(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email, password: pw,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        dispatch({ type: "view", view: "checkemail" });
        // remember email for resend
        dispatch({ type: "auth", user: { name: email.split("@")[0], email } });
        dispatch({ type: "signout" });
        dispatch({ type: "view", view: "checkemail" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) {
          const mapped = mapAuthError(error.message);
          if (mapped === "email_not_confirmed") { setUnconfirmed(true); return; }
          toast(mapped, "error");
          return;
        }
        // onAuthStateChange in AppShell will dispatch auth
      }
    } catch (e2) {
      toast(mapAuthError(e2 instanceof Error ? e2.message : String(e2)), "error");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      toast("Confirmation email resent");
    } catch (e2) {
      toast(mapAuthError(e2 instanceof Error ? e2.message : String(e2)), "error");
    }
  };

  const forgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr({ email: "Enter your email first" }); return; }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      if (error) throw error;
      toast("Reset link sent");
    } catch (e2) {
      toast(mapAuthError(e2 instanceof Error ? e2.message : String(e2)), "error");
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) throw res.error;
      // session set by lovable; onAuthStateChange will dispatch
    } catch (e2) {
      toast(mapAuthError(e2 instanceof Error ? e2.message : String(e2)), "error");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-app relative flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-grid bg-grid-fade opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--brand)]/15 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass-card rounded-2xl p-8 border border-white/10">
        <button onClick={() => dispatch({ type: "view", view: "landing" })} className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] glow-soft flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
        </button>

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

        {unconfirmed && (
          <div className="mt-3 text-xs text-amber-400">
            Please confirm your email first.
            <button onClick={resend} className="ml-2 underline">Resend confirmation →</button>
          </div>
        )}

        {mode === "in" && <button className="text-xs text-[#06B6D4] mt-3 hover:underline" onClick={forgot}>Forgot password?</button>}

        <Button variant="hero" className="w-full h-11 mt-6" onClick={submit} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "in" ? "Sign In →" : "Create Account →")}
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="flex-1 h-px bg-white/10" />OR<div className="flex-1 h-px bg-white/10" /></div>

        <button onClick={google} disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-md border border-white/10 hover:bg-white/5 transition text-sm disabled:opacity-50">
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
