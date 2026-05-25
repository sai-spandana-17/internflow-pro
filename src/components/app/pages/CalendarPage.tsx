import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysIn(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_COLORS = { deadline: "var(--brand)", interview: "#F59E0B", followup: "#10B981" };

export function CalendarPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [open, setOpen] = useState<string | null>(null);
  const [newType, setNewType] = useState<"deadline" | "interview" | "followup">("deadline");
  const [newTitle, setNewTitle] = useState("");
  const [newAppId, setNewAppId] = useState<string>("");

  const todayStr = new Date().toISOString().slice(0, 10);
  const first = startOfMonth(month);
  const offset = first.getDay();
  const totalDays = daysIn(month);
  const cells: (string | null)[] = [...Array(offset).fill(null), ...Array(totalDays).fill(0).map((_, i) => {
    const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
    return d.toISOString().slice(0, 10);
  })];

  const eventsOn = (date: string) => state.events.filter(e => e.date === date);

  const save = (date: string) => {
    if (!newTitle.trim()) return;
    dispatch({ type: "addEvent", event: { id: crypto.randomUUID(), date, type: newType, title: newTitle.trim(), appId: newAppId || undefined } });
    toast("Event added");
    setNewTitle(""); setNewAppId(""); setNewType("deadline"); setOpen(null);
  };

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <PageHeader title="Calendar" subtitle="Every deadline, every interview.">
        <div className="flex items-center gap-2">
          <Button variant="glass" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-display font-semibold text-lg w-40 text-center">{month.toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
          <Button variant="glass" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </PageHeader>

      <div className="mt-6 glass-card rounded-2xl p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DOW.map(d => <div key={d} className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => {
            if (!c) return <div key={i} />;
            const evs = eventsOn(c);
            const isToday = c === todayStr;
            return (
              <Popover key={i} open={open === c} onOpenChange={(o) => setOpen(o ? c : null)}>
                <PopoverTrigger asChild>
                  <button
                    className={`relative min-h-[80px] md:min-h-[96px] w-full rounded-lg border border-white/5 p-2 text-left hover:bg-white/[0.03] transition ${isToday ? "border-[var(--brand)] glow-soft" : ""}`}>
                    <div className={`text-xs font-semibold ${isToday ? "text-[#06B6D4]" : ""}`}>{Number(c.slice(-2))}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {evs.slice(0, 3).map(e => (
                        <span key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: EVENT_COLORS[e.type], boxShadow: `0 0 6px ${EVENT_COLORS[e.type]}` }} />
                      ))}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0A0F1C] border-white/10 p-4 space-y-3" align="start">
                  <div className="text-sm font-semibold">{new Date(c).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
                  {evs.length > 0 && (
                    <ul className="space-y-1.5">
                      {evs.map(e => (
                        <li key={e.id} className="rounded-md border border-white/5 px-2.5 py-2 flex items-center gap-2 text-xs">
                          <span className="h-2 w-2 rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
                          <span className="flex-1">{e.title}</span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{e.type}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Event title"
                      className="w-full rounded-md px-3 py-2 text-sm bg-white/[0.03] outline-none border border-white/10 focus:border-[var(--brand)]/60" />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={newType} onChange={e => setNewType(e.target.value as "deadline" | "interview" | "followup")}
                        className="rounded-md px-2 py-2 text-sm bg-white/[0.03] border border-white/10 [color-scheme:dark]">
                        <option value="deadline" className="bg-[#111827]">Deadline</option>
                        <option value="interview" className="bg-[#111827]">Interview</option>
                        <option value="followup" className="bg-[#111827]">Follow-up</option>
                      </select>
                      <select value={newAppId} onChange={e => setNewAppId(e.target.value)}
                        className="rounded-md px-2 py-2 text-sm bg-white/[0.03] border border-white/10 [color-scheme:dark]">
                        <option value="" className="bg-[#111827]">No app</option>
                        {state.applications.map(a => <option key={a.id} value={a.id} className="bg-[#111827]">{a.company}</option>)}
                      </select>
                    </div>
                    <Button variant="hero" className="w-full h-9" onClick={() => save(c)}><Plus className="h-3.5 w-3.5" />Save Event</Button>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}
