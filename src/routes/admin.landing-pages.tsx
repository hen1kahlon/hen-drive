import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Plus, Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/landing-pages")({ component: LandingPagesAdmin });

type Row = {
  slug: string;
  is_active: boolean;
  seo: { title?: string; description?: string; keywords?: string };
  hero: {
    eyebrow?: string; h1Lead?: string; h1Highlight?: string;
    intro?: string; ctaSubline?: string; waMessage?: string;
  };
  highlights: { icon: string; title: string; body: string }[];
  reviews: { name: string; type: string; text: string }[];
  faqs: { q: string; a: string }[];
  related: { to: string; title: string }[];
};

const ICONS = ["bike", "car", "shield", "grad", "trophy"];

const LABELS: Record<string, string> = {
  "car-lessons-ashkelon": "שיעורי רכב",
  "motorcycle-lessons-ashkelon": "שיעורי אופנוע (A / A1 / A2)",
};

function LandingPagesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("landing_pages").select("*").order("slug");
    if (error) return toast.error(error.message);
    const norm = (data ?? []).map((r: any) => ({
      ...r,
      seo: r.seo ?? {},
      hero: r.hero ?? {},
      highlights: Array.isArray(r.highlights) ? r.highlights : [],
      reviews: Array.isArray(r.reviews) ? r.reviews : [],
      faqs: Array.isArray(r.faqs) ? r.faqs : [],
      related: Array.isArray(r.related) ? r.related : [],
    })) as unknown as Row[];
    setRows(norm);
    if (!active && norm.length) setActive(norm[0].slug);
  }, [active]);
  useEffect(() => { load(); }, [load]);

  const current = rows.find((r) => r.slug === active);
  const patch = (p: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.slug === active ? { ...r, ...p } : r)));

  const save = async () => {
    if (!current) return;
    setSaving(true);
    const { error } = await supabase.from("landing_pages").update({
      is_active: current.is_active,
      seo: current.seo,
      hero: current.hero,
      highlights: current.highlights,
      reviews: current.reviews,
      faqs: current.faqs,
      related: current.related,
    }).eq("slug", current.slug);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("נשמר! רענן את הדף ציבורי כדי לראות את השינויים");
  };

  if (!current) {
    return <div className="text-sm text-muted-foreground">טוען...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">עמודי נחיתה</h1>
          <p className="text-sm text-muted-foreground">עריכת תוכן וSEO לכל עמוד נחיתה</p>
        </div>
        <div className="flex gap-2">
          <a href={`/${current.slug}`} target="_blank" rel="noopener noreferrer"
            className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5">
            <ExternalLink size={12} /> פתח עמוד
          </a>
          <button onClick={save} disabled={saving}
            className="bg-gradient-orange text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
            <Save size={14} /> {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </div>

      {/* Slug tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {rows.map((r) => (
          <button key={r.slug} onClick={() => setActive(r.slug)}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${active === r.slug ? "bg-gradient-orange text-white" : "bg-white/5 hover:bg-white/10"}`}>
            {LABELS[r.slug] ?? r.slug}
          </button>
        ))}
      </div>

      {/* Activity toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={current.is_active}
          onChange={(e) => patch({ is_active: e.target.checked })} />
        עמוד פעיל (גלוי לציבור)
      </label>

      {/* SEO */}
      <Section title="SEO – כותרת ותיאור">
        <Field label="כותרת (Title)" value={current.seo.title || ""}
          onChange={(v) => patch({ seo: { ...current.seo, title: v } })} />
        <Field label="תיאור (Meta description)" type="textarea" value={current.seo.description || ""}
          onChange={(v) => patch({ seo: { ...current.seo, description: v } })} />
        <Field label="מילות מפתח" type="textarea" rows={2} value={current.seo.keywords || ""}
          onChange={(v) => patch({ seo: { ...current.seo, keywords: v } })} />
        <p className="text-xs text-muted-foreground">שינויי SEO ייכנסו לפעול בבנייה הבאה של האתר.</p>
      </Section>

      {/* Hero */}
      <Section title="כותרת ראשית (Hero)">
        <Field label="Eyebrow" value={current.hero.eyebrow || ""}
          onChange={(v) => patch({ hero: { ...current.hero, eyebrow: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="H1 לפני הדגשה" value={current.hero.h1Lead || ""}
            onChange={(v) => patch({ hero: { ...current.hero, h1Lead: v } })} />
          <Field label="H1 מודגש" value={current.hero.h1Highlight || ""}
            onChange={(v) => patch({ hero: { ...current.hero, h1Highlight: v } })} />
        </div>
        <Field label="פסקה תיאור" type="textarea" value={current.hero.intro || ""}
          onChange={(v) => patch({ hero: { ...current.hero, intro: v } })} />
        <Field label="כותרת CTA סופי" value={current.hero.ctaSubline || ""}
          onChange={(v) => patch({ hero: { ...current.hero, ctaSubline: v } })} />
        <Field label="הודעת WhatsApp ברירת מחדל" type="textarea" rows={2} value={current.hero.waMessage || ""}
          onChange={(v) => patch({ hero: { ...current.hero, waMessage: v } })} />
      </Section>

      {/* Highlights */}
      <ArraySection title="יתרונות"
        items={current.highlights}
        onChange={(items) => patch({ highlights: items })}
        empty={{ icon: "car", title: "", body: "" }}
        renderItem={(item, set) => (
          <>
            <select value={item.icon} onChange={(e) => set({ icon: e.target.value })}
              className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
              {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
            <input value={item.title} onChange={(e) => set({ title: e.target.value })}
              placeholder="כותרת" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm font-bold" />
            <textarea value={item.body} onChange={(e) => set({ body: e.target.value })} rows={2}
              placeholder="טקסט" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </>
        )} />

      {/* Reviews */}
      <ArraySection title="המלצות תלמידים"
        items={current.reviews}
        onChange={(items) => patch({ reviews: items })}
        empty={{ name: "", type: "", text: "" }}
        renderItem={(item, set) => (
          <>
            <div className="grid grid-cols-2 gap-2">
              <input value={item.name} onChange={(e) => set({ name: e.target.value })}
                placeholder="שם" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm font-bold" />
              <input value={item.type} onChange={(e) => set({ type: e.target.value })}
                placeholder="סוג רישיון (B / A2 וכו')" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
            </div>
            <textarea value={item.text} onChange={(e) => set({ text: e.target.value })} rows={2}
              placeholder="טקסט ההמלצה" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </>
        )} />

      {/* FAQ */}
      <ArraySection title="שאלות נפוצות"
        items={current.faqs}
        onChange={(items) => patch({ faqs: items })}
        empty={{ q: "", a: "" }}
        renderItem={(item, set) => (
          <>
            <input value={item.q} onChange={(e) => set({ q: e.target.value })}
              placeholder="שאלה" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm font-bold" />
            <textarea value={item.a} onChange={(e) => set({ a: e.target.value })} rows={3}
              placeholder="תשובה" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </>
        )} />

      {/* Related */}
      <ArraySection title="קישורים פנימיים"
        items={current.related}
        onChange={(items) => patch({ related: items })}
        empty={{ to: "/", title: "" }}
        renderItem={(item, set) => (
          <div className="grid grid-cols-2 gap-2">
            <input value={item.to} onChange={(e) => set({ to: e.target.value })}
              placeholder="/path" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm font-mono ltr" dir="ltr" />
            <input value={item.title} onChange={(e) => set({ title: e.target.value })}
              placeholder="טקסט הקישור" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </div>
        )} />

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <button onClick={save} disabled={saving}
          className="bg-gradient-orange text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50">
          <Save size={16} /> {saving ? "שומר..." : "שמור את כל השינויים"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-4 space-y-3">
      <h2 className="font-black text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "input", rows: r = 3 }: {
  label: string; value: string; onChange: (v: string) => void; type?: "input" | "textarea"; rows?: number;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {type === "textarea" ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={r}
          className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
      ) : (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
      )}
    </label>
  );
}

function ArraySection<T extends object>({ title, items, onChange, empty, renderItem }: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="bg-card border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-lg">{title}</h2>
        <button onClick={() => onChange([...items, { ...empty }])}
          className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1">
          <Plus size={12} /> הוסף
        </button>
      </div>
      {items.length === 0 && <p className="text-xs text-muted-foreground">אין פריטים</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-background/50 border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <button onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="bg-red-500/10 text-red-300 hover:bg-red-500/20 p-1.5 rounded-lg">
                <Trash2 size={12} />
              </button>
            </div>
            {renderItem(item, (p) => onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it))))}
          </div>
        ))}
      </div>
    </div>
  );
}