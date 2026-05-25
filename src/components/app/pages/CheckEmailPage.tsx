import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function CheckEmailPage() {
  const { state, dispatch } = useStore();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = () => setCooldown(60);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] mx-auto flex items-center justify-center glow-soft mb-5">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Check your inbox</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We sent a confirmation link to <span className="text-foreground">{state.user.email || "your email"}</span>. Click it to activate your account.
        </p>
        <Button variant="hero" className="w-full" disabled={cooldown > 0} onClick={resend}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </Button>
        <button onClick={() => dispatch({ type: "view", view: "signin" })} className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-foreground">
          Wrong email? Go back
        </button>
      </div>
    </div>
  );
}
