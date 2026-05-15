import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, ExternalLink, Eye } from "lucide-react";
import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "buttons", label: "כפתורים" },
  { id: "contact", label: "פרטי קשר" },
  { id: "social", label: "רשתות חברתיות" },
  { id: "stats", label: "סטטיסטיקות" },
  { id: "sections", label: "כותרות סקשנים" },
  { id: "footer", label: "פוטר" },
] as const;

type TabId = typeof TABS[number]["id"];

function SettingsPage() {
  const [data, setData] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [tab, setTab] = useState<TabId>("hero");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_settings").select("data").eq("id", "main").maybeSingle()
      .then(({ data: row }) => {
        const merged = mergeSettings(row?.data);
        setData(merged); setOriginal(merged); setLoading(false);
      });
  }, []);

  const dirty = JSON.stringify(data) !== JSON.stringify(original);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ id: "main", data: data as never });
    setSaving(false);
    if (error) return toast.error(error.message);
    setOriginal(data);
    toast.success("נשמר! האתר עודכן");
  };

  const update = <K extends keyof SiteSettings>(section: K, patch: Partial<SiteSettings[K]>) =>
    setData((d) => ({ ...d, [section]: { ...d[section], ...patch } }));

  if (loading) return <div className="text-center py-20 text-muted-foreground">טוען...</div>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-end justify-between flex-wrap gap-3 sticky top-0 md:top-0 z-10 bg-background/90 backdrop-blur py-2 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">CMS — ניהול תוכן האתר</h1>
          <p className="text-xs text-muted-foreground">שינויים נכנסים לאתר מיידית לאחר שמירה</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener" className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Eye size={14} /> תצוגה מקדימה
          </a>
          <button onClick={save} disabled={saving || !dirty}
            className="bg-gradient-orange text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-40">
            <Save size={14} /> {saving ? "שומר..." : dirty ? "שמור ופרסם" : "נשמר"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 -mx-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${tab === t.id ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
            {t.label}
          </button>
        ))}
        <a href="/admin/faqs" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-muted-foreground hover:bg-white/10 flex items-center gap-1">
          <ExternalLink size={11} /> FAQ
        </a>
        <a href="/admin/reviews" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-muted-foreground hover:bg-white/10 flex items-center gap-1">
          <ExternalLink size={11} /> ביקורות
        </a>
        <a href="/admin/gallery" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-muted-foreground hover:bg-white/10 flex items-center gap-1">
          <ExternalLink size={11} /> גלריה
        </a>
        <a href="/admin/license-cards" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-muted-foreground hover:bg-white/10 flex items-center gap-1">
          <ExternalLink size={11} /> דרגות רישיון
        </a>
      </div>

      {tab === "hero" && (
        <Section title="Hero — אזור הפתיחה">
          <Field label="באדג' עליון">
            <Input value={data.hero.badge} onChange={(v) => update("hero", { badge: v })} />
          </Field>
          <Field label="כותרת ראשית — שורה 1">
            <Input value={data.hero.headline_line1} onChange={(v) => update("hero", { headline_line1: v })} />
          </Field>
          <Field label="כותרת ראשית — מילה מודגשת">
            <Input value={data.hero.headline_highlight} onChange={(v) => update("hero", { headline_highlight: v })} />
          </Field>
          <Field label="טאגליין כתום">
            <Input value={data.hero.tagline} onChange={(v) => update("hero", { tagline: v })} />
          </Field>
          <Field label="תיאור">
            <Textarea value={data.hero.description} onChange={(v) => update("hero", { description: v })} rows={3} />
          </Field>
          <Field label="טקסט כפתור CTA ראשי">
            <Input value={data.hero.cta_primary} onChange={(v) => update("hero", { cta_primary: v })} />
          </Field>
          <ImageUploader label="תמונת Hero (משאיר ריק = ברירת מחדל)" value={data.hero.hero_media_url}
            onChange={(v) => update("hero", { hero_media_url: v })} folder="hero" />
        </Section>
      )}

      {tab === "buttons" && (
        <Section title="טקסטים של כפתורים">
          <Field label="כפתור וואטסאפ ב-Hero"><Input value={data.buttons.whatsapp} onChange={(v) => update("buttons", { whatsapp: v })} /></Field>
          <Field label="כפתור התקשר ב-Hero"><Input value={data.buttons.call} onChange={(v) => update("buttons", { call: v })} /></Field>
          <Field label="כפתור שליחה בטופס ליד"><Input value={data.buttons.lead_submit} onChange={(v) => update("buttons", { lead_submit: v })} /></Field>
          <Field label="CTA סופי — וואטסאפ"><Input value={data.buttons.final_cta_whatsapp} onChange={(v) => update("buttons", { final_cta_whatsapp: v })} /></Field>
          <Field label="CTA סופי — התקשרות"><Input value={data.buttons.final_cta_call} onChange={(v) => update("buttons", { final_cta_call: v })} /></Field>
        </Section>
      )}

      {tab === "contact" && (
        <Section title="פרטי קשר">
          <Field label="טלפון (לחיוג, ללא מקפים)"><Input dir="ltr" value={data.contact.phone} onChange={(v) => update("contact", { phone: v })} /></Field>
          <Field label="טלפון (תצוגה)"><Input dir="ltr" value={data.contact.phone_display} onChange={(v) => update("contact", { phone_display: v })} /></Field>
          <Field label="טלפון בינלאומי לוואטסאפ (לדוגמה: 972503250150)"><Input dir="ltr" value={data.contact.phone_intl} onChange={(v) => update("contact", { phone_intl: v })} /></Field>
          <Field label="אימייל"><Input dir="ltr" value={data.contact.email} onChange={(v) => update("contact", { email: v })} /></Field>
          <Field label="הודעת ברירת-מחדל לוואטסאפ">
            <Textarea value={data.contact.whatsapp_message} onChange={(v) => update("contact", { whatsapp_message: v })} rows={2} />
          </Field>
          <Field label="קישור Google Maps למגרש אימונים"><Input dir="ltr" value={data.contact.training_map_url} onChange={(v) => update("contact", { training_map_url: v })} /></Field>
          <Field label="אזור פעילות"><Input value={data.contact.area} onChange={(v) => update("contact", { area: v })} /></Field>
        </Section>
      )}

      {tab === "social" && (
        <Section title="רשתות חברתיות">
          <Field label="Instagram"><Input dir="ltr" value={data.social.instagram} onChange={(v) => update("social", { instagram: v })} /></Field>
          <Field label="TikTok"><Input dir="ltr" value={data.social.tiktok} onChange={(v) => update("social", { tiktok: v })} /></Field>
          <Field label="Facebook"><Input dir="ltr" value={data.social.facebook} onChange={(v) => update("social", { facebook: v })} /></Field>
        </Section>
      )}

      {tab === "stats" && (
        <Section title="מספרים מוצגים באתר">
          <div className="grid grid-cols-2 gap-3">
            <Field label="תלמידים — מספר"><Input value={data.stats.students} onChange={(v) => update("stats", { students: v })} /></Field>
            <Field label="תלמידים — תווית"><Input value={data.stats.students_label} onChange={(v) => update("stats", { students_label: v })} /></Field>
            <Field label="ותק — מספר"><Input value={data.stats.years} onChange={(v) => update("stats", { years: v })} /></Field>
            <Field label="ותק — תווית"><Input value={data.stats.years_label} onChange={(v) => update("stats", { years_label: v })} /></Field>
            <Field label="הצלחה — מספר"><Input value={data.stats.success} onChange={(v) => update("stats", { success: v })} /></Field>
            <Field label="הצלחה — תווית"><Input value={data.stats.success_label} onChange={(v) => update("stats", { success_label: v })} /></Field>
            <Field label="באדג' צף — מספר"><Input value={data.stats.floating} onChange={(v) => update("stats", { floating: v })} /></Field>
            <Field label="באדג' צף — תווית"><Input value={data.stats.floating_label} onChange={(v) => update("stats", { floating_label: v })} /></Field>
          </div>
        </Section>
      )}

      {tab === "sections" && (
        <div className="space-y-4">
          <Section title="סקשן דרגות (Categories)">
            <SmallTriple a={[data.sections.categories_eyebrow, "כותרת קטנה"]}
              b={[data.sections.categories_title1, "כותרת חלק 1"]}
              c={[data.sections.categories_title2, "כותרת חלק 2 (מודגש)"]}
              onA={(v) => update("sections", { categories_eyebrow: v })}
              onB={(v) => update("sections", { categories_title1: v })}
              onC={(v) => update("sections", { categories_title2: v })} />
          </Section>
          <Section title="סקשן עליי (About)">
            <SmallTriple a={[data.sections.about_eyebrow, "כותרת קטנה"]}
              b={[data.sections.about_title1, "כותרת חלק 1"]}
              c={[data.sections.about_title2, "כותרת חלק 2 (מודגש)"]}
              onA={(v) => update("sections", { about_eyebrow: v })}
              onB={(v) => update("sections", { about_title1: v })}
              onC={(v) => update("sections", { about_title2: v })} />
            <Field label="תיאור About"><Textarea value={data.sections.about_description} onChange={(v) => update("sections", { about_description: v })} rows={4} /></Field>
          </Section>
          <Section title="סקשן יתרונות (Why)">
            <SmallTriple a={[data.sections.why_eyebrow, "כותרת קטנה"]}
              b={[data.sections.why_title1, "כותרת חלק 1"]}
              c={[data.sections.why_title2, "כותרת חלק 2"]}
              onA={(v) => update("sections", { why_eyebrow: v })}
              onB={(v) => update("sections", { why_title1: v })}
              onC={(v) => update("sections", { why_title2: v })} />
          </Section>
          <Section title="סקשן ביקורות">
            <SmallTriple a={[data.sections.reviews_eyebrow, "כותרת קטנה"]}
              b={[data.sections.reviews_title1, "כותרת חלק 1"]}
              c={[data.sections.reviews_title2, "כותרת חלק 2"]}
              onA={(v) => update("sections", { reviews_eyebrow: v })}
              onB={(v) => update("sections", { reviews_title1: v })}
              onC={(v) => update("sections", { reviews_title2: v })} />
          </Section>
          <Section title="סקשן FAQ">
            <SmallTriple a={[data.sections.faq_eyebrow, "כותרת קטנה"]}
              b={[data.sections.faq_title1, "כותרת חלק 1"]}
              c={[data.sections.faq_title2, "כותרת חלק 2"]}
              onA={(v) => update("sections", { faq_eyebrow: v })}
              onB={(v) => update("sections", { faq_title1: v })}
              onC={(v) => update("sections", { faq_title2: v })} />
          </Section>
          <Section title="סקשן ליד (טופס)">
            <Field label="כותרת חלק 1"><Input value={data.sections.lead_title1} onChange={(v) => update("sections", { lead_title1: v })} /></Field>
            <Field label="כותרת חלק 2"><Input value={data.sections.lead_title2} onChange={(v) => update("sections", { lead_title2: v })} /></Field>
            <Field label="תיאור"><Textarea value={data.sections.lead_description} onChange={(v) => update("sections", { lead_description: v })} rows={2} /></Field>
          </Section>
          <Section title="CTA סופי">
            <Field label="כותרת חלק 1"><Input value={data.sections.final_cta_title1} onChange={(v) => update("sections", { final_cta_title1: v })} /></Field>
            <Field label="כותרת חלק 2 (מודגש)"><Input value={data.sections.final_cta_title2} onChange={(v) => update("sections", { final_cta_title2: v })} /></Field>
            <Field label="תיאור"><Textarea value={data.sections.final_cta_description} onChange={(v) => update("sections", { final_cta_description: v })} rows={2} /></Field>
          </Section>
        </div>
      )}

      {tab === "footer" && (
        <Section title="פוטר">
          <Field label="טקסט אודות בפוטר"><Textarea value={data.sections.footer_about} onChange={(v) => update("sections", { footer_about: v })} rows={3} /></Field>
        </Section>
      )}
    </div>
  );
}

