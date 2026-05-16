import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Trash2, RefreshCw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/errors")({ component: ErrorsPage });

type ErrorLog = {
  id: string; created_at: string; level: string; source: string;
  message: string; stack: string | null; url: string | null;
  user_agent: string | null; resolved: boolean;
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "לפני רגע";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} ד׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} ש׳`;
  return new Date(iso).toLocaleString("he-IL");
}

function ErrorsPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setLogs((data ?? []) as ErrorLog[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const toggleResolved = async (id: string, resolved: boolean) => {
    const { error } = await supabase.from("error_logs").update({ resolved: !resolved }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setLogs((p) => p.map((l) => (l.id === id ? { ...l, resolved: !resolved } : l)));
  };

  const deleteLog = async (id: string) => {
    const { error } = await supabase.from("error_logs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setLogs((p) => p.filter((l) => l.id !== id));
    toast.success("נמחק");
  };

  const clearResolved = async () => {
    if (!confirm("למחוק את כל השגיאות שטופלו?")) return;
    const { error } = await supabase.from("error_logs").delete().eq("resolved", true);
    if (error) { toast.error(error.message); return; }
    setLogs((p) => p.filter((l) => !l.resolved));
    toast.success("נוקה");
  };

  const filtered = useMemo(() => logs.filter((l) => {
    if (filter === "unresolved" && l.resolved) return false;
    if (filter === "resolved" && !l.resolved) return false;
    if (search && !`${l.message} ${l.url ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [logs, filter, search]);

  const stats = {
    total: logs.length,
    unresolved: logs.filter((l) => !l.resolved).length,
    last24h: logs.filter((l) => Date.now() - new Date(l.created_at).getTime() < 86400_000).length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">דוח שגיאות</h1>
          <p className="text-sm text-muted-foreground">
            סה״כ <span className="font-bold text-foreground">{stats.total}</span> ·
            לא טופלו <span className="font-bold text-red-400">{stats.unresolved}</span> ·
            ב-24 שעות <span className="font-bold text-yellow-400">{stats.last24h}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <RefreshCw size={14} /> רענן
          </button>
          <button onClick={() => void clearResolved()} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Trash2 size={14} /> נקה שטופלו
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["unresolved", "all", "resolved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === f ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
            {f === "unresolved" ? "לא טופלו" : f === "all" ? "הכל" : "טופלו"}
          </button>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">טוען...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
          אין שגיאות {filter === "unresolved" && "לא מטופלות"} 🎉
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => {
            const isOpen = openId === l.id;
            return (
              <div key={l.id} className={`bg-card border rounded-xl p-3 ${l.resolved ? "border-white/5 opacity-60" : "border-red-500/20"}`}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <AlertTriangle size={14} className={l.resolved ? "text-muted-foreground" : "text-red-400"} />
                      <span className="text-xs text-muted-foreground">{timeAgo(l.created_at)}</span>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{l.source}</span>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{l.level}</span>
                    </div>
                    <div className="text-sm font-medium break-words">{l.message}</div>
                    {l.url && <div className="text-[11px] text-muted-foreground mt-1 break-all">{l.url}</div>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setOpenId(isOpen ? null : l.id)} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded">
                      {isOpen ? "סגור" : "פרטים"}
                    </button>
                    <button onClick={() => void toggleResolved(l.id, l.resolved)} title={l.resolved ? "החזר" : "סמן כטופל"}
                      className={`p-1.5 rounded ${l.resolved ? "bg-white/5 text-muted-foreground" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"}`}>
                      <CheckCircle2 size={14} />
                    </button>
                    <button onClick={() => void deleteLog(l.id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-[11px]">
                    {l.stack && (
                      <div>
                        <div className="text-muted-foreground mb-1">Stack:</div>
                        <pre className="bg-black/40 p-2 rounded overflow-x-auto text-[10px] leading-relaxed whitespace-pre-wrap break-all">{l.stack}</pre>
                      </div>
                    )}
                    {l.user_agent && (
                      <div className="text-muted-foreground"><span className="font-bold">UA:</span> {l.user_agent}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
