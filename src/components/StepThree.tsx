import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormData, FormErrors } from "./ApplicationForm";

interface Props {
  data: FormData;
  setData: (d: FormData) => void;
  errors: FormErrors;
}

const ROLES = ["Software Engineering", "Product Design", "Data Science", "Product Management", "Marketing"];
const AVAIL = [
  { v: "immediate", label: "Immediate" },
  { v: "1mo", label: "Within 1 Month" },
  { v: "3mo", label: "Within 3 Months" },
];

export function StepThree({ data, setData, errors }: Props) {
  const charCount = data.whyJoin.length;
  const minChars = 100;
  const validChars = charCount >= minChars;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</Label>
          <Select value={data.role} onValueChange={(v) => setData({ ...data, role: v })}>
            <SelectTrigger className={`bg-white/5 border-white/10 h-11 ${errors.role ? "border-destructive shadow-[0_0_18px_rgba(239,68,68,0.35)]" : ""}`}>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Availability</Label>
          <div className={`flex flex-wrap gap-2 ${errors.availability ? "ring-1 ring-destructive rounded-md p-1" : ""}`}>
            {AVAIL.map((a) => {
              const active = data.availability === a.v;
              return (
                <button
                  key={a.v}
                  type="button"
                  onClick={() => setData({ ...data, availability: a.v })}
                  className={`flex-1 min-w-[100px] rounded-md border px-3 h-11 text-sm transition ${
                    active
                      ? "border-[var(--brand)] bg-[var(--brand)]/15 text-foreground glow-soft"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:border-[var(--brand)]/40"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center w-full">
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.9)]" : "bg-white/30"}`} />
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.availability && <p className="text-xs text-destructive">{errors.availability}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="why" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why Join Us?</Label>
          <span className={`text-xs tabular-nums ${validChars ? "text-[#06B6D4]" : "text-muted-foreground"}`}>
            {charCount} / {minChars}+
          </span>
        </div>
        <Textarea
          id="why"
          rows={5}
          value={data.whyJoin}
          onChange={(e) => setData({ ...data, whyJoin: e.target.value })}
          className={`bg-white/5 border-white/10 resize-none ${errors.whyJoin ? "border-destructive shadow-[0_0_18px_rgba(239,68,68,0.35)]" : "focus-visible:border-[var(--brand)]"}`}
          placeholder="Tell us what pulls you toward this team…"
        />
        {errors.whyJoin && <p className="text-xs text-destructive">{errors.whyJoin}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Additional Notes <span className="text-muted-foreground/60 normal-case tracking-normal">(optional)</span></Label>
        <Textarea
          id="notes"
          rows={3}
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="bg-white/5 border-white/10 resize-none focus-visible:border-[var(--brand)]"
          placeholder="Anything else we should know?"
        />
      </div>
    </motion.div>
  );
}
