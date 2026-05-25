import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";

export type Status = "review" | "interview" | "decision" | "offer" | "rejected";
export const STATUS_LABEL: Record<Status, string> = {
  review: "Under Review", interview: "Interview Scheduled",
  decision: "Decision Pending", offer: "Offer Received", rejected: "Rejected",
};
export const STATUS_COLOR: Record<Status, string> = {
  review: "#F59E0B", interview: "#06B6D4", decision: "#A78BFA",
  offer: "#10B981", rejected: "#EF4444",
};
export const NEXT_STATUS: Record<Status, Status> = {
  review: "interview", interview: "decision", decision: "offer",
  offer: "offer", rejected: "rejected",
};

export interface Referral { name: string; email: string; relationship: string; followUp: string; status: "none" | "reached" | "replied"; }
export interface AppDoc { id: string; name: string; type: "Resume" | "Cover Letter" | "Project"; size: number; uploadedAt: number; appId: string; version: string; ext: string; }
export interface InterviewRound { id: string; type: "HR" | "Technical" | "System Design" | "Culture Fit"; date: string; status: "Scheduled" | "Completed" | "Cancelled"; notes: string; interviewer: string; outcome: string; }
export interface CalEvent { id: string; date: string; type: "deadline" | "interview" | "followup"; title: string; appId?: string; }
export interface Application {
  id: string; role: string; company: string; companyIndustry: string; companyLocation: string;
  status: Status; submittedAt: number; deadline: string; availability: string;
  whyJoin: string; notes: string; skills: string[]; github: string; portfolio: string;
  linkedin: string; fullName: string; email: string; phone: string;
  resumeName?: string; projectName?: string; profileCompleteness: number;
  referral?: Referral; coverLetter?: string;
  rounds: InterviewRound[];
  timelineNotes: Record<string, string>;
  statusHistory: { status: Status; changedAt: number }[];
}


export interface Toast { id: string; message: string; kind: "success" | "error" | "info"; }
export interface User { name: string; email: string; avatar?: string; }

export interface State {
  authed: boolean;
  user: User;
  view: View;
  selectedAppId: string | null;
  applications: Application[];
  events: CalEvent[];
  documents: AppDoc[];
  toasts: Toast[];
  onboardingDismissed: boolean;
  streak: number;
  lastActivityDate: string;
  settings: {
    accent: "blue" | "cyan" | "purple" | "green";
    accentColor: string;
    notifEmail: boolean; notifStatus: boolean; notifDigest: boolean;
    weeklyGoal: number; wishlist: string[];
  };
  dismissedReminders: string[];
  emailModalAppId: string | null;
  showConfetti: boolean;
}
export type View = "signin" | "landing" | "dashboard" | "apps" | "newapp" | "analytics" | "calendar" | "documents" | "interview" | "settings" | "appdetail" | "goals" | "profile" | "privacy" | "terms" | "checkemail" | "resetpassword";


type Action =
  | { type: "auth"; user: User }
  | { type: "signout" }
  | { type: "view"; view: View }
  | { type: "select"; id: string | null }
  | { type: "addApp"; app: Application }
  | { type: "updateApp"; id: string; patch: Partial<Application> }
  | { type: "advanceStatus"; id: string }
  | { type: "withdrawApp"; id: string }
  | { type: "addEvent"; event: CalEvent }
  | { type: "addDoc"; doc: AppDoc }
  | { type: "removeDoc"; id: string }
  | { type: "addRound"; appId: string; round: InterviewRound }
  | { type: "updateRound"; appId: string; roundId: string; patch: Partial<InterviewRound> }
  | { type: "toast"; toast: Toast }
  | { type: "dismissToast"; id: string }
  | { type: "dismissOnboarding" }
  | { type: "settings"; patch: Partial<State["settings"]> }
  | { type: "addWishlist"; company: string }
  | { type: "removeWishlist"; company: string }
  | { type: "openEmailModal"; appId: string | null }
  | { type: "confetti"; on: boolean }
  | { type: "setReferral"; appId: string; referral: Referral }
  | { type: "setCoverLetter"; id: string; coverLetter: string }
  | { type: "setNotes"; id: string; notes: string }
  | { type: "setWeeklyGoal"; goal: number }
  | { type: "setAccentColor"; color: string };


const today = () => new Date().toISOString().slice(0, 10);

const seedApps: Application[] = [
  {
    id: "a1", role: "Frontend Engineering", company: "Vercel", companyIndustry: "Developer Tools", companyLocation: "San Francisco, CA",
    status: "interview", submittedAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    deadline: today(), availability: "1 Month", whyJoin: "Vercel ships the edge runtime I already build on every day. I want to push that platform forward.",
    notes: "Referred by friend Jamie", skills: ["React", "TypeScript", "Edge", "Tailwind"],
    github: "github.com/demo", portfolio: "demo.dev", linkedin: "linkedin.com/in/demo",
    fullName: "Alex Rivera", email: "alex@example.com", phone: "+1 415 555 0100",
    resumeName: "AlexRivera_Resume.pdf", profileCompleteness: 88, rounds: [],
  },
  {
    id: "a2", role: "ML Research", company: "Anthropic", companyIndustry: "AI Research", companyLocation: "San Francisco, CA",
    status: "review", submittedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    deadline: today(), availability: "Immediate", whyJoin: "Long-form research on alignment is the work that matters this decade. I'd like to contribute to interpretability tooling.",
    notes: "", skills: ["PyTorch", "Python", "Stats"], github: "github.com/demo", portfolio: "", linkedin: "",
    fullName: "Alex Rivera", email: "alex@example.com", phone: "+1 415 555 0100",
    resumeName: "AlexRivera_Resume.pdf", profileCompleteness: 72, rounds: [],
  },
  {
    id: "a3", role: "Product Design", company: "Linear", companyIndustry: "Developer Tools", companyLocation: "Remote",
    status: "offer", submittedAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    deadline: today(), availability: "3 Months", whyJoin: "Linear sets the bar for crafted product. I'd love to contribute to the timeline and cycle UX work.",
    notes: "", skills: ["Figma", "Prototyping"], github: "", portfolio: "demo.dev", linkedin: "",
    fullName: "Alex Rivera", email: "alex@example.com", phone: "+1 415 555 0100",
    resumeName: "AlexRivera_Resume.pdf", profileCompleteness: 96, rounds: [],
  },
];

