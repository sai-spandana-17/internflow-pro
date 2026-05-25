import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

export interface FormData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  resume: File | null;
  projectFile: File | null;
  github: string;
  portfolio: string;
  skills: string[];
  role: string;
  availability: string;
  whyJoin: string;
  notes: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

const empty: FormData = {
  fullName: "", phone: "", email: "", linkedin: "",
  resume: null, projectFile: null, github: "", portfolio: "",
  skills: [], role: "", availability: "", whyJoin: "", notes: "",
};

const STEP_LABELS = ["Identity", "Craft", "Intent"];
const PROGRESS = [30, 60, 100];

interface Props {
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

export function ApplicationForm({ onBack, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (s: number): FormErrors => {
    const e: FormErrors = {};
    if (s === 0) {
      if (!data.fullName.trim()) e.fullName = "Required";
      if (!data.phone.trim()) e.phone = "Required";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Valid email required";
      if (!data.resume) e.resume = "Resume is required";
    }
    if (s === 1) {
      if (data.skills.length === 0) e.skills = "Add at least one skill";
    }
    if (s === 2) {
      if (!data.role) e.role = "Pick a role";
      if (!data.availability) e.availability = "Choose availability";
      if (data.whyJoin.trim().length < 100) e.whyJoin = "Tell us a bit more (100+ chars)";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) setStep(step + 1);
    else onSubmit(data);
  };

  const back = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-app text-foreground px-4 md:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#06B6D4] flex items-center justify-center">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold">InternFlow<span className="text-[#06B6D4]">.</span></span>
          </div>
        </header>

        <div className="mb-10">
          <ProgressBar value={PROGRESS[step]} steps={STEP_LABELS} currentStep={step} />
        </div>

        <Card className="glass-card border-white/10 rounded-2xl p-6 md:p-10">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.3em] text-[#06B6D4] mb-2">Step {step + 1} of 3</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {step === 0 && "Tell us who you are."}
              {step === 1 && "Show us what you build."}
              {step === 2 && "Why this mission?"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && <StepOne key="s1" data={data} setData={setData} errors={errors} />}
            {step === 1 && <StepTwo key="s2" data={data} setData={setData} errors={errors} />}
            {step === 2 && <StepThree key="s3" data={data} setData={setData} errors={errors} />}
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-3">
            <Button variant="glass" onClick={back}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button variant="hero" onClick={next} className="h-11 px-6">
                {step < 2 ? <>Continue <ArrowRight className="h-4 w-4" /></> : <>Submit Application <Check className="h-4 w-4" /></>}
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  );
}
