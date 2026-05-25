import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";

export function TermsPage() {
  const { dispatch } = useStore();
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => dispatch({ type: "view", view: "landing" })} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
        <h1 className="font-display text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: May 2026</p>
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Acceptance of terms</h2><p>By using InternFlow you agree to these terms.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Use</h2><p>Personal, non-commercial use only.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">No guarantees</h2><p>We do not guarantee any internship outcomes.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Your data</h2><p>You own your data.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Abuse</h2><p>We may suspend accounts that abuse the platform.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Contact</h2><p>legal@internflow.app</p></section>
        </div>
      </div>
    </div>
  );
}