const seedDocs: AppDoc[] = [
  { id: "d1", name: "AlexRivera_Resume_v3.pdf", type: "Resume", size: 240_400, uploadedAt: Date.now() - 86400000, appId: "a1", version: "v3", ext: "pdf" },
  { id: "d2", name: "Vercel_CoverLetter.pdf", type: "Cover Letter", size: 120_300, uploadedAt: Date.now() - 86400000 * 2, appId: "a1", version: "v1", ext: "pdf" },
  { id: "d3", name: "Edge_Demo.zip", type: "Project", size: 2_400_000, uploadedAt: Date.now() - 86400000 * 4, appId: "a1", version: "v2", ext: "zip" },
];

const initial: State = {
  authed: false,
  user: { name: "Alex Rivera", email: "alex@example.com" },
  view: "landing",
  selectedAppId: null,
  applications: seedApps,
  events: [
    { id: "e1", date: today(), type: "deadline", title: "Vercel application due", appId: "a1" },
    { id: "e2", date: today(), type: "interview", title: "Anthropic phone screen" },
  ],
  documents: seedDocs,
  toasts: [],
  onboardingDismissed: false,
  streak: 5,
  lastActivityDate: "",
  settings: { accent: "blue", accentColor: "#3B82F6", notifEmail: true, notifStatus: true, notifDigest: false, weeklyGoal: 5, wishlist: ["Anthropic", "Vercel", "Linear"] },
  emailModalAppId: null,
  showConfetti: false,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "auth": return { ...s, authed: true, user: a.user, view: "dashboard" };
    case "signout": return { ...initial, authed: false, view: "landing" };
    case "view": return { ...s, view: a.view };
    case "select": return { ...s, selectedAppId: a.id };
    case "addApp": {
      const day = today();
      const sameDay = s.lastActivityDate === day;
      return {
        ...s,
        applications: [a.app, ...s.applications],
        streak: sameDay ? s.streak : s.streak + 1,
        lastActivityDate: day,
        showConfetti: true,
        emailModalAppId: a.app.id,
      };
    }
    case "updateApp": return { ...s, applications: s.applications.map(x => x.id === a.id ? { ...x, ...a.patch } : x) };
    case "advanceStatus": return { ...s, applications: s.applications.map(x => x.id === a.id ? { ...x, status: NEXT_STATUS[x.status] } : x) };
    case "withdrawApp": return { ...s, applications: s.applications.filter(x => x.id !== a.id) };
    case "addEvent": return { ...s, events: [...s.events, a.event] };
    case "addDoc": return { ...s, documents: [a.doc, ...s.documents] };
    case "removeDoc": return { ...s, documents: s.documents.filter(d => d.id !== a.id) };
    case "addRound": return { ...s, applications: s.applications.map(x => x.id === a.appId ? { ...x, rounds: [...x.rounds, a.round] } : x) };
    case "updateRound": return { ...s, applications: s.applications.map(x => x.id === a.appId ? { ...x, rounds: x.rounds.map(r => r.id === a.roundId ? { ...r, ...a.patch } : r) } : x) };
    case "toast": {
      const next = [...s.toasts, a.toast];
      return { ...s, toasts: next.length > 3 ? next.slice(next.length - 3) : next };
    }
    case "dismissToast": return { ...s, toasts: s.toasts.filter(t => t.id !== a.id) };
    case "dismissOnboarding": return { ...s, onboardingDismissed: true };
    case "settings": return { ...s, settings: { ...s.settings, ...a.patch } };
    case "addWishlist": return s.settings.wishlist.includes(a.company) ? s : { ...s, settings: { ...s.settings, wishlist: [...s.settings.wishlist, a.company] } };
    case "removeWishlist": return { ...s, settings: { ...s.settings, wishlist: s.settings.wishlist.filter(w => w !== a.company) } };
    case "openEmailModal": return { ...s, emailModalAppId: a.appId };
    case "confetti": return { ...s, showConfetti: a.on };
    case "setReferral": return { ...s, applications: s.applications.map(x => x.id === a.appId ? { ...x, referral: a.referral } : x) };
    case "setCoverLetter": return { ...s, applications: s.applications.map(x => x.id === a.id ? { ...x, coverLetter: a.coverLetter } : x) };
    case "setNotes": return { ...s, applications: s.applications.map(x => x.id === a.id ? { ...x, notes: a.notes } : x) };
    case "setWeeklyGoal": return { ...s, settings: { ...s.settings, weeklyGoal: Math.max(1, a.goal) } };
    case "setAccentColor": return { ...s, settings: { ...s.settings, accentColor: a.color } };

    default: return s;
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
export function useToast() {
  const { dispatch } = useStore();
  return (message: string, kind: Toast["kind"] = "success") => {
    const id = crypto.randomUUID();
    dispatch({ type: "toast", toast: { id, message, kind } });
    setTimeout(() => dispatch({ type: "dismissToast", id }), 3000);
  };
}
