import { motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { Upload, FileText, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData, FormErrors } from "./ApplicationForm";

interface Props {
  data: FormData;
  setData: (d: FormData) => void;
  errors: FormErrors;
}

export function StepTwo({ data, setData, errors }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState("");

  const inputCls = (err?: string) =>
    `bg-white/5 border-white/10 h-11 ${err ? "border-destructive shadow-[0_0_18px_rgba(239,68,68,0.35)]" : "focus-visible:border-[var(--brand)]"}`;

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || data.skills.includes(v)) return;
    setData({ ...data, skills: [...data.skills, v] });
    setSkillInput("");
  };
  const removeSkill = (s: string) => setData({ ...data, skills: data.skills.filter((x) => x !== s) });
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Project File</Label>
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 hover:border-[var(--brand)]/60 p-6 transition"
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setData({ ...data, projectFile: e.target.files?.[0] ?? null })}
          />
          {data.projectFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-5 w-5 text-[#06B6D4]" />
              <span className="text-sm">{data.projectFile.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setData({ ...data, projectFile: null }); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-5 w-5 text-[#06B6D4]" />
              <p className="text-sm">Attach a case study, deck, or zip</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="github" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">GitHub URL</Label>
          <Input id="github" className={inputCls()} value={data.github} onChange={(e) => setData({ ...data, github: e.target.value })} placeholder="github.com/ada" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Portfolio URL</Label>
          <Input id="portfolio" className={inputCls()} value={data.portfolio} onChange={(e) => setData({ ...data, portfolio: e.target.value })} placeholder="ada.dev" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Skills</Label>
        <div className={`flex flex-wrap items-center gap-2 rounded-md bg-white/5 border border-white/10 p-2 min-h-11 ${errors.skills ? "border-destructive shadow-[0_0_18px_rgba(239,68,68,0.35)]" : "focus-within:border-[var(--brand)]"}`}>
          {data.skills.map((s) => (
            <motion.span
              key={s}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--brand)]/25 to-[#06B6D4]/20 border border-[var(--brand)]/40 px-3 py-1 text-xs"
            >
              <Tag className="h-3 w-3 text-[#06B6D4]" />
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={data.skills.length ? "" : "Type a skill, press Enter"}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm px-2 py-1"
          />
        </div>
        {errors.skills && <p className="text-xs text-destructive">{errors.skills}</p>}
      </div>
    </motion.div>
  );
}
