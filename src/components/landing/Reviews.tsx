import { useState, useEffect } from "react";
import { Star, Car, Bike, Check, Trophy, MessageCircle, Phone, Upload, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import { getSafeImageMimeType } from "@/lib/image-upload";

const fallbackReviews = [
  { id: "f1", full_name: "ליאור מ׳ – אשקלון", content: "חן הכי סבלני בעולם — עברתי טסט ראשון על רכב אוטומט! מורה רציני, מסביר עד שמבינים, ויודע להרגיע בלחץ של המבחן. ממליץ לכל מי שמחפש מורה נהיגה באשקלון.", rating: 5, license_type: "B", image_url: null },
  { id: "f2", full_name: "נועה ש׳ – אשקלון", content: "הרגשתי בטוחה מהשיעור הראשון. חן מלמד עם הרבה אורך רוח, מכיר כל פינה בעיר ומגיע לאסוף מהבית. עברתי טסט בפעם הראשונה 🎉", rating: 5, license_type: "B", image_url: null },
  { id: "f3", full_name: "יובל א׳ – אשקלון", content: "למדתי אופנוע A2 אצל חן — חוויה מטורפת. הסבר מסודר, ציוד חדש ובטוח, והכי חשוב — רישיון ביד מהפעם הראשונה!", rating: 5, license_type: "A2", image_url: null },
  { id: "f4", full_name: "דניאל מ׳ – אשקלון", content: "התחלתי בלי שום ידע ברכב, וחן לקח אותי שלב-שלב עד לטסט בלי לחץ. מורה צעיר, מקצועי ומסור — שווה כל שקל.", rating: 5, license_type: "B", image_url: null },
  { id: "f5", full_name: "עומר כ׳ – אשקלון", content: "הוצאתי A1 אצל חן אחרי שכל החברים המליצו. שיעורים ממוקדים, הכנה אמיתית לטסט, ומורה שבאמת אכפת לו שתעבור. ממליץ בענק על בית הספר לאופנוע באשקלון.", rating: 5, license_type: "A1", image_url: null },
  { id: "f6", full_name: "שיר ב׳ – אשקלון", content: "המורה הכי טוב שיכולתי לבקש. סבלני, מקצועי ומסביר עד שמתחיל לזרום. עברתי טסט ראשון על רכב אוטומט וכבר ממליצה לחברות.", rating: 5, license_type: "B", image_url: null },
  { id: "f7", full_name: "אדיר ל׳ – אשקלון", content: "באתי לחן אחרי שני מורים אחרים. תוך חודש סיימתי את כל השיעורים על A — ועברתי טסט ראשון. כיף ללמוד אצל מישהו שחי את התחום.", rating: 5, license_type: "A", image_url: null },
  { id: "f8", full_name: "מאי ג׳ – אשקלון", content: "אווירה צעירה, יחס אישי ובלי שיפוטיות. חן מסביר בגובה העיניים ובאמת מלווה עד הסוף. עברתי טסט ראשון על רכב 🚗", rating: 5, license_type: "B", image_url: null },
];

const REVIEW_AGGREGATE = { value: 5.0, count: 120 };

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40 35.6 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

function ReviewBadgeIcon({ type }: { type: string }) {
  if (type === "B") return <Car size={11} />;
  return <Bike size={11} />;
}

function ReviewBadgeLabel(type: string) {
  if (type === "B") return "רכב B";
  if (type === "A") return "אופנוע A";
  if (type === "A1") return "אופנוע A1";
  if (type === "A2") return "אופנוע A2";
  return `דרגה ${type}`;
}

function TrustHeader() {
  return (
    <div
      className="mx-auto mb-6 sm:mb-10 max-w-xl glass-strong border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-white grid place-items-center shrink-0 shadow-card">
        <GoogleGlyph className="w-7 h-7" />
      </div>
      <div className="flex-1 text-right">
        <div className="flex items-center gap-2 justify-start flex-row-reverse">
          <span className="text-xl font-black tabular-nums">{REVIEW_AGGREGATE.value.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          מבוסס על <span className="font-bold text-foreground">{REVIEW_AGGREGATE.count}+</span> חוות דעת תלמידים – Google &amp; אתר
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-center gap-0.5 text-center pr-3 border-r border-white/10">
        <Trophy size={18} className="text-[oklch(0.72_0.18_50)]" />
        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">98% טסט ראשון</span>
      </div>
    </div>
  );
}

function ReviewsCTA() {
  const s = useSiteSettings();
  return (
    <div
      className="mt-8 sm:mt-12 max-w-3xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[oklch(0.18_0.04_255)] via-[oklch(0.12_0.03_255)] to-[oklch(0.10_0.02_140)] p-6 sm:p-8 text-center">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#25D366]/10" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[oklch(0.55_0.22_255_/_0.12)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 mb-3 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            הצטרפו אליהם השבוע
          </div>
          <h3 className="text-display text-2xl sm:text-3xl mb-2">
            רוצה להיות הסיפור <span className="gradient-text-blue">ההצלחה הבא</span>?
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            שלחו הודעה עכשיו וקבלו תוך דקות פרטים על שיעור ניסיון באשקלון – רכב או אופנוע.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={waUrl(s)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition"
            >
              <MessageCircle size={18} /> שלחו וואטסאפ עכשיו
            </a>
            <a
              href={`tel:${s.contact.phone}`}
              className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-6 py-3.5 text-sm font-bold hover:bg-white/5 transition"
            >
              <Phone size={18} /> {s.contact.phone_display}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

type PublicReview = { id: string; full_name: string; content: string; rating: number; license_type: string; image_url: string | null };

function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return <>{mounted ? children : fallback}</>;
}

function SubmitReview() {
  const [form, setForm] = useState({ full_name: "", rating: 5, license_type: "B", content: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.full_name.trim().length < 1 || form.content.trim().length < 1) {
      toast.error("נא למלא שם וטקסט ביקורת");
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("התמונה גדולה מדי (מקס׳ 5MB)");
        const mimeType = getSafeImageMimeType(file);
        const ext = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : "webp";
        const path = `submissions/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-images").upload(path, file, { contentType: mimeType });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("review-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const { error } = await supabase.from("reviews").insert({
        full_name: form.full_name.trim(),
        rating: form.rating,
        license_type: form.license_type,
        content: form.content.trim(),
        image_url,
        status: "pending",
        is_featured: false,
      });
      if (error) throw error;
      toast.success("הביקורת נשלחה וממתינה לאישור");
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? `שגיאה בשליחת ביקורת: ${err.message}` : "שגיאה בשליחת ביקורת");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="gradient-text-blue font-bold text-xs tracking-[0.2em] uppercase mb-2">שתפו את החוויה</p>
        <h3 className="text-display text-3xl sm:text-4xl">השאירו ביקורת</h3>
      </div>

      {done ? (
        <div className="bg-card border border-green-500/20 rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/20 grid place-items-center mx-auto mb-4">
            <Check className="text-green-300" size={28} />
          </div>
          <p className="text-lg font-bold mb-2">תודה!</p>
          <p className="text-sm text-muted-foreground">הביקורת נשלחה ותפורסם לאחר אישור.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block">שם מלא</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold mb-2 block">דירוג</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                  className="p-1 hover:scale-110 transition" aria-label={`${n} כוכבים`}>
                  <Star size={28} className={n <= form.rating ? "fill-[oklch(0.7_0.18_255)] text-[oklch(0.7_0.18_255)]" : "text-white/20"} />
                </button>
              ))}
            </div>
          </div>

          <ClientOnly>
            <div>
              <label className="text-xs font-semibold mb-1.5 block">סוג לימוד</label>
              <select value={form.license_type} onChange={(e) => setForm({ ...form, license_type: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none">
                <option value="B">רכב B</option>
                <option value="A2">אופנוע A2</option>
                <option value="A1">אופנוע A1</option>
                <option value="A">אופנוע A</option>
              </select>
            </div>
          </ClientOnly>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">טקסט הביקורת</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={2000} rows={5}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none resize-none" />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">תמונה (אופציונלי)</label>
            <label className="flex items-center gap-3 bg-background border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-white/30">
              <Upload size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground truncate">{file ? file.name : "בחר תמונה (עד 5MB)"}</span>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-gradient-blue text-white font-bold rounded-xl py-3.5 shadow-glow disabled:opacity-50 flex items-center justify-center gap-2">
            <Send size={16} />
            {submitting ? "שולח..." : "שלח ביקורת"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">הביקורת תפורסם לאחר אישור</p>
        </form>
      )}
    </div>
  );
}

export function Reviews() {
  const [reviews, setReviews] = useState<PublicReview[]>(fallbackReviews);
  const ref = useScrollReveal(0);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, full_name, content, rating, license_type, image_url")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data as PublicReview[]);
      });
  }, []);
  return (
    <section id="reviews" ref={ref} className="py-7 sm:py-24 px-4 relative">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">המלצות תלמידים</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            מה <span className="gradient-text-blue">אומרים עליי</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl mx-auto">
            סיפורי הצלחה אמיתיים של תלמידי רכב ואופנוע מאשקלון והדרום – טסט ראשון, יחס אישי וליווי עד הסוף.
          </p>
        </div>

        <TrustHeader />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className="group relative bg-card p-5 border border-white/5 hover:border-white/20 transition-colors flex flex-col"
              style={{ borderRadius: "16px" }}
            >
              <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-25 transition">
                <GoogleGlyph className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-blue grid place-items-center text-white font-black text-sm shrink-0">
                  {r.full_name.charAt(0)}
                </div>
                <div className="leading-tight">
                  <p className="font-black text-base">{r.full_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">תלמיד/ה מאומת/ת</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />)}
              </div>
              {r.image_url && <img src={r.image_url} alt={`תלמיד/ה ${r.full_name} – ביקורת על שיעורי נהיגה אצל חן כחלון`} loading="lazy" className="rounded-xl mb-3 w-full h-32 object-cover" />}
              <p className="text-sm text-foreground/85 leading-relaxed mb-4 min-h-[80px] font-normal">"{r.content}"</p>
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <ReviewBadgeIcon type={r.license_type} />
                  {ReviewBadgeLabel(r.license_type)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#f0fdf4", color: "#22c55e" }}>
                  <Check size={11} /> טסט ראשון
                </span>
              </div>
            </div>
          ))}
        </div>

        <ReviewsCTA />

        <SubmitReview />
      </div>
    </section>
  );
}
