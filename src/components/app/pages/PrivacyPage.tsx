import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";

export function PrivacyPage() {
  const { dispatch } = useStore();
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => dispatch({ type: "view", view: "landing" })} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
        <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: May 2026</p>
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">What we collect</h2><p>Email, name, and application data you enter.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">How we use it</h2><p>To provide the service only. We never sell your data.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Storage</h2><p>Hosted on Supabase secured servers.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Your rights</h2><p>Delete your account and all data anytime from Settings.</p></section>
          <section><h2 className="font-display text-lg font-bold text-foreground mb-2">Contact</h2><p>privacy@internflow.app</p></section>
        </div>
      </div>
    </div>
  );
}
