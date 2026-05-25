import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormData, FormErrors } from "./ApplicationForm";

interface Props {
  data: FormData;
  setData: (d: FormData) => void;
  errors: FormErrors;
}

function Field({
  id, label, error, children,
}: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function StepOne({ data, setData, errors }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const inputCls = (err?: string) =>
    `bg-white/5 border-white/10 h-11 ${err ? "border-destructive shadow-[0_0_18px_rgba(239,68,68,0.35)]" : "focus-visible:border-[var(--brand)] focus-visible:ring-[var(--brand)]"}`;

  const handleFile = (file: File | null) => {
    setData({ ...data, resume: file });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field id="fullName" label="Full Name" error={errors.fullName}>
          <Input id="fullName" className={inputCls(errors.fullName)} value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} placeholder="Ada Lovelace" />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <Input id="phone" className={inputCls(errors.phone)} value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+1 (415) 555-0188" />
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" type="email" className={inputCls(errors.email)} value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="ada@example.com" />
        </Field>
        <Field id="linkedin" label="LinkedIn URL">
          <Input id="linkedin" className={inputCls()} value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} placeholder="linkedin.com/in/ada" />
        </Field>
      </div>

      <Field id="resume" label="Resume Upload" error={errors.resume}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border border-dashed p-8 text-center transition ${
            drag ? "border-[var(--brand)] bg-[var(--brand)]/10 glow-soft" : "border-white/15 bg-white/5 hover:border-[var(--brand)]/60"
          } ${errors.resume ? "border-destructive" : ""}`}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {data.resume ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-5 w-5 text-[#06B6D4]" />
              <span className="text-sm">{data.resume.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleFile(null); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-6 w-6 text-[#06B6D4]" />
              <p className="text-sm">Drop your resume here or <span className="text-[#06B6D4]">browse</span></p>
              <p className="text-xs">PDF, DOC, DOCX · max 10MB</p>
            </div>
          )}
        </div>
      </Field>
    </motion.div>
  );
}
