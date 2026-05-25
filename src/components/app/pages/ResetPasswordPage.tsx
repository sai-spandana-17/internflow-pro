import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";

export function ResetPasswordPage() {
  const { dispatch } = useStore();
  const toast = useToast();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (p1.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (p1 !== p2) { setErr("Passwords do not match."); return; }
    toast("Password updated");
    dispatch({ type: "view", view: "signin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="glass-card rounded-2xl p-10 max-w-md w-full">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] mx-auto flex items-center justify-center glow-soft mb-5">
          <Lock className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Reset password</h1>
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">New password</label>
        <input type="password" value={p1} onChange={e => setP1(e.target.value)} required minLength={8}
          className="mt-1.5 mb-4 w-full rounded-lg px-3 py-2.5 text-sm bg-white/[0.03] border border-white/10 outline-none focus:border-[var(--brand)]/60" />
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Confirm password</label>
        <input type="password" value={p2} onChange={e => setP2(e.target.value)} required
          className="mt-1.5 mb-4 w-full rounded-lg px-3 py-2.5 text-sm bg-white/[0.03] border border-white/10 outline-none focus:border-[var(--brand)]/60" />
        {err && <div className="text-xs text-red-400 mb-3">{err}</div>}
        <Button type="submit" variant="hero" className="w-full">Update password</Button>
      </form>
    </div>
  );
}
