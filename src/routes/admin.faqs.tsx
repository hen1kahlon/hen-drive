import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, ChevronUp, ChevronDown, Save } from "lucide-react";

export const Route = createFileRoute("/admin/faqs")({ component: FaqsPage });

type Faq = { id: string; question: string; answer: string; sort_order: number; is_active: boolean };

function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order").order("created_at");
    if (error) toast.error(error.message); else setFaqs((data ?? []) as Faq[]);
    setDirty({});
  }, []);
  useEffect(() => { load(); }, [load]);

  const setLocal = (id: string, patch: Partial<Faq>) => {
    setFaqs((p) => p.map((f) => f.id === id ? { ...f, ...patch } : f));
    setDirty((d) => ({ ...d, [id]: true }));
  };

  const save = async (f: Faq) => {
    const { error } = await supabase.from("faqs").update({ question: f.question, answer: f.answer, is_active: f.is_active, sort_order: f.sort_order }).eq("id", f.id);
    if (error) return toast.error(error.message);
    toast.success("נשמר"); setDirty((d) => { const n = { ...d }; delete n[f.id]; return n; });
  };

  const add = async () => {
    const { error } = await supabase.from("faqs").insert({ question: "שאלה חדשה", answer: "תשובה...", sort_order: faqs.length });
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= faqs.length) return;
    const a = faqs[idx], b = faqs[j];
    await Promise.all([
      supabase.from("faqs").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("faqs").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">שאלות נפוצות</h1>
          <p className="text-sm text-muted-foreground">עריכה והוספה של תוכן ה-FAQ</p>
        </div>
        <button onClick={add} className="bg-gradient-orange text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><Plus size={14} /> הוסף</button>
      </div>

      {faqs.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">אין שאלות עדיין</p>}

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={f.id} className="bg-card border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 bg-white/5 rounded-lg disabled:opacity-30"><ChevronUp size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === faqs.length - 1} className="p-1.5 bg-white/5 rounded-lg disabled:opacity-30"><ChevronDown size={14} /></button>
              <label className="text-xs flex items-center gap-1.5">
                <input type="checkbox" checked={f.is_active} onChange={(e) => setLocal(f.id, { is_active: e.target.checked })} />
                פעילה
              </label>
              <div className="flex-1" />
              {dirty[f.id] && <button onClick={() => save(f)} className="bg-green-500/20 text-green-300 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><Save size={12} /> שמור</button>}
              <button onClick={() => remove(f.id)} className="bg-red-500/10 text-red-300 hover:bg-red-500/20 p-1.5 rounded-lg"><Trash2 size={14} /></button>
            </div>
            <input value={f.question} onChange={(e) => setLocal(f.id, { question: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm font-bold" placeholder="שאלה" />
            <textarea value={f.answer} onChange={(e) => setLocal(f.id, { answer: e.target.value })} rows={3}
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" placeholder="תשובה" />
          </div>
        ))}
      </div>
    </div>
  );
}
