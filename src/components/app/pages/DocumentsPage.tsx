import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Plus, Download, Trash2, FileText, FileArchive, FileCode, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useToast, type AppDoc } from "@/lib/store";
import { PageHeader } from "./DashboardOverview";

const TYPES = ["All", "Resume", "Cover Letter", "Project"] as const;

function iconFor(ext: string) {
  if (["zip", "rar"].includes(ext)) return FileArchive;
  if (["doc", "docx"].includes(ext)) return FileCode;
  return FileText;
}
function colorFor(ext: string) {
  if (["pdf"].includes(ext)) return "#EF4444";
  if (["zip", "rar"].includes(ext)) return "#F59E0B";
  if (["doc", "docx"].includes(ext)) return "var(--brand)";
  return "#06B6D4";
}

export function DocumentsPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState<typeof TYPES[number]>("All");
  const [showUp, setShowUp] = useState(false);

  const docs = filter === "All" ? state.documents : state.documents.filter(d => d.type === filter);

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <PageHeader title="Documents" subtitle="All your files, one place.">
        <Button variant="hero" onClick={() => setShowUp(true)}><Plus className="h-4 w-4" />Upload New</Button>
      </PageHeader>

      <div className="mt-6 flex flex-wrap gap-1 glass-card rounded-lg p-1 w-fit">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`relative px-3 py-1.5 rounded-md text-xs font-medium ${filter === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {filter === t && <motion.span layoutId="doctab" className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--brand)]/30 to-[#06B6D4]/20 border border-[var(--brand)]/30" />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {docs.map(d => {
            const Icon = iconFor(d.ext);
            const app = state.applications.find(a => a.id === d.appId);
            return (
              <motion.div key={d.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-5 group relative hover:border-[var(--brand)]/40 hover:glow-soft transition">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center" style={{ background: colorFor(d.ext) + "22" }}>
                    <Icon className="h-5 w-5" style={{ color: colorFor(d.ext) }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#06B6D4]">{d.version}</span>
                </div>
                <div className="font-semibold text-sm truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{app?.company ?? "Unassigned"}</div>
                <div className="text-[10px] text-muted-foreground mt-2 flex justify-between">
                  <span>{new Date(d.uploadedAt).toLocaleDateString()}</span>
                  <span>{Math.round(d.size / 1024)} KB</span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-1">
                  <button onClick={() => toast("Download started", "info")} className="h-7 w-7 rounded-md border border-white/10 hover:bg-white/5 flex items-center justify-center"><Download className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { dispatch({ type: "removeDoc", id: d.id }); toast("Deleted", "info"); }} className="h-7 w-7 rounded-md border border-white/10 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {docs.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">No documents yet.</div>}
      </div>

      <UploadModal open={showUp} onClose={() => setShowUp(false)} onUpload={(d) => { dispatch({ type: "addDoc", doc: d }); toast("File uploaded"); setShowUp(false); }} />
    </div>
  );
}

function UploadModal({ open, onClose, onUpload }: { open: boolean; onClose: () => void; onUpload: (d: AppDoc) => void }) {
  const inp = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [type, setType] = useState<AppDoc["type"]>("Resume");
  const { state } = useStore();
  const [appId, setAppId] = useState(state.applications[0]?.id ?? "");

  const handle = (f: File) => {
    onUpload({ id: crypto.randomUUID(), name: f.name, type, size: f.size, uploadedAt: Date.now(), appId, version: "v1", ext: f.name.split(".").pop() || "pdf" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div onClick={e => e.stopPropagation()} initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
            className="glass-card rounded-2xl max-w-md w-full border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="font-display text-lg font-bold">Upload Document</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
            <div className="grid grid-cols-1 gap-3 mb-3">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Type</label>
                <select value={type} onChange={e => setType(e.target.value as AppDoc["type"])} className="w-full glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10 [color-scheme:dark]">
                  <option className="bg-[#111827]">Resume</option>
                  <option className="bg-[#111827]">Cover Letter</option>
                  <option className="bg-[#111827]">Project</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">Associate with application</label>
                <select value={appId} onChange={e => setAppId(e.target.value)} className="w-full glass-card rounded-lg px-3 py-2 text-sm bg-transparent border border-white/10 [color-scheme:dark]">
                  {state.applications.length === 0 && <option value="" className="bg-[#111827]">No applications</option>}
                  {state.applications.map(a => <option key={a.id} value={a.id} className="bg-[#111827]">{a.company} — {a.role}</option>)}
                </select>
              </div>
            </div>
            <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
              onClick={() => inp.current?.click()}
              className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer ${drag ? "border-[#06B6D4] glow-soft" : "border-white/10 hover:border-[var(--brand)]/40"}`}>
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm">Drop a file or click to choose</div>
              <input ref={inp} type="file" hidden onChange={e => e.target.files && handle(e.target.files[0])} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
