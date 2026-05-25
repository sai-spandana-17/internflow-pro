import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Edit3, StickyNote, XCircle, Inbox, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, STATUS_LABEL, STATUS_COLOR, type Status } from "@/lib/store";
import { useToast } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const tabs: { v: Status | "all"; l: string }[] = [
  { v: "all", l: "All" }, { v: "review", l: "Under Review" }, { v: "interview", l: "Interview" },
  { v: "decision", l: "Decision" }, { v: "offer", l: "Offer" }, { v: "rejected", l: "Rejected" },
];

export function ApplicationsPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"date" | "company" | "status">("date");
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [notesId, setNotesId] = useState<string | null>(null);

  const list = useMemo(() => {
    let arr = state.applications;
    if (tab !== "all") arr = arr.filter(a => a.status === tab);
    if (q) arr = arr.filter(a => (a.role + a.company).toLowerCase().includes(q.toLowerCase()));
    if (sort === "company") arr = [...arr].sort((a, b) => a.company.localeCompare(b.company));
    else if (sort === "status") arr = [...arr].sort((a, b) => a.status.localeCompare(b.status));
    else arr = [...arr].sort((a, b) => b.submittedAt - a.submittedAt);
    return arr;
  }, [state.applications, tab, q, sort]);

  const notesApp = state.applications.find(a => a.id === notesId) ?? null;

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <PageHeader title="Applications" subtitle="Every mission, all in flight.">
        <Button variant="hero" onClick={() => dispatch({ type: "view", view: "newapp" })}><Plus className="h-4 w-4" />New Application</Button>
      </PageHeader>

      <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 flex items-center glass-card rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search role or company…" className="flex-1 bg-transparent px-2 text-sm outline-none" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as "date" | "company" | "status")} className="glass-card rounded-lg px-3 py-2 text-sm bg-transparent [color-scheme:dark]">
          <option value="date" className="bg-[#111827]">Sort: Date</option>
          <option value="company" className="bg-[#111827]">Sort: Company</option>
          <option value="status" className="bg-[#111827]">Sort: Status</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-1 glass-card rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition ${tab === t.v ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === t.v && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--brand)]/30 to-[#06B6D4]/20 border border-[var(--brand)]/30" />}
            <span className="relative">{t.l}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        <AnimatePresence>
          {list.map(a => (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} whileHover={{ y: -2 }}
              className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-[var(--brand)]/40 hover:glow-soft transition cursor-pointer"
              onClick={() => { dispatch({ type: "select", id: a.id }); dispatch({ type: "view", view: "appdetail" }); }}>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--brand)]/30 to-[#06B6D4]/15 border border-white/10 flex items-center justify-center font-display font-bold text-lg">
                {a.company[0]}
              </div>
              <div className="flex-1">
                <div className="font-display text-lg font-semibold">{a.role}</div>
                <div className="text-sm text-muted-foreground">{a.company} · {new Date(a.submittedAt).toLocaleDateString()}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 w-24 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--brand)] to-[#06B6D4]" style={{ width: a.profileCompleteness + "%" }} /></div>
                  <span className="text-[10px] text-muted-foreground">{a.profileCompleteness}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full inline-flex items-center gap-1.5" style={{ background: STATUS_COLOR[a.status] + "22", color: STATUS_COLOR[a.status] }}>
                  <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ background: STATUS_COLOR[a.status] }} /><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[a.status] }} /></span>
                  {STATUS_LABEL[a.status]}
                </span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <IconBtn onClick={() => { dispatch({ type: "select", id: a.id }); dispatch({ type: "view", view: "appdetail" }); }}><Edit3 className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={() => setNotesId(a.id)}><StickyNote className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={() => setWithdrawId(a.id)}><XCircle className="h-3.5 w-3.5" /></IconBtn>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {list.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <div className="font-display text-lg font-semibold mb-1">No applications yet</div>
            <p className="text-sm text-muted-foreground mb-5">Start tracking your first internship application.</p>
            <Button variant="hero" onClick={() => dispatch({ type: "view", view: "newapp" })}><Plus className="h-4 w-4" />Add your first application</Button>
          </div>
        )}
      </div>

      <AlertDialog open={!!withdrawId} onOpenChange={(o) => !o && setWithdrawId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw application?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (withdrawId) { dispatch({ type: "withdrawApp", id: withdrawId }); toast("Application withdrawn", "info"); }
              setWithdrawId(null);
            }}>Withdraw</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NotesSheet app={notesApp} onClose={() => setNotesId(null)} />
    </div>
  );
}

function NotesSheet({ app, onClose }: { app: ReturnType<typeof useStore>["state"]["applications"][number] | null; onClose: () => void }) {
  const { dispatch } = useStore();
  const [val, setVal] = useState("");
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = app?.id;

  useEffect(() => { setVal(app?.notes ?? ""); }, [id]); // eslint-disable-line

  useEffect(() => {
    if (!id) return;
    if (val === (app?.notes ?? "")) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch({ type: "setNotes", id, notes: val });
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [val, id]); // eslint-disable-line

  return (
    <Sheet open={!!app} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-[#0A0F1C] border-white/10">
        <SheetHeader>
          <SheetTitle className="font-display">Notes — {app?.company}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
          <textarea
            value={val}
            onChange={e => setVal(e.target.value)}
            rows={14}
            placeholder="Write your notes about this application…"
            className="w-full glass-card rounded-lg border border-white/10 p-3 text-sm bg-transparent outline-none focus:border-[var(--brand)]/60 resize-none"
          />
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1 h-5">
            {saved && (<><Check className="h-3 w-3 text-[#10B981]" /><span className="text-[#10B981]">Saved</span></>)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="h-8 w-8 rounded-md border border-white/10 hover:bg-white/5 flex items-center justify-center">{children}</button>;
}
