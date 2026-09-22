import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Phone, Star, TrendingUp, ArrowUpFromLine, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: Overview });

type Stats = {
  totalLeads: number;
  newLeads: number;
  last7d: number;
  byLicense: Record<string, number>;
  bySource: Record<string, number>;
  pendingReviews: number;
};

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const [leadsRes, recentRes, reviewsRes] = await Promise.all([
        supabase.from("leads").select("license_type, source, status"),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      const leads = leadsRes.data ?? [];
      const byLicense: Record<string, number> = {};
      const bySource: Record<string, number> = {};
      let newLeads = 0;
      for (const l of leads) {
        if (l.license_type) byLicense[l.license_type] = (byLicense[l.license_type] ?? 0) + 1;
        if (l.source) bySource[l.source] = (bySource[l.source] ?? 0) + 1;
        if (l.status === "new") newLeads++;
      }
      setStats({
        totalLeads: leads.length,
        newLeads,
        last7d: recentRes.count ?? 0,
        byLicense, bySource,
        pendingReviews: reviewsRes.count ?? 0,
      });
    })();
  }, []);

  if (!stats) return <p className="text-sm text-muted-foreground">טוען נתונים...</p>;

  const topLicense = Object.entries(stats.byLicense).sort((a, b) => b[1] - a[1])[0];
  const waOpens = Object.entries(stats.bySource).filter(([k]) => k.toLowerCase().includes("whatsapp") || k.toLowerCase().includes("wa")).reduce((s, [, v]) => s + v, 0);

  const cards = [
    { label: "סה״כ לידים", value: stats.totalLeads, icon: Users },
    { label: "לידים חדשים", value: stats.newLeads, icon: Phone, accent: true },
    { label: "ב־7 ימים", value: stats.last7d, icon: TrendingUp },
    { label: "ביקורות ממתינות", value: stats.pendingReviews, icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black mb-1">סקירה</h1>
        <p className="text-sm text-muted-foreground">סיכום פעילות האתר</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`rounded-2xl p-4 border ${c.accent ? "bg-gradient-orange border-transparent text-white" : "bg-card border-white/10"}`}>
              <Icon size={18} className="mb-2 opacity-70" />
              <div className="text-3xl font-black">{c.value}</div>
              <div className="text-xs opacity-80 mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Panel title="לפי סוג רישיון">
          {Object.entries(stats.byLicense).length === 0 ? <Empty /> :
            Object.entries(stats.byLicense).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={stats.totalLeads} />
            ))
          }
          {topLicense && <p className="text-xs text-muted-foreground mt-3">הסוג המובחר ביותר: <span className="text-foreground font-bold">{topLicense[0]}</span></p>}
        </Panel>
        <Panel title="מקור הליד / לחיצות">
          {Object.entries(stats.bySource).length === 0 ? <Empty /> :
            Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={stats.totalLeads} />
            ))
          }
          <p className="text-xs text-muted-foreground mt-3">פתיחות וואטסאפ: <span className="text-foreground font-bold">{waOpens}</span></p>
        </Panel>
      </div>

      <PushToProduction />
    </div>
  );
}

const IS_STAGING = typeof window !== "undefined" && window.location.hostname.includes("staging");

type PushResult = { synced_tables?: string[]; rows?: Record<string, number> };

function PushToProduction() {
  const [pushing, setPushing] = useState(false);
  const [lastResult, setLastResult] = useState<PushResult | null>(null);

  if (!IS_STAGING) return null;

  const push = async () => {
    if (!confirm("לדחוף תוכן מהסטייג׳ לפרודקשן?\n\nיועברו: תוכן האתר, ביקורות מאושרות, גלריה, שאלות נפוצות, דרגות רישיון.")) return;
    setPushing(true);
    setLastResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("push-to-production");
      if (error) throw error;
      setLastResult(data as PushResult);
      toast.success("הועבר לפרודקשן בהצלחה!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה בדחיפה לפרודקשן");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="bg-card border border-orange-500/20 rounded-2xl p-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-black text-base mb-1">דחיפה לפרודקשן</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            מסנכרן מהסטייג׳ לאתר החי: תוכן, ביקורות מאושרות, גלריה, שאלות נפוצות, דרגות רישיון.
          </p>
          {lastResult && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
              <CheckCircle2 size={13} />
              סונכרן בהצלחה
            </div>
          )}
        </div>
        <button
          onClick={push}
          disabled={pushing}
          className="bg-gradient-orange text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          <ArrowUpFromLine size={15} />
          {pushing ? "מסנכרן..." : "דחוף לפרודקשן"}
        </button>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-4 sm:p-5">
      <h3 className="font-bold mb-4 text-sm">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Empty() { return <p className="text-xs text-muted-foreground">אין נתונים עדיין</p>; }
function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="text-muted-foreground">{value}</span></div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-orange" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
