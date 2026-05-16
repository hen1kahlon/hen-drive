import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search, Trash2, Check, Download, Phone, XCircle, MessageCircle, Trophy,
  Clock, StickyNote, X, Plus, CalendarClock, GraduationCap, Bell, BellOff, Ban,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

type LeadStatus =
  | "new"
  | "contacted"
  | "lesson_scheduled"
  | "won"
  | "closed"
  | "not_relevant"
  | "archived";

type Lead = {
  id: string; full_name: string; phone: string; license_type: string | null;
  source: string | null; status: LeadStatus;
  notes: string | null; interest: string | null; area: string | null;
  follow_up_at: string | null; created_at: string;
};

type LeadNote = { id: string; lead_id: string; content: string; created_at: string };

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  lesson_scheduled: "קבע שיעור",
  won: "נסגר בהצלחה",
  closed: "נסגר",
  not_relevant: "לא רלוונטי",
  archived: "ארכיון",
};

const STATUS_STYLES: Record<LeadStatus, { dot: string; chip: string; bar: string }> = {
  new:              { dot: "bg-yellow-400",  chip: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",   bar: "bg-yellow-400" },
  contacted:        { dot: "bg-blue-400",    chip: "bg-blue-500/20 text-blue-300 border-blue-500/30",         bar: "bg-blue-400" },
  lesson_scheduled: { dot: "bg-violet-400",  chip: "bg-violet-500/20 text-violet-300 border-violet-500/30",   bar: "bg-violet-400" },
  won:              { dot: "bg-emerald-400", chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",bar: "bg-emerald-400" },
  closed:           { dot: "bg-zinc-400",    chip: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",         bar: "bg-zinc-400" },
  not_relevant:     { dot: "bg-red-400",     chip: "bg-red-500/20 text-red-300 border-red-500/30",            bar: "bg-red-400" },
  archived:         { dot: "bg-zinc-600",    chip: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",         bar: "bg-zinc-600" },
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "לפני רגע";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} ד׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} ש׳`;
  if (diff < 86400 * 7) return `לפני ${Math.floor(diff / 86400)} ימים`;
  return new Date(iso).toLocaleDateString("he-IL");
}

function followUpBadge(iso: string | null): { label: string; cls: string } | null {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  const now = Date.now();
  const dayMs = 86400_000;
  const dayStart = new Date(); dayStart.setHours(0,0,0,0);
  const todayMs = dayStart.getTime();
  const fmt = new Date(iso).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
  if (d < now) return { label: `מעקב באיחור · ${fmt}`, cls: "bg-red-500/20 text-red-300 border-red-500/30" };
  if (d < todayMs + dayMs) return { label: `מעקב היום · ${fmt}`, cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
  return { label: `מעקב · ${fmt}`, cls: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

// Soft "ding" using WebAudio — no asset needed
function playDing() {
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination); o.start();
    o.stop(ctx.currentTime + 0.42);
    setTimeout(() => ctx.close(), 700);
  } catch { /* ignore */ }
}

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [licenseFilter, setLicenseFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("leads_notif") !== "off";
  });
  const seenIds = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      const list = (data ?? []) as Lead[];
      setLeads(list);
      seenIds.current = new Set(list.map((l) => l.id));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: instant in-app notifications on new leads
  useEffect(() => {
    const channel = supabase
      .channel("leads-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const l = payload.new as Lead;
          if (seenIds.current.has(l.id)) return;
          seenIds.current.add(l.id);
          setLeads((prev) => [l, ...prev]);
          if (notifEnabled) {
            playDing();
            toast.success(`ליד חדש: ${l.full_name}`, { description: l.phone, duration: 8000 });
            try {
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification("ליד חדש 🚗", { body: `${l.full_name} · ${l.phone}`, tag: l.id });
              }
            } catch { /* ignore */ }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          const l = payload.new as Lead;
          setLeads((prev) => prev.map((p) => (p.id === l.id ? { ...p, ...l } : p)));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "leads" },
        (payload) => {
          const id = (payload.old as { id: string }).id;
          setLeads((prev) => prev.filter((p) => p.id !== id));
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [notifEnabled]);

  const toggleNotif = async () => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    window.localStorage.setItem("leads_notif", next ? "on" : "off");
    if (next && "Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch { /* ignore */ }
    }
  };

  const cities = useMemo(() => Array.from(new Set(leads.map((l) => l.area).filter(Boolean))) as string[], [leads]);
  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source).filter(Boolean))) as string[], [leads]);

  const filtered = useMemo(() => leads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (licenseFilter !== "all" && l.license_type !== licenseFilter) return false;
    if (cityFilter !== "all" && l.area !== cityFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (q && !(`${l.full_name} ${l.phone} ${l.source ?? ""} ${l.area ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [leads, q, statusFilter, licenseFilter, cityFilter, sourceFilter]);

  const setStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((p) => p.map((l) => l.id === id ? { ...l, status } : l));
    toast.success("הסטטוס עודכן");
  };

  const setFollowUp = async (id: string, iso: string | null) => {
    const { error } = await supabase.from("leads").update({ follow_up_at: iso }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((p) => p.map((l) => l.id === id ? { ...l, follow_up_at: iso } : l));
    toast.success(iso ? "תאריך מעקב נשמר" : "מעקב הוסר");
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("leads").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    setLeads((p) => p.filter((l) => l.id !== deleteId));
    toast.success("נמחק");
    setDeleteId(null);
  };

  const exportCsv = () => {
    const rows = [["שם", "טלפון", "רישיון", "מסלול", "אזור", "הערות", "מקור", "סטטוס", "מעקב", "תאריך"]].concat(
      filtered.map((l) => [
        l.full_name, l.phone, l.license_type ?? "", l.interest ?? "", l.area ?? "",
        l.notes ?? "", l.source ?? "", STATUS_LABEL[l.status],
        l.follow_up_at ? new Date(l.follow_up_at).toLocaleString("he-IL") : "",
        new Date(l.created_at).toLocaleString("he-IL"),
      ])
    );
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    lesson_scheduled: leads.filter((l) => l.status === "lesson_scheduled").length,
    won: leads.filter((l) => l.status === "won").length,
    closed: leads.filter((l) => l.status === "closed").length,
    not_relevant: leads.filter((l) => l.status === "not_relevant").length,
    archived: leads.filter((l) => l.status === "archived").length,
  };

  // Monthly stats: current month
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const monthLeads = leads.filter((l) => new Date(l.created_at) >= monthStart);
  const monthWon = monthLeads.filter((l) => l.status === "won").length;
  const monthClosed = monthLeads.filter((l) => l.status === "closed" || l.status === "won").length;
  const conversion = monthLeads.length ? Math.round((monthWon / monthLeads.length) * 100) : 0;
  const overdueCount = leads.filter((l) => l.follow_up_at && new Date(l.follow_up_at).getTime() < Date.now() && l.status !== "won" && l.status !== "closed" && l.status !== "not_relevant").length;

  return (
    <div className="space-y-5">
      {/* Header + counter */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">לידים</h1>
          <p className="text-sm text-muted-foreground">
            סה״כ <span className="font-bold text-foreground">{counts.all}</span> לידים
            {filtered.length !== counts.all && <> · מוצגים <span className="font-bold text-foreground">{filtered.length}</span></>}
            {overdueCount > 0 && <> · <span className="text-red-400 font-bold">{overdueCount} במעקב באיחור</span></>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleNotif}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${notifEnabled ? "bg-blue-500/20 text-blue-300" : "bg-white/5 text-muted-foreground"}`}
            title={notifEnabled ? "התראות פעילות" : "התראות מושבתות"}>
            {notifEnabled ? <Bell size={14} /> : <BellOff size={14} />}
            {notifEnabled ? "התראות פעילות" : "התראות כבויות"}
          </button>
          <button onClick={exportCsv} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Download size={14} /> ייצא CSV
          </button>
        </div>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatTile label="לידים החודש" value={monthLeads.length} tone="blue" />
        <StatTile label="נסגרו בהצלחה" value={monthWon} tone="emerald" />
        <StatTile label="סגורים סה״כ" value={monthClosed} tone="zinc" />
        <StatTile label="אחוז המרה" value={`${conversion}%`} tone="violet" />
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {(["all", "new", "contacted", "lesson_scheduled", "won", "closed", "not_relevant"] as const).map((s) => {
          const active = statusFilter === s;
          const dot = s === "all" ? "bg-blue-400" : STATUS_STYLES[s as LeadStatus].dot;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-right rounded-2xl p-3 border transition ${active ? "bg-white/10 border-white/20" : "bg-card border-white/10 hover:bg-white/5"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-[11px] text-muted-foreground">
                  {s === "all" ? "סך הכל" : STATUS_LABEL[s as LeadStatus]}
                </span>
              </div>
              <div className="text-xl font-black">{counts[s]}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש שם / טלפון"
            className="w-full bg-card border border-white/10 rounded-xl pr-9 pl-3 py-2.5 text-sm" />
        </div>
        <select value={licenseFilter} onChange={(e) => setLicenseFilter(e.target.value)}
          className="bg-card border border-white/10 rounded-xl px-3 py-2.5 text-sm">
          <option value="all">כל הרישיונות</option>
          <option value="B">B</option><option value="A">A</option><option value="A1">A1</option><option value="A2">A2</option>
        </select>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
          className="bg-card border border-white/10 rounded-xl px-3 py-2.5 text-sm">
          <option value="all">כל הערים</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-card border border-white/10 rounded-xl px-3 py-2.5 text-sm">
          <option value="all">כל המקורות</option>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p className="text-sm text-muted-foreground py-8 text-center">טוען...</p> :
        filtered.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">אין לידים להצגה</p> :
        <>
          {/* Mobile / tablet cards */}
          <div className="grid gap-3 lg:hidden">
            {filtered.map((l) => (
              <LeadCard key={l.id} lead={l} onStatus={setStatus} onDelete={() => setDeleteId(l.id)} onNotes={() => setNotesLead(l)} onFollowUp={setFollowUp} />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-card border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-right px-4 py-3 font-semibold">סטטוס</th>
                  <th className="text-right px-4 py-3 font-semibold">שם</th>
                  <th className="text-right px-4 py-3 font-semibold">טלפון</th>
                  <th className="text-right px-4 py-3 font-semibold">רישיון</th>
                  <th className="text-right px-4 py-3 font-semibold">עיר</th>
                  <th className="text-right px-4 py-3 font-semibold">מקור</th>
                  <th className="text-right px-4 py-3 font-semibold">מעקב</th>
                  <th className="text-right px-4 py-3 font-semibold">נוצר</th>
                  <th className="text-right px-4 py-3 font-semibold">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const st = STATUS_STYLES[l.status];
                  const fu = followUpBadge(l.follow_up_at);
                  return (
                    <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03] transition">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border ${st.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {STATUS_LABEL[l.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{l.full_name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${l.phone}`} dir="ltr" className="text-foreground/90 hover:text-blue-400 hover:underline">{l.phone}</a>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">{l.license_type ?? "—"}</td>
                      <td className="px-4 py-3 text-foreground/80">{l.area ?? "—"}</td>
                      <td className="px-4 py-3 text-foreground/80">{l.source ?? "—"}</td>
                      <td className="px-4 py-3">
                        {fu ? <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${fu.cls}`}><CalendarClock size={10} /> {fu.label}</span> : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" title={new Date(l.created_at).toLocaleString("he-IL")}>
                        <span className="inline-flex items-center gap-1"><Clock size={11} /> {timeAgo(l.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <LeadActions lead={l} onStatus={setStatus} onDelete={() => setDeleteId(l.id)} onNotes={() => setNotesLead(l)} compact />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      }

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>למחוק את הליד?</AlertDialogTitle>
            <AlertDialogDescription>הפעולה לא ניתנת לשחזור. כל פרטי הליד והערות ההיסטוריה יימחקו.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-500 hover:bg-red-600">מחק</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notes drawer */}
      {notesLead && <NotesPanel lead={notesLead} onClose={() => setNotesLead(null)} onFollowUp={setFollowUp} />}
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: number | string; tone: "blue" | "emerald" | "zinc" | "violet" }) {
  const tones = {
    blue: "from-blue-500/15 to-blue-500/0 border-blue-500/20",
    emerald: "from-emerald-500/15 to-emerald-500/0 border-emerald-500/20",
    zinc: "from-zinc-500/15 to-zinc-500/0 border-zinc-500/20",
    violet: "from-violet-500/15 to-violet-500/0 border-violet-500/20",
  };
  return (
    <div className={`rounded-2xl p-4 border bg-gradient-to-br ${tones[tone]}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}

function LeadCard({ lead: l, onStatus, onDelete, onNotes, onFollowUp }: {
  lead: Lead;
  onStatus: (id: string, s: LeadStatus) => void;
  onDelete: () => void;
  onNotes: () => void;
  onFollowUp: (id: string, iso: string | null) => void;
}) {
  const st = STATUS_STYLES[l.status];
  const fu = followUpBadge(l.follow_up_at);
  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
      <div className={`h-1 ${st.bar}`} />
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold">{l.full_name}</span>
              {l.license_type && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{l.license_type}</span>}
              <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border ${st.chip}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {STATUS_LABEL[l.status]}
              </span>
              {fu && <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${fu.cls}`}><CalendarClock size={10} /> {fu.label}</span>}
            </div>
            <a href={`tel:${l.phone}`} dir="ltr" className="text-sm text-foreground/90 inline-flex items-center gap-1.5 hover:text-blue-400 hover:underline">
              <Phone size={12} /> {l.phone}
            </a>
          </div>
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1" title={new Date(l.created_at).toLocaleString("he-IL")}>
            <Clock size={11} /> {timeAgo(l.created_at)}
          </span>
        </div>

        {(l.interest || l.area || l.source) && (
          <div className="text-[11px] text-foreground/70 flex flex-wrap gap-x-2 gap-y-1">
            {l.interest && <span>מסלול: <b className="text-foreground/90">{l.interest}</b></span>}
            {l.area && <span>אזור: <b className="text-foreground/90">{l.area}</b></span>}
            {l.source && <span>מקור: <b className="text-foreground/90">{l.source}</b></span>}
          </div>
        )}

        {l.notes && <div className="text-[11px] text-muted-foreground whitespace-pre-line bg-white/[0.02] rounded-lg p-2">{l.notes}</div>}

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <LeadActions lead={l} onStatus={onStatus} onDelete={onDelete} onNotes={onNotes} />
          <label className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock size={12} />
            <input
              type="datetime-local"
              value={toDatetimeLocal(l.follow_up_at)}
              onChange={(e) => onFollowUp(l.id, e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function LeadActions({ lead: l, onStatus, onDelete, onNotes, compact }: {
  lead: Lead;
  onStatus: (id: string, s: LeadStatus) => void;
  onDelete: () => void;
  onNotes: () => void;
  compact?: boolean;
}) {
  const phoneDigits = l.phone.replace(/\D/g, "");
  const btn = "p-2 rounded-lg transition";
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : ""}`}>
      <a href={`tel:${l.phone}`} className={`${btn} bg-blue-500/20 text-blue-300 hover:bg-blue-500/30`} title="התקשר"><Phone size={14} /></a>
      <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30`} title="וואטסאפ"><MessageCircle size={14} /></a>
      {l.status !== "contacted" && <button onClick={() => onStatus(l.id, "contacted")} className={`${btn} bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30`} title="נוצר קשר"><Check size={14} /></button>}
      {l.status !== "lesson_scheduled" && <button onClick={() => onStatus(l.id, "lesson_scheduled")} className={`${btn} bg-violet-500/20 text-violet-300 hover:bg-violet-500/30`} title="קבע שיעור"><GraduationCap size={14} /></button>}
      {l.status !== "won" && <button onClick={() => onStatus(l.id, "won")} className={`${btn} bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30`} title="נסגר בהצלחה"><Trophy size={14} /></button>}
      {l.status !== "closed" && <button onClick={() => onStatus(l.id, "closed")} className={`${btn} bg-white/5 hover:bg-white/10`} title="סגור"><XCircle size={14} /></button>}
      {l.status !== "not_relevant" && <button onClick={() => onStatus(l.id, "not_relevant")} className={`${btn} bg-red-500/10 text-red-300 hover:bg-red-500/20`} title="לא רלוונטי"><Ban size={14} /></button>}
      <button onClick={onNotes} className={`${btn} bg-white/5 hover:bg-white/10`} title="הערות / היסטוריה"><StickyNote size={14} /></button>
      <button onClick={onDelete} className={`${btn} bg-red-500/10 text-red-300 hover:bg-red-500/20`} title="מחק"><Trash2 size={14} /></button>
    </div>
  );
}

function NotesPanel({ lead, onClose, onFollowUp }: { lead: Lead; onClose: () => void; onFollowUp: (id: string, iso: string | null) => void }) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [followUp, setFollowUpLocal] = useState<string>(toDatetimeLocal(lead.follow_up_at));

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("lead_notes")
        .select("*").eq("lead_id", lead.id).order("created_at", { ascending: false });
      if (error) toast.error(error.message); else setNotes((data ?? []) as LeadNote[]);
      setLoading(false);
    })();
  }, [lead.id]);

  const add = async () => {
    const content = newNote.trim();
    if (!content) return;
    setSaving(true);
    const { data, error } = await supabase.from("lead_notes")
      .insert({ lead_id: lead.id, content }).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setNotes((p) => [data as LeadNote, ...p]);
    setNewNote("");
  };

  const removeNote = async (id: string) => {
    const { error } = await supabase.from("lead_notes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setNotes((p) => p.filter((n) => n.id !== id));
  };

  const saveFollowUp = () => {
    onFollowUp(lead.id, followUp ? new Date(followUp).toISOString() : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-md bg-background border-l border-white/10 h-full overflow-y-auto p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-muted-foreground">היסטוריית הערות</div>
            <h2 className="text-lg font-black">{lead.full_name}</h2>
            <a href={`tel:${lead.phone}`} dir="ltr" className="text-xs text-blue-400 hover:underline">{lead.phone}</a>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><X size={16} /></button>
        </div>

        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5"><CalendarClock size={13} /> תאריך מעקב</div>
          <div className="flex gap-2">
            <input type="datetime-local" value={followUp} onChange={(e) => setFollowUpLocal(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm" />
            <button onClick={saveFollowUp} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 rounded-lg">שמור</button>
            {lead.follow_up_at && (
              <button onClick={() => { setFollowUpLocal(""); onFollowUp(lead.id, null); }} className="bg-white/5 hover:bg-white/10 text-xs px-3 rounded-lg">נקה</button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3}
            placeholder="הוסף הערה פנימית..."
            className="w-full bg-card border border-white/10 rounded-xl p-3 text-sm resize-none" />
          <button onClick={add} disabled={saving || !newNote.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-1.5">
            <Plus size={14} /> הוסף הערה
          </button>
        </div>

        <div className="space-y-2">
          {loading ? <p className="text-xs text-muted-foreground">טוען...</p> :
            notes.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">אין הערות עדיין</p> :
            notes.map((n) => (
              <div key={n.id} className="bg-card border border-white/10 rounded-xl p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm whitespace-pre-line flex-1">{n.content}</p>
                  <button onClick={() => removeNote(n.id)} className="p-1 rounded text-red-300 hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
                <div className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString("he-IL")} · {timeAgo(n.created_at)}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}