const inputCls = "w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-white/30 outline-none";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3"><h3 className="font-black text-lg mb-2">{title}</h3>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-semibold mb-1 block text-muted-foreground">{label}</label>{children}</div>;
}
function Input({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl" }) {
  return <input value={value} dir={dir} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}
function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={inputCls} />;
}
function SmallTriple({ a, b, c, onA, onB, onC }: { a: [string, string]; b: [string, string]; c: [string, string]; onA: (v: string) => void; onB: (v: string) => void; onC: (v: string) => void }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <Field label={a[1]}><Input value={a[0]} onChange={onA} /></Field>
      <Field label={b[1]}><Input value={b[0]} onChange={onB} /></Field>
      <Field label={c[1]}><Input value={c[0]} onChange={onC} /></Field>
    </div>
  );
}

function ImageUploader({ label, value, onChange, folder }: { label: string; value: string; onChange: (v: string) => void; folder: string }) {
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast.error("עד 5MB");
    setUp(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file, { cacheControl: "3600" });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      onChange(pub.publicUrl);
      toast.success("הועלה — לא לשכוח לשמור");
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setUp(false); }
  };
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input value={value} dir="ltr" onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder="https://..." />
        <button onClick={() => ref.current?.click()} disabled={up} className="bg-white/5 hover:bg-white/10 px-3 rounded-xl text-xs flex items-center gap-1 disabled:opacity-50 shrink-0">
          <Upload size={12} /> {up ? "..." : "העלה"}
        </button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      </div>
      {value && <img src={value} alt="" className="mt-2 rounded-lg max-h-40 border border-white/10" />}
    </Field>
  );
}
