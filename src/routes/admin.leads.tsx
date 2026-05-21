import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Download, Bell, BellOff, Upload, CalendarClock, Clock } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  type Lead, type LeadStatus,
  STATUS_LABEL, STATUS_STYLES,
  timeAgo, followUpBadge, playDing,
} from "@/components/admin/leads/types";
import { LeadCard, LeadActions, StatTile } from "@/components/admin/leads/LeadCard";
import { NotesPanel } from "@/components/admin/leads/NotesPanel";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

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

  const importCsv = async (file: File) => {
    try {
      const text = await file.text();
      const clean = text.replace(/^\uFEFF/, "");
      const lines = clean.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) { toast.error("הקובץ ריק"); return; }
      // very small CSV parser supporting quoted fields
      const parseRow = (line: string): string[] => {
        const out: string[] = []; let cur = ""; let q = false;
        for (let i = 0; i < line.length; i++) {
          const c = line[i];
          if (q) {
            if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
            else if (c === '"') { q = false; }
            else cur += c;
          } else {
            if (c === ',') { out.push(cur); cur = ""; }
            else if (c === '"') q = true;
            else cur += c;
          }
        }
        out.push(cur); return out;
      };
      const header = parseRow(lines[0]).map((h) => h.trim());
      const idx = (name: string) => header.findIndex((h) => h === name);
      const iName = idx("שם"), iPhone = idx("טלפון"), iLic = idx("רישיון");
      const iInterest = idx("מסלול"), iArea = idx("אזור"), iNotes = idx("הערות"), iSrc = idx("מקור");
      if (iName < 0 || iPhone < 0) { toast.error("חסר עמודות שם/טלפון"); return; }
      const rows = lines.slice(1).map(parseRow);
      const payload = rows.map((r) => ({
        full_name: (r[iName] ?? "").trim().slice(0, 100),
        phone: (r[iPhone] ?? "").trim().slice(0, 30),
        license_type: iLic >= 0 && ["B","A1","A2","A"].includes((r[iLic] ?? "").trim()) ? (r[iLic] ?? "").trim() : null,
        interest: iInterest >= 0 ? ((r[iInterest] ?? "").trim().slice(0, 200) || null) : null,
        area: iArea >= 0 ? ((r[iArea] ?? "").trim().slice(0, 200) || null) : null,
        notes: iNotes >= 0 ? ((r[iNotes] ?? "").trim().slice(0, 2000) || null) : null,
        source: iSrc >= 0 ? ((r[iSrc] ?? "").trim().slice(0, 100) || "csv-import") : "csv-import",
      })).filter((r) => r.full_name && r.phone.length >= 5);
      if (!payload.length) { toast.error("לא נמצאו שורות תקינות"); return; }
      if (!confirm(`לייבא ${payload.length} לידים?`)) return;
      const { data, error } = await supabase.from("leads").insert(payload).select();
      if (error) { toast.error(error.message); return; }
      toast.success(`יובאו ${data?.length ?? payload.length} לידים`);
      await load();
    } catch (e) {
      toast.error("שגיאה בקריאת הקובץ");
    }
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
  const overdueCount = leads.filter((l) =>
    l.follow_up_at &&
    new Date(l.follow_up_at).getTime() < Date.now() &&
    l.status !== "won" &&
    l.status !== "closed" &&
    l.status !== "not_relevant" &&
    l.status !== "archived"
  ).length;

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
          <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Upload size={14} /> ייבא CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) void importCsv(f); e.target.value = "";
            }} />
          </label>
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


