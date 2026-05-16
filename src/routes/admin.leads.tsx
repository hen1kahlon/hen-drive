import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Trash2, Check, Download, Phone, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

type Lead = {
  id: string; full_name: string; phone: string; license_type: string | null;
  source: string | null; status: "new" | "contacted" | "closed" | "archived";
  notes: string | null; interest: string | null; area: string | null; created_at: string;
};

const STATUS_LABEL: Record<Lead["status"], string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  closed: "נסגר",
  archived: "ארכיון",
};

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Lead["status"]>("all");
  const [licenseFilter, setLicenseFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => leads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (licenseFilter !== "all" && l.license_type !== licenseFilter) return false;
    if (q && !(`${l.full_name} ${l.phone} ${l.source ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [leads, q, statusFilter, licenseFilter]);

  const setStatus = async (id: string, status: Lead["status"]) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((p) => p.map((l) => l.id === id ? { ...l, status } : l));
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את הליד?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((p) => p.filter((l) => l.id !== id));
    toast.success("נמחק");
  };

  const exportCsv = () => {
    const rows = [["שם", "טלפון", "רישיון", "מסלול", "אזור", "הערות", "מקור", "סטטוס", "תאריך"]].concat(
      filtered.map((l) => [l.full_name, l.phone, l.license_type ?? "", l.interest ?? "", l.area ?? "", l.notes ?? "", l.source ?? "", l.status, new Date(l.created_at).toLocaleString("he-IL")])
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
    closed: leads.filter((l) => l.status === "closed").length,
    archived: leads.filter((l) => l.status === "archived").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">לידים</h1>
          <p className="text-sm text-muted-foreground">ניהול פניות ופרטי קשר</p>
        </div>
        <button onClick={exportCsv} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <Download size={14} /> ייצא CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש שם / טלפון / מקור"
            className="w-full bg-card border border-white/10 rounded-xl pr-9 pl-3 py-2.5 text-sm" />
        </div>
        <select value={licenseFilter} onChange={(e) => setLicenseFilter(e.target.value)}
          className="bg-card border border-white/10 rounded-xl px-3 py-2.5 text-sm">
          <option value="all">כל הרישיונות</option>
          <option value="B">B</option><option value="A">A</option><option value="A1">A1</option><option value="A2">A2</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "new", "contacted", "closed"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${statusFilter === s ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
            {s === "all" ? "הכל" : s === "new" ? "חדשים" : s === "contacted" ? "נוצר קשר" : "נסגרו"} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-muted-foreground">טוען...</p> :
        filtered.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">אין לידים להצגה</p> :
        <div className="grid gap-2">
          {filtered.map((l) => (
            <div key={l.id} className="bg-card border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold">{l.full_name}</span>
                    {l.license_type && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{l.license_type}</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${l.status === "new" ? "bg-yellow-500/20 text-yellow-300" : l.status === "contacted" ? "bg-green-500/20 text-green-300" : "bg-white/10 text-muted-foreground"}`}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </div>
                  <a href={`tel:${l.phone}`} dir="ltr" className="text-sm text-foreground/90 inline-flex items-center gap-1.5 hover:underline">
                    <Phone size={12} /> {l.phone}
                  </a>
                  {(l.interest || l.area) && (
                    <div className="text-[11px] text-foreground/70 mt-1">
                      {l.interest && <span>מסלול: <b className="text-foreground/90">{l.interest}</b></span>}
                      {l.interest && l.area && <span> · </span>}
                      {l.area && <span>אזור: <b className="text-foreground/90">{l.area}</b></span>}
                    </div>
                  )}
                  {l.notes && <div className="text-[11px] text-muted-foreground mt-1 whitespace-pre-line">הערות: {l.notes}</div>}
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {l.source && <span>מקור: <b className="text-foreground/80">{l.source}</b> · </span>}
                    {new Date(l.created_at).toLocaleString("he-IL")}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {l.status !== "contacted" && <button onClick={() => setStatus(l.id, "contacted")} title="סמן שנוצר קשר" className="bg-green-500/20 text-green-300 hover:bg-green-500/30 p-2 rounded-lg"><Check size={14} /></button>}
                  {l.status !== "closed" && <button onClick={() => setStatus(l.id, "closed")} title="סמן כסגור" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg"><XCircle size={14} /></button>}
                  <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-xs" title="וואטסאפ">WA</a>
                  <button onClick={() => remove(l.id)} className="bg-red-500/10 text-red-300 hover:bg-red-500/20 p-2 rounded-lg" title="מחק"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
