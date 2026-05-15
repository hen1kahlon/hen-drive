import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, Instagram, Facebook, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

type SiteData = {
  hero: { headline: string; subheadline: string; cta: string; hero_media_url: string };
  social: { instagram: string; tiktok: string; facebook: string; whatsapp: string };
};

const DEFAULT: SiteData = {
  hero: { headline: "", subheadline: "", cta: "", hero_media_url: "" },
  social: { instagram: "", tiktok: "", facebook: "", whatsapp: "" },
};

function SettingsPage() {
  const [data, setData] = useState<SiteData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("site_settings").select("data").eq("id", "main").maybeSingle();
      if (row?.data) setData({ ...DEFAULT, ...(row.data as Partial<SiteData>), hero: { ...DEFAULT.hero, ...((row.data as { hero?: SiteData["hero"] }).hero ?? {}) }, social: { ...DEFAULT.social, ...((row.data as { social?: SiteData["social"] }).social ?? {}) } });
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ id: "main", data: data as unknown as Record<string, unknown> });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("נשמר בהצלחה");
  };

  const uploadHero = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `hero/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file, { cacheControl: "3600" });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      setData((d) => ({ ...d, hero: { ...d.hero, hero_media_url: pub.publicUrl } }));
      toast.success("התמונה הועלתה (לא לשכוח לשמור)");
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">הגדרות אתר</h1>
          <p className="text-sm text-muted-foreground">עריכת hero ורשתות חברתיות</p>
        </div>
        <button onClick={save} disabled={saving} className="bg-gradient-orange text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
          <Save size={14} /> {saving ? "שומר..." : "שמור הכל"}
        </button>
      </div>

      <Section title="Hero">
        <Field label="כותרת ראשית"><input value={data.hero.headline} onChange={(e) => setData({ ...data, hero: { ...data.hero, headline: e.target.value } })} className={inputCls} /></Field>
        <Field label="כותרת משנית"><textarea value={data.hero.subheadline} onChange={(e) => setData({ ...data, hero: { ...data.hero, subheadline: e.target.value } })} rows={2} className={inputCls} /></Field>
        <Field label="טקסט CTA"><input value={data.hero.cta} onChange={(e) => setData({ ...data, hero: { ...data.hero, cta: e.target.value } })} className={inputCls} /></Field>
        <Field label="תמונת Hero (URL)">
          <div className="flex gap-2">
            <input value={data.hero.hero_media_url} dir="ltr" onChange={(e) => setData({ ...data, hero: { ...data.hero, hero_media_url: e.target.value } })} className={inputCls} placeholder="https://..." />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-white/5 hover:bg-white/10 px-3 rounded-xl text-xs flex items-center gap-1 disabled:opacity-50 shrink-0">
              <Upload size={12} /> {uploading ? "..." : "העלה"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadHero(f); }} />
          </div>
          {data.hero.hero_media_url && <img src={data.hero.hero_media_url} alt="" className="mt-2 rounded-lg max-h-40" />}
        </Field>
      </Section>

      <Section title="רשתות חברתיות">
        <SocialField icon={Instagram} label="Instagram" value={data.social.instagram} onChange={(v) => setData({ ...data, social: { ...data.social, instagram: v } })} />
        <SocialField icon={MessageCircle} label="TikTok" value={data.social.tiktok} onChange={(v) => setData({ ...data, social: { ...data.social, tiktok: v } })} />
        <SocialField icon={Facebook} label="Facebook" value={data.social.facebook} onChange={(v) => setData({ ...data, social: { ...data.social, facebook: v } })} />
        <SocialField icon={MessageCircle} label="WhatsApp (מספר או קישור)" value={data.social.whatsapp} onChange={(v) => setData({ ...data, social: { ...data.social, whatsapp: v } })} />
      </Section>
    </div>
  );
}

const inputCls = "w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm";
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3"><h3 className="font-bold mb-2">{title}</h3>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-semibold mb-1 block">{label}</label>{children}</div>;
}
function SocialField({ icon: Icon, label, value, onChange }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1 flex items-center gap-1.5"><Icon size={12} /> {label}</label>
      <input value={value} dir="ltr" onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder="https://..." />
    </div>
  );
}